import userModel from "../models/userModel.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import sendMail from "../utils/sendMail.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { accessTokenOptions, 
         refreshTokenOptions, 
         sendToken } from "../utils/jwt.js";
import { redis } from "../config/redis.js";
import cloudinary from "cloudinary";
import { getAllUsersService, updateUserRoleService } from "../services/userService.js";

const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

// --- REGISTER USER ---
export const registrationUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, avatar, role } = req.body;

    // Check if fields exist
    if (!name || !email || !password) {
        return next(new ErrorHandler(400, "Please enter all required fields"));
    }

    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
        throw new ErrorHandler(400, "Email already exists");
    }

    const allowedRoles = new Set(["student", "teacher", "admin"]);
    const normalizedRole = allowedRoles.has(role) ? role : "student";

    const user = { name, email, password, avatar, role: normalizedRole };
    const activationToken = createdActivationToken(user);
    const activationCode = activationToken.activationCode;

    const data = { user: { name: user.name }, activationCode };

    await ejs.renderFile(
        path.join(_dirname, "../mails/activationMail.ejs"),
        data
    );
    await sendMail({
        email: user.email,
        subject: "Activate your account",
        template: "activationMail.ejs",
        data,
    });

    res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account`,
        token: activationToken.token,
    });
});

// --- CREATE ACTIVATION TOKEN ---
export const createdActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign(
        { user, activationCode },
        process.env.ACTIVATION_SECRET,
        { expiresIn: "30m" }
    );
    return { token, activationCode };
};

// --- ACTIVATE USER ---
export const activateUser = catchAsyncErrors(async (req, res, next) => {
    const { activation_token, activation_code } = req.body;

    // Verify token
    let newUser;
    try {
        newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
    } catch (error) {
        throw new ErrorHandler(400, "Invalid or expired activation token");
    }

    const { user, activationCode } = newUser;

    if (activationCode !== activation_code) {
        throw new ErrorHandler(400, "Invalid activation code");
    }

    const { name, email, password, avatar, role } = user;

    const checkUser = await userModel.findOne({ email });
    if (checkUser) {
        throw new ErrorHandler(400, "Email already exists");
    }

    await userModel.create({
        name,
        email,
        password,
        avatar,
        role: role || "student",
        isVerified: true,
    });

    res.status(201).json({
        success: true,
        message: "Account activated successfully!",
    });
});

// LOGIN USER
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  try{
    const { email, password } = req.body;

    if(!email || !password){
      return next(new ErrorHandler(400, "Please provide email and password"));
    }
    
    const user = await userModel.findOne({ email }).select("+password");
    if(!user){
      return next(new ErrorHandler(400, "Invalid email or password"));
    }
    
    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch){
      return next(new ErrorHandler(400, "Invalid email or password"));
    }

    sendToken(user, 200, res);
    
  }catch(err){
    return next(new ErrorHandler(400, err.message));
  }
});

//LOGOUT USER
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    try{
        res.cookie("accessToken", "", {maxAge: 1});
        res.cookie("refreshToken", "", {maxAge: 1});

        const userId = req.user?._id || '';
         if (userId) {
            await redis.del(userId.toString()); // IMPORTANT: await + string
        }
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    }catch(err){
        return next(new ErrorHandler(400, err.message));
    }
});

//update access token
export const updateAccessToken = catchAsyncErrors(async (req, res, next) => {
    try {
        const refreshTokenFromCookie = req.cookies?.refreshToken;

        if (!refreshTokenFromCookie) {
            // No refresh token means unauthenticated user. proceed without throwing.
            req.user = null;
            return next();
        }

        const decoded = jwt.verify(refreshTokenFromCookie, process.env.REFRESH_TOKEN);

        if (!decoded) {
            return next(new ErrorHandler(400, "Invalid refresh token, please login again"));
        }

        const session = await redis.get(decoded.id);

        if (!session) {
            return next(new ErrorHandler(400, "Session expired, please login again"));
        }

        const user = JSON.parse(session);  

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.ACCESS_TOKEN,
            { expiresIn: "30m" }
        );

        const newRefreshToken = jwt.sign(
            { id: user._id },
            process.env.REFRESH_TOKEN,
            { expiresIn: "3d" }
        );

        req.user = user;

        res.cookie("accessToken", accessToken, accessTokenOptions);
        res.cookie("refreshToken", newRefreshToken, refreshTokenOptions);

        await redis.set(user._id.toString(), JSON.stringify(user), "EX", 604800); // Update in 7 days 
        next();
 
    } catch (err) {
        return next(new ErrorHandler(400, err.message));
    }
});

//get user info
export const getUserInfo = catchAsyncErrors(async (req, res, next) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "User not authenticated",
                user: null,
            });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return next(new ErrorHandler(404, "User not found"));
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        return next(new ErrorHandler(400, err.message));
    }
});

//social auth
export const socialAuth = catchAsyncErrors(async(req, res, next)=>{
    try{
        const { email, name, avatar } = req.body || {};

        if (!email || !name) {
            return next(new ErrorHandler(400, "Please provide name and email"));
        }

        let user = await userModel.findOne({ email });

        if (!user) {
            const normalizedAvatar =
                typeof avatar === "string"
                    ? { public_id: "social", url: avatar }
                    : avatar;

            user = await userModel.create({
                email,
                name,
                avatar: normalizedAvatar,
                isVerified: true,
                role: "student",
            });
        } else if (user.role !== "student" && user.role !== "teacher") {
            // normalize legacy/invalid roles like "user"
            user.role = "student";
            await user.save();
        }

        sendToken(user, 200, res);
    }catch (err){
        return next(new ErrorHandler(400, err.message));
    }

})

//update user info
export const updateUserInfo = catchAsyncErrors(async(req, res, next)=>{
    try{
        const {name, email} = req.body || {};
        const userId = req.user?._id;
        
        if (!userId) {
            return next(new ErrorHandler(400, "User not found"));
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return next(new ErrorHandler(404, "User not found"));
        }

        if(email){
            const isEmailExist = await userModel.findOne({email, _id: {$ne: userId}});
            if(isEmailExist){
                return next(new ErrorHandler(400, "Email already exist"))
            }
            user.email=email;
        }

        if(name){
            user.name=name;
        }

        await user.save();
        await redis.set(userId.toString(), JSON.stringify(user));

        res.status(200).json({
            success:true,
            user,
        })


    }catch (err){
        return next(new ErrorHandler(400, err.message));
    }

})

//Update userpassword
export const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body || {};
    const userId = req.user._id;

    // Validate inputs
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide old password and new password"
      });
    }

    // Get user with password field
    const user = await userModel.findById(userId).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    // Compare old password
    const isPasswordMatch = await user?.comparePassword(oldPassword);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect"
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    await redis.set(req.user?._id,JSON.stringify(user));

    // Clear Redis cache
    await redis.del(userId.toString());

    res.status(201).json({
      success: true,
      message: "Password updated successfully",
      user,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
};

//update profile picture
export const updateProfilePicture = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user?._id;
  const { avatar } = req.body;

  if (!avatar) {
    return next(new ErrorHandler("No avatar provided", 400));
  }

  const user = await userModel.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  try {
    // Delete old image if exists
    if (user.avatar?.public_id) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }

    // Upload new image
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale", // ensures the image resizes properly
    });

    // Update user avatar
    user.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    await user.save();
    await redis.set(userId.toString(), JSON.stringify(user));

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Cloudinary error:", err);
    return next(new ErrorHandler("Failed to update profile picture", 500));
  }
});


//get all users (teacher only)
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    try {
        getAllUsersService(res); 
       
    } catch (err) {
        return next(new ErrorHandler(400, err.message));
    }
});

//update user role ---teacher only
export const updateUserRole = catchAsyncErrors(async (req, res, next) => {
    try {
        const { id, role } = req.body || {};

        if (!id || !role) {
            return next(new ErrorHandler(400, "Please provide user id and role"));
        }

        await updateUserRoleService(id, role, res);

    } catch (err) {
        return next(new ErrorHandler(400, err.message));
    }
});

//Delete user --Teacher only
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const { id } = req.params || {};
        const user = await userModel.findById(id);

        if (!user) {
            return next(new ErrorHandler(404, "User not found"));
        }

        await user.deleteOne({id});

        await redis.del(id.toString());

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (err) {
        return next(new ErrorHandler(400, err.message));
    }
});