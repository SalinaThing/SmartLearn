import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import { createResult, listResults, getAllResults } from "../controllers/resultController.js";

const resultRouter = express.Router();

resultRouter.post('/create-result', isAuthenticated, createResult);
resultRouter.get('/get-results', isAuthenticated, listResults);
resultRouter.get('/get-all-results', isAuthenticated, authorizeRoles("teacher", "admin"), getAllResults);

export default resultRouter;