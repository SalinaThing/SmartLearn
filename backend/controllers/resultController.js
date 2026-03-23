import Result from "../models/resultModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";

// CREATE RESULT
export const createResult = catchAsyncErrors(async (req, res, next) => {
    try {
        const { title, courseId, quizId, totalQuestions, correct, wrong } = req.body;

        if (!title || totalQuestions === undefined || correct === undefined) {
            return next(new ErrorHandler(400, "Missing required fields"));
        }

        const computedWrong = wrong !== undefined ? Number(wrong) : Math.max(0, Number(totalQuestions) - Number(correct));

        const payload = {
            title: String(title).trim(),
            courseId,
            quizId,
            totalQuestions: Number(totalQuestions),
            correct: Number(correct),
            wrong: computedWrong,
            user: req.user?._id
        };

        const created = await Result.create(payload);
        res.status(201).json({
            success: true,
            message: "Result created successfully",
            result: created
        });
      
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// LIST RESULTS FOR A USER
export const listResults = catchAsyncErrors(async (req, res, next) => {
    try {
        const query = { user: req.user?._id };
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