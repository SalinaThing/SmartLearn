import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";
import CourseModel from "../models/courseModel.js";
import OrderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { generateLast12MonthsAnalytics } from "../utils/analyticsGenerator.js";


//get user analytics ---only for teachers
export const getUserAnalytics = catchAsyncErrors(async (req, res, next) => {
    try {
        const users = await generateLast12MonthsAnalytics(userModel);
        res.status(200).json({
            success: true,
            message: "User analytics retrieved successfully",
            users,
        });

    }catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//get course analytics ---only for teachers
export const getCourseAnalytics = catchAsyncErrors(async (req, res, next) => {
    try {
        const courses = await generateLast12MonthsAnalytics(CourseModel);
        res.status(200).json({
            success: true,
            message: "Course analytics retrieved successfully",
            courses,
        });

    }catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//get order analytics ---only for teachers
export const getOrderAnalytics = catchAsyncErrors(async (req, res, next) => {
    try {
        const orders = await generateLast12MonthsAnalytics(OrderModel);
        res.status(200).json({
            success: true,
            message: "Order analytics retrieved successfully",
            orders,
        });

    }catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});