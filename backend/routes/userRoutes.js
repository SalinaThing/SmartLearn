import express from "express";
import {
    activateUser, deleteUser,
    getAllUsers, getUserInfo,
    loginUser, logoutUser, registrationUser,
    socialAuth, updateAccessToken,
    updatePassword, updateProfilePicture,
    updateUserInfo, updateUserRole,
    sendDirectEmail
} from "../controllers/userController.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registrationUser);
userRouter.post("/activeUser", activateUser);
userRouter.post("/login", loginUser);
userRouter.post("/refresh", updateAccessToken, (req, res) => {
    if (!req.user) {
        return res.status(200).json({
            success: false,
            message: "No active session",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Access token refreshed",
        user: req.user,
    });
});

userRouter.get("/logout", isAuthenticated, logoutUser);
// userRouter.delete("/delete-student", isAuthenticated, authorizeRoles("teacher"), deleteStudent);

userRouter.get("/me", updateAccessToken, getUserInfo);
userRouter.post("/social-auth", socialAuth);

userRouter.put("/update-userinfo", updateAccessToken, isAuthenticated, updateUserInfo);
userRouter.put("/update-userpass", updateAccessToken, isAuthenticated, updatePassword);
userRouter.put("/update-useravatar", updateAccessToken, isAuthenticated, updateProfilePicture);

userRouter.get("/get-users", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), getAllUsers);

userRouter.put("/update-user-role", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), updateUserRole);
userRouter.delete("/delete-user/:id", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), deleteUser);

userRouter.post("/send-email", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), sendDirectEmail);

export default userRouter;