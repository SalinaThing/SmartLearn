import Announcement from '../models/announcementModel.js';
import { ErrorHandler } from '../middlewares/errorHandler.js';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';

// Create Announcement
export const createAnnouncement = catchAsyncErrors(async (req, res, next) => {
    try {
        const { title, content, courseId } = req.body;
        const announcement = await Announcement.create({
            title,
            content,
            courseId,
            userId: req.user._id
        });

        res.status(201).json({
            success: true,
            announcement
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Get Announcements by Course
export const getAnnouncementsByCourse = catchAsyncErrors(async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const announcements = await Announcement.find({ courseId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            announcements
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Delete Announcement
export const deleteAnnouncement = catchAsyncErrors(async (req, res, next) => {
    try {
        const { id } = req.params;
        const announcement = await Announcement.findByIdAndDelete(id);

        if (!announcement) {
            return next(new ErrorHandler("Announcement not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Announcement deleted successfully"
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
