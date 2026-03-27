import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import { createQuiz, getQuizzesByCourse, updateQuiz, deleteQuiz } from "../controllers/quizController.js";

const quizRouter = express.Router();

quizRouter.post("/create-quiz", isAuthenticated, authorizeRoles("teacher"), createQuiz);
quizRouter.get("/get-quizzes/:courseId", isAuthenticated, getQuizzesByCourse);
quizRouter.put("/update-quiz/:id", isAuthenticated, authorizeRoles("teacher"), updateQuiz);
quizRouter.delete("/delete-quiz/:id", isAuthenticated, authorizeRoles("teacher"), deleteQuiz);

export default quizRouter;
