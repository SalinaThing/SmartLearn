import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";
import CourseModel from "../models/courseModel.js";
import UserModel from "../models/userModel.js";
import OrderModel from "../models/orderModel.js";
import path from "path";
import ejs from "ejs";
import sendEmail from "../utils/sendMail.js";
import { getAllOrdersService, newOrder } from "../services/orderService.js";
import { fileURLToPath } from "url";
import NotificationModel from "../models/notificationModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createOrder = catchAsyncErrors(async (req, res, next) => {
    try{
        const { courseId, payment_info } = req.body || {};
        const user = await UserModel.findById(req.user?._id);

        const courseExistInUser = user?.courses?.some(
            course => course._id.toString() === courseId);

        if (courseExistInUser) {
            return next(new ErrorHandler(400, "Course already purchased"));
        }

        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler(404, "Course not found"));
        }

        const data = {
            courseId: course._id,
            userId: user?._id,
            payment_info,
        };
        
        //Send email notification (non-blocking)
        const mailData = {
            order: {
                _id: course._id.toString().slice(0,6),
                name: course.name,
                price: course.price.toFixed(2),
                date: new Date().toLocaleDateString('en-US', {  
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric' 
                } ),
            }
        };

        const html = await ejs.renderFile(path.join(__dirname, "../mails/orderConfirmationMail.ejs"), {order:mailData});
        try{
            if(user){
                await sendEmail({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "orderConfirmationMail.ejs",
                    data: mailData,
                    html,
                });
            }

        }catch(err){
            return next(new ErrorHandler(500, err.message));
        }

        user?.courses.push(course._id);
        await user?.save();

        await NotificationModel.create({
            user: user._id,
            title: "New Order",
            message: `You have a new order from ${course.name}`,
        });

        course.purchased = (course.purchased || 0) + 1;
        
        await course.save();

        newOrder(data, res, next);
    }catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//get all orders (teacher only)
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
    try {
        getAllOrdersService(res);
       
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});
 