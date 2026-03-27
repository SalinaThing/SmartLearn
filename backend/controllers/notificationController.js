import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import NotificationModel from "../models/notificationModel.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";
import cron from "node-cron";

//get notifications
export const getNotifications = catchAsyncErrors(async (req, res, next) => {
    try {
        let notifications;
        if (req.user.role === 'admin' || req.user.role === 'teacher') {
            notifications = await NotificationModel.find({
                $or: [
                    { user: req.user?._id },
                    { role: 'teacher' },
                    { role: 'all' }
                ]
            }).sort({ createdAt: -1 });
        } else {
            // Students only see notifications targeted to them or for all students
            notifications = await NotificationModel.find({
                $or: [
                    { user: req.user?._id },
                    { role: 'student' },
                    { role: 'all' }
                ]
            }).sort({ createdAt: -1 });
        }

        res.status(200).json({
            success: true,
            notifications,
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//Update notification status
export const updateNotificationStatus = catchAsyncErrors(async (req, res, next) => {
    try {
        const notification = await NotificationModel.findById(req.params.id);
        if (!notification) {
            return next(new ErrorHandler(404, "Notification not found"));
        }

        // Authorization: Students can only update their own notifications
        if (req.user.role === 'student' && notification.user?.toString() !== req.user?._id.toString()) {
            return next(new ErrorHandler(403, "You can only update your own notifications"));
        }

        notification.status = 'read';
        await notification.save();

        let notifications;
        if (req.user.role === 'admin' || req.user.role === 'teacher') {
            notifications = await NotificationModel.find({
                $or: [
                    { user: req.user?._id },
                    { role: 'teacher' },
                    { role: 'all' }
                ]
            }).sort({ createdAt: -1 });
        } else {
            notifications = await NotificationModel.find({
                $or: [
                    { user: req.user?._id },
                    { role: 'student' },
                    { role: 'all' }
                ]
            }).sort({ createdAt: -1 });
        }

        res.status(200).json({
            success: true,
            message: "Notification status updated successfully",
            notifications,
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//delete notification - for teachers only 
cron.schedule('0 0 * * *', async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); 
    await NotificationModel.deleteMany({ status: 'read', createdAt: { $lt: thirtyDaysAgo } }); //delete read notifications older than 30 days
    console.log('Deleted read notifications');
});