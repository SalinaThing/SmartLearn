import { redis } from "../config/redis.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

//get user by id
export const getUserId = async (id) =>{
    const userJson = await redis.get(id);

    if(userJson){
        const user = JSON.parse(userJson);
        return user;
    }
    return null;
};

//get all users
export const getAllUsersService = async (res) => {
    const users = await userModel.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        users,
    });
};

//Update user role
export const updateUserRoleService = async (id, role, res) => {
    const allowedRoles = new Set(["student", "teacher"]);
    if (!allowedRoles.has(role)) {
        throw new Error("Invalid role. Allowed roles are: student, teacher");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user id");
    }

    const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });

    if (!user) {
        throw new Error("User not found");
    }

    res.status(200).json({
        success: true,
        message: "User role updated successfully",
        user,
    });
};