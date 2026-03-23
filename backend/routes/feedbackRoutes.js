import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import { submitFeedback, getAllFeedback } from "../controllers/feedbackController.js";

const feedbackRouter = express.Router();

feedbackRouter.post("/submit-feedback", isAuthenticated, submitFeedback);
feedbackRouter.get("/get-all-feedback", isAuthenticated, authorizeRoles("teacher", "admin"), getAllFeedback);

export default feedbackRouter;
