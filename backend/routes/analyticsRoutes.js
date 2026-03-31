import express from "express";
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from "../controllers/analyticsController.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import { updateAccessToken } from "../controllers/userController.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/get-user-analytics", updateAccessToken, isAuthenticated, authorizeRoles("admin", "teacher"), getUserAnalytics);
analyticsRouter.get("/get-course-analytics", updateAccessToken, isAuthenticated, authorizeRoles("admin", "teacher"), getCourseAnalytics);
analyticsRouter.get("/get-order-analytics", updateAccessToken, isAuthenticated, authorizeRoles("admin", "teacher"), getOrderAnalytics);

export default analyticsRouter;