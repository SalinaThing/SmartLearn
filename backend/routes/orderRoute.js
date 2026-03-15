import { createOrder, getAllOrders } from "../controllers/orderController.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import { updateAccessToken } from "../controllers/userController.js";
import express from "express";

const orderRouter = express.Router();

orderRouter.post("/create-order", isAuthenticated,createOrder);
orderRouter.get("/get-all-orders", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), getAllOrders);
  

export default orderRouter;