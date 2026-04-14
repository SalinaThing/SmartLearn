import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";
import CourseModel from "../models/courseModel.js";
import UserModel from "../models/userModel.js";
import path from "path";
import ejs from "ejs";
import sendEmail from "../utils/sendMail.js";
import { getAllOrdersService, newOrder } from "../services/orderService.js";
import { fileURLToPath } from "url";
import NotificationModel from "../models/notificationModel.js";
import { redis } from "../config/redis.js";
import axios from "axios";
import { io } from "../serverSocket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KHALTI_LOOKUP_URL = "https://a.khalti.com/api/v2/epayment/lookup/";

async function verifyKhaltiPayment(pidx) {
    const secretKey = process.env.KHALTI_SECRET_KEY;
    if (!secretKey || !pidx) {
        return false;
    }
    try {
        const response = await axios.post(
            KHALTI_LOOKUP_URL,
            { pidx },
            {
                headers: {
                    Authorization: `Key ${secretKey}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const status = response.data?.status;
        return typeof status === "string" && status.toLowerCase() === "completed";
    } catch {
        return false;
    }
}

export const createOrder = catchAsyncErrors(async (req, res, next) => {
    try {
        const { courseId, payment_info } = req.body || {};

        if (payment_info) {
            if ("pidx" in payment_info) {
                const ok = await verifyKhaltiPayment(payment_info.pidx);
                if (!ok) {
                    return next(new ErrorHandler(400, "Payment not authorized!"));
                }
            }
        }

        const user = await UserModel.findById(req.user?._id);

        const courseExistInUser = user?.courses?.some(
            course => course.courseId === courseId);

        if (courseExistInUser) {
            return next(new ErrorHandler(400, "Course already purchased"));
        }

        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler(404, "Course not found"));
        }

        // Only allow direct enrollment if price is 0 and no payment_info is provided
        if (course.price > 0 && !payment_info) {
            return next(new ErrorHandler(400, "Payment information is required for premium courses"));
        }

        const data = {
            courseId: course._id,
            userId: user?._id,
            payment_info,
        };

        //Send email notification (non-blocking)
        const mailData = {
            order: {
                _id: course._id.toString().slice(0, 6),
                name: course.name,
                price: course.price.toFixed(2),
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
            }
        };

        const html = await ejs.renderFile(path.join(__dirname, "../mails/orderConfirmationMail.ejs"), { order: mailData });
        try {
            if (user) {
                await sendEmail({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "orderConfirmationMail.ejs",
                    data: mailData,
                });

                // Send copy to admin as requested
                if (user.email !== "salinathing667@gmail.com") {
                    await sendEmail({
                        email: "salinathing667@gmail.com",
                        subject: "New Course Purchase",
                        template: "orderConfirmationMail.ejs",
                        data: mailData,
                    });
                }
            }

        } catch (err) {
            console.log("Email could not be sent:", err.message);
        }

        user?.courses.push({ courseId: course?._id });

        await redis.set(req.user?._id.toString(), JSON.stringify(user));

        await user?.save();

        await NotificationModel.create({
            title: "New Order",
            message: `You have a new order from ${course?.name}`,
        });

        // Emit socket event
        io.emit("newNotification", {
            title: "New Order",
            message: `You have a new order from ${course?.name}`,
        });

        course.purchased = course?.purchased + 1;

        await course.save();

        newOrder(data, res, next);
    } catch (err) {
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

//send Khalti public key (same route name as before)
export const sendStripePublishableKey = catchAsyncErrors(async (req, res) => {
    res.status(200).json({
        publishableKey: process.env.KHALTI_PUBLIC_KEY || "",
    })
});

//New payment — Khalti ePayment initiate
export const newPayment = catchAsyncErrors(async (req, res, next) => {
    try {
        const secretKey = process.env.KHALTI_SECRET_KEY;
        if (!secretKey) {
            return next(new ErrorHandler(500, "Khalti is not configured. Set KHALTI_SECRET_KEY."));
        }

        const amount = Number(req.body.amount);
        const courseId = req.body.courseId;

        if (isNaN(amount) || amount <= 0 || !courseId) {
            console.log("Payment initialization failure - Invalid parameters:", { amount: req.body.amount, courseId });
            return next(new ErrorHandler(400, "Invalid amount or courseId."));
        }

        const appUrl =
            process.env.FRONTEND_URL ||
            process.env.CLIENT_URL ||
            "http://localhost:3000";
        const returnUrl = `${appUrl.replace(/\/$/, "")}/course/${courseId}?khalti_return=1`;
        const websiteUrl = appUrl.replace(/\/$/, "");

        const purchaseOrderId = `course_${courseId}_${Date.now()}`;

        const response = await axios.post(
            "https://a.khalti.com/api/v2/epayment/initiate/",
            {
                return_url: returnUrl,
                website_url: websiteUrl,
                amount: amount,
                purchase_order_id: purchaseOrderId,
                purchase_order_name: "SmartLearn Course",
                customer_info: {
                    name: req.user?.name || "",
                    email: req.user?.email || "",
                },
            },
            {
                headers: {
                    Authorization: `Key ${secretKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const payload = response.data;
        res.status(201).json({
            success: true,
            client_secret: payload.pidx,
            payment_url: payload.payment_url,
        })
    } catch (error) {
        const detail = error.response?.data?.detail || error.response?.data || error.message;
        const message = typeof detail === "string" ? detail : JSON.stringify(detail);
        return next(new ErrorHandler(500, message))
    }
})
