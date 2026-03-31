import dotenv from "dotenv";
dotenv.config();
import { redis } from "../config/redis.js";


//parse env variables to integrate with fallback redis
export const accessTokenExpire = parseInt(
    process.env.ACCESS_TOKEN_EXPIRE || '300',
    10
); // Default to 5 minutes (300 seconds) if not set
export const refreshTokenExpire = parseInt(
    process.env.REFRESH_TOKEN_EXPIRE || '1200',
    10
);// Default to 20 minutes (1200 seconds) if not set

// opt to cookies
export const accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 1000), // treats default 300 as 300 minutes (5 hours)
    maxAge: accessTokenExpire * 60 * 1000, 
    httpOnly: true,
    sameSite: "lax",
};

export const refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), // treats default 1200 as 1200 days
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000, 
    httpOnly: true,
    sameSite: "lax",
};

export const sendToken = async (user, statusCode, res) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    // normalize roles (legacy "user" -> "student")
    const allowedRoles = new Set(["student", "teacher", "admin"]);
    if (!allowedRoles.has(user.role)) {
        user.role = "student";
    }

    // upload session to redis with 7 day expiration
    await redis.set(user._id.toString(), JSON.stringify(user), "EX", 604800); 

    // only set to true in production
    if (process.env.NODE_ENV === "production") {
        accessTokenOptions.secure = true;
    }

    res.cookie("accessToken", accessToken, accessTokenOptions);
    res.cookie("refreshToken", refreshToken, refreshTokenOptions);

    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
}