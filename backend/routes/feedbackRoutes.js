import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import { submitFeedback, getAllFeedback, getStudentFeedback, updateFeedback, deleteFeedback } from "../controllers/feedbackController.js";

const feedbackRouter = express.Router();

feedbackRouter.post("/submit-feedback", isAuthenticated, authorizeRoles("student"), submitFeedback);
feedbackRouter.get("/get-all-feedback", isAuthenticated, authorizeRoles("teacher", "admin"), getAllFeedback);
feedbackRouter.get("/get-student-feedback", isAuthenticated, authorizeRoles("student"), getStudentFeedback);
feedbackRouter.put("/update-feedback/:id", isAuthenticated, authorizeRoles("student"), updateFeedback);
feedbackRouter.delete("/delete-feedback/:id", isAuthenticated, authorizeRoles("student"), deleteFeedback);

export default feedbackRouter;
