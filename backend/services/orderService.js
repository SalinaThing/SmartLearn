import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import OrderModel from "../models/orderModel.js";

//create new order
export const newOrder = catchAsyncErrors(async (data, res, next) => {
    const order =  await OrderModel.create(data);

    res.status(201).json({
        success: true,
        message: "Order created successfully",
        order,
    });
}
);

//get all orders
export const getAllOrdersService = async (res) => {
    const orders = await OrderModel.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        orders,
    });
};