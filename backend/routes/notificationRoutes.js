import express from "express";
import { getNotifications, updateNotificationStatus } from "../controllers/notificationController.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import { updateAccessToken } from "../controllers/userController.js";


const notificationRouter = express.Router();

notificationRouter.get("/get-all-notifications", updateAccessToken, isAuthenticated, authorizeRoles ("teacher"), getNotifications);
notificationRouter.put("/update-notification-status/:id", updateAccessToken, isAuthenticated, authorizeRoles ("teacher"), updateNotificationStatus);
    
export default notificationRouter;