import FeedbackModel from "../models/feedbackModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";

// SUBMIT FEEDBACK
export const submitFeedback = catchAsyncErrors(async (req, res, next) => {
    try {
        const { courseId, rating, comment } = req.body;

        if (!rating || !comment) {
            return next(new ErrorHandler(400, "Please provide rating and comment"));
        }

        const feedback = await FeedbackModel.create({
            user: req.user?._id,
            courseId,
            rating,
            comment,
        });

        res.status(201).json({
            success: true,
            feedback,
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// GET ALL FEEDBACK (Teacher/Admin only)
export const getAllFeedback = catchAsyncErrors(async (req, res, next) => {
    try {
        const feedback = await FeedbackModel.find().populate("user", "name email").populate("courseId", "name");

        res.status(200).json({
            success: true,
            feedback,
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});
