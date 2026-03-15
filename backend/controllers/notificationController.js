import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import NotificationModel from "../models/notificationModel.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";
import cron from "node-cron";

//get all notifications-for teachers only
export const getNotifications = catchAsyncErrors(async (req, res, next) => {
    try{
        const notifications = await NotificationModel.find().sort({ createdAt: -1 });

        res.status(201).json({
            success: true,
            notifications,
        });

    }catch(err){
        return next(new ErrorHandler(500, err.message));
    }
});

//Update notification status  -for teachers only
export const updateNotificationStatus = catchAsyncErrors(async (req, res, next) => {
    try{
        const notification = await NotificationModel.findById(req.params.id);
        if (!notification) {
            return next(new ErrorHandler(404, "Notification not found"));
        } else {
            notification.status ? notification.status = 'read' : notification.status = 'unread';
        }
        await notification.save();

        const notifications = await NotificationModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Notification status updated successfully",
            notifications,
        });
    }catch(err){
        return next(new ErrorHandler(500, err.message));
    }
});

//delete notification - for teachers only 
cron.schedule('0 0 * * *', async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); 
    await NotificationModel.deleteMany({ status: 'read', createdAt: { $lt: thirtyDaysAgo } }); //delete read notifications older than 30 days
    console.log('Deleted read notifications');
});