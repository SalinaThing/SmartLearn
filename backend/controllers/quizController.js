import QuizModel from "../models/quizModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";
import { io } from "../serverSocket.js";
import NotificationModel from "../models/notificationModel.js";
import userModel from "../models/userModel.js";

// CREATE QUIZ
export const createQuiz = catchAsyncErrors(async (req, res, next) => {
    try {
        const { courseId, title, description, questions } = req.body;

        if (!courseId || !title || !questions) {
            return next(new ErrorHandler(400, "Please provide all required fields"));
        }

        const quiz = await QuizModel.create({
            courseId,
            title,
            description,
            questions,
        });

        // Notify all students
        try {
            await NotificationModel.create({
                title: "New Quiz Available",
                message: `A new quiz "${quiz.title}" has been added to the platform.`,
                role: 'student'
            });
            
            io.to("student").emit("newNotification", {
                action: "Assessment New",
                title: "New Quiz",
                message: `New quiz "${quiz.title}" is now available`
            });
        } catch (error) {
            console.log("Quiz notification error:", error);
        }

        res.status(201).json({
            success: true,
            quiz,
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// GET ALL QUIZZES FOR A COURSE
export const getQuizzesByCourse = catchAsyncErrors(async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const quizzes = await QuizModel.find({ courseId });

        res.status(200).json({
            success: true,
            quizzes,
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// UPDATE QUIZ
export const updateQuiz = catchAsyncErrors(async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const quiz = await QuizModel.findByIdAndUpdate(id, data, { new: true });

        if (!quiz) {
            return next(new ErrorHandler(404, "Quiz not found"));
        }

        // Notify enrolled students
        try {
            const enrolledUsers = await userModel.find({ "courses.courseId": quiz.courseId });
            
            for (const student of enrolledUsers) {
                await NotificationModel.create({
                    user: student._id,
                    title: "Quiz Updated",
                    message: `Quiz "${quiz.title}" in your course has been updated.`,
                    role: 'student'
                });
                io.to(student._id.toString()).emit("newNotification", {
                    action: "Assessment Updated",
                    title: "Quiz Updated",
                    message: `Quiz "${quiz.title}" has been updated`
                });
            }
        } catch (error) {
            console.log("Quiz update notification error:", error);
        }

        res.status(200).json({
            success: true,
            quiz,
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// DELETE QUIZ
export const deleteQuiz = catchAsyncErrors(async (req, res, next) => {
    try {
        const { id } = req.params;

        const quiz = await QuizModel.findByIdAndDelete(id);

        if (!quiz) {
            return next(new ErrorHandler(404, "Quiz not found"));
        }

        // Notify enrolled students
        try {
             const enrolledUsers = await userModel.find({ "courses.courseId": quiz.courseId });
             
             for (const student of enrolledUsers) {
                 await NotificationModel.create({
                     user: student._id,
                     title: "Quiz Removed",
                     message: `Quiz "${quiz.title}" has been removed from your course.`,
                     role: 'student'
                 });
                 io.to(student._id.toString()).emit("newNotification", {
                     action: "Assessment Deleted",
                     title: "Quiz Deleted",
                     message: `Quiz "${quiz.title}" has been removed`
                 });
             }
        } catch (error) {
            console.log("Quiz delete notification error:", error);
        }

        res.status(200).json({
            success: true,
            message: "Quiz deleted successfully",
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});
