import express from "express";
import { updateAccessToken } from "../controllers/userController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import { courseAssistantChat } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post(
  "/chat/course-assistant",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("student"),
  courseAssistantChat
);

export default chatRouter;
