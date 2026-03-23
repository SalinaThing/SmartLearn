import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import { createQuiz, getQuizzesByCourse, updateQuiz, deleteQuiz } from "../controllers/quizController.js";

const quizRouter = express.Router();

quizRouter.post("/create-quiz", isAuthenticated, authorizeRoles("teacher", "admin"), createQuiz);
quizRouter.get("/get-quizzes/:courseId", isAuthenticated, getQuizzesByCourse);
quizRouter.put("/update-quiz/:id", isAuthenticated, authorizeRoles("teacher", "admin"), updateQuiz);
quizRouter.delete("/delete-quiz/:id", isAuthenticated, authorizeRoles("teacher", "admin"), deleteQuiz);

export default quizRouter;
