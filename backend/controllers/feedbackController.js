import FeedbackModel from "../models/feedbackModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";
import { io } from "../serverSocket.js";
import NotificationModel from "../models/notificationModel.js";

// SUBMIT FEEDBACK
export const submitFeedback = catchAsyncErrors(async (req, res, next) => {
    try {
        const { courseId, rating, comment, contentId, contentTitle } = req.body;

        if (req.user.role !== 'student') {
            return next(new ErrorHandler(403, "Only students can submit feedback"));
        }

        if (!rating || !comment) {
            return next(new ErrorHandler(400, "Please provide rating and comment"));
        }

        const feedback = await FeedbackModel.create({
            user: req.user?._id,
            courseId,
            contentId,
            contentTitle,
            rating,
            comment,
        });

        res.status(201).json({
            success: true,
            feedback,
        });

        // Notify teachers and admins
        try {
            // Admin Notification
            await NotificationModel.create({
                title: "New Feedback Received",
                message: `A student has given feedback for ${contentTitle || "a course"}.`,
                role: 'admin',
                path: '/admin/feedback'
            });
            // Teacher Notification
            await NotificationModel.create({
                title: "New Feedback Received",
                message: `A student has given feedback for ${contentTitle || "a course"}.`,
                role: 'teacher',
                path: '/teacher/feedback'
            });

            // Emit socket event to both
            io.to("teacher").to("admin").emit("newNotification", {
                title: "New Feedback Received",
                message: `A student has given feedback for ${contentTitle || "a course"}.`,
            });
        } catch (error) {
            console.log("Feedback notification error:", error);
        }
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// GET ALL FEEDBACK (Teacher/Admin only)
export const getAllFeedback = catchAsyncErrors(async (req, res, next) => {
    try {
        const rawFeedback = await FeedbackModel.find()
            .populate("user", "name role") // Just get name and role
            .populate("courseId", "name");

        const feedback = rawFeedback.map(f => {
            const doc = f.toObject();
            if (req.user.role === 'teacher') {
                if (doc.user) {
                    doc.user.name = "Student"; // Hide student name from teacher
                } else {
                    doc.user = { name: "Student" };
                }
            }
            return doc;
        });

        res.status(200).json({
            success: true,
            feedback,
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// GET STUDENT FEEDBACK
export const getStudentFeedback = catchAsyncErrors(async (req, res, next) => {
    try {
        const feedback = await FeedbackModel.find({ user: req.user?._id }).populate("courseId", "name");

        res.status(200).json({
            success: true,
            feedback,
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// UPDATE FEEDBACK
export const updateFeedback = catchAsyncErrors(async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const feedbackId = req.params.id;

        const feedback = await FeedbackModel.findById(feedbackId);

        if (!feedback) {
            return next(new ErrorHandler(404, "Feedback not found"));
        }

        if (req.user.role !== 'student') {
            return next(new ErrorHandler(403, "Only students can update feedback"));
        }

        // Check ownership
        if (feedback.user.toString() !== req.user?._id.toString()) {
            return next(new ErrorHandler(403, "You can only update your own feedback"));
        }

        feedback.rating = rating || feedback.rating;
        feedback.comment = comment || feedback.comment;

        await feedback.save();

        res.status(200).json({
            success: true,
            feedback,
        });

        // Notify teachers and admins
        try {
            // Admin Notification
            await NotificationModel.create({
                title: "Feedback Updated",
                message: `A student has updated their feedback for ${feedback.contentTitle || "a course"}.`,
                role: 'admin',
                path: '/admin/feedback'
            });
            // Teacher Notification
            await NotificationModel.create({
                title: "Feedback Updated",
                message: `A student has updated their feedback for ${feedback.contentTitle || "a course"}.`,
                role: 'teacher',
                path: '/teacher/feedback'
            });

            io.to("teacher").to("admin").emit("newNotification", {
                title: "Feedback Updated",
                message: `A student has updated their feedback for ${feedback.contentTitle || "a course"}.`,
            });
        } catch (error) {
            console.log("Feedback update notification error:", error);
        }
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});
// DELETE FEEDBACK
export const deleteFeedback = catchAsyncErrors(async (req, res, next) => {
    try {
        const feedbackId = req.params.id;
        const feedback = await FeedbackModel.findById(feedbackId);

        if (!feedback) {
            return next(new ErrorHandler(404, "Feedback not found"));
        }

        if (req.user.role !== 'student') {
            return next(new ErrorHandler(403, "Only students can delete feedback"));
        }

        if (req.user.role === 'student' && feedback.user.toString() !== req.user?._id.toString()) {
            return next(new ErrorHandler(403, "You can only delete your own feedback"));
        }

        await feedback.deleteOne();

        res.status(200).json({
            success: true,
            message: "Feedback deleted successfully",
        });

        // Notify teachers and admins
        try {
            // Admin Notification
            await NotificationModel.create({
                title: "Feedback Deleted",
                message: `A student has deleted their feedback for ${feedback.contentTitle || "a course"}.`,
                role: 'admin',
                path: '/admin/feedback'
            });
            // Teacher Notification
            await NotificationModel.create({
                title: "Feedback Deleted",
                message: `A student has deleted their feedback for ${feedback.contentTitle || "a course"}.`,
                role: 'teacher',
                path: '/teacher/feedback'
            });

            io.to("teacher").to("admin").emit("newNotification", {
                title: "Feedback Deleted",
                message: `A student has deleted their feedback for ${feedback.contentTitle || "a course"}.`,
            });
        } catch (error) {
            console.log("Feedback delete notification error:", error);
        }
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});
