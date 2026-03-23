import QuizModel from "../models/quizModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";

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

        res.status(210).json({
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

        res.status(200).json({
            success: true,
            message: "Quiz deleted successfully",
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});
