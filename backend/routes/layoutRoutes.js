import express from "express";
import { createLayout, editLayout, getLayoutByType } from "../controllers/layoutController.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import { updateAccessToken } from "../controllers/userController.js";

const layoutRouter = express.Router();

layoutRouter.post("/create-layout", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), createLayout);
layoutRouter.put("/edit-layout", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), editLayout);
layoutRouter.get("/get-layout/:type", getLayoutByType)

export default layoutRouter;