import Result from "../models/resultModel.js";
import userModel from "../models/userModel.js";
import QuizModel from "../models/quizModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";
import { io } from "../serverSocket.js";
import NotificationModel from "../models/notificationModel.js";

// CREATE RESULT
export const createResult = catchAsyncErrors(async (req, res, next) => {
    try {
        const { title, courseId, quizId, totalQuestions, correct, wrong } = req.body;

        if (!title || totalQuestions === undefined || correct === undefined) {
            return next(new ErrorHandler(400, "Missing required fields"));
        }

        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return next(new ErrorHandler(400, "User context not found"));
        }

        const computedWrong = wrong !== undefined ? Number(wrong) : Math.max(0, Number(totalQuestions) - Number(correct));

        const payload = {
            title: String(title).trim(),
            totalQuestions: Number(totalQuestions),
            correct: Number(correct),
            wrong: computedWrong,
            user: userId
        };

        // Explicitly check if IDs are valid ObjectIds to avoid Cast errors
        if (courseId && courseId.length === 24) payload.courseId = courseId;
        if (quizId && quizId.length === 24) payload.quizId = quizId;

        const created = await Result.create(payload);

        // Update quiz attempt count
        if (quizId && quizId.length === 24) {
            await QuizModel.findByIdAndUpdate(quizId, {
                $inc: { attemptsCount: 1 }
            });
        }

        // Award certificate if student scores 70% or higher
        const calculatedScore = (Number(correct) / Number(totalQuestions)) * 100;
        if (calculatedScore >= 70) {
            try {
                const currentUser = await userModel.findById(userId);
                if (currentUser) {
                    const quizIdStr = quizId ? String(quizId) : "";
                    const alreadyHasCertificate = currentUser.certificates?.some(c => String(c.quizId) === quizIdStr);

                    if (!alreadyHasCertificate) {
                        const certificateData = {
                            title: `Certificate of Achievement for ${title}`,
                            courseId: payload.courseId || null,
                            quizId: quizIdStr,
                            score: `${correct}/${totalQuestions}`,
                            date: new Date()
                        };
                        
                        await userModel.findByIdAndUpdate(userId, {
                            $push: { certificates: certificateData }
                        });
                    }
                }
            } catch (error) {
                console.log("Certificate award error:", error);
            }
        }

        // Notify teachers
        try {
            await NotificationModel.create({
                title: "Quiz Attempted",
                message: `${req.user.name} has completed the quiz "${title}" with a score of ${correct}/${totalQuestions}.`,
                role: 'teacher'
            });
            io.to("teacher").emit("newNotification", {
                title: "Quiz Attempted",
                message: `${req.user.name} has completed the quiz "${title}" with a score of ${correct}/${totalQuestions}.`,
            });
        } catch (error) {
            console.log("Result notification error:", error);
        }

        res.status(201).json({
            success: true,
            message: "Result created successfully",
            result: created
        });

    } catch (err) {
        console.error("CREATE_RESULT_ERROR:", err);
        return next(new ErrorHandler(500, err.message));
    }
});

// LIST RESULTS FOR A USER
export const listResults = catchAsyncErrors(async (req, res, next) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const query = { user: userId };
        const { courseId } = req.query;

        if (courseId) {
            query.courseId = courseId;
        }

        const items = await Result.find(query).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            results: items
        });

    }
    catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// GET ALL RESULTS (Teacher only - for monitoring)
export const getAllResults = catchAsyncErrors(async (req, res, next) => {
    try {
        const results = await Result.find().populate("user", "name email").sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            results
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});