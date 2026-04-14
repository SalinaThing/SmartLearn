import { catchAsyncErrors } from "./catchAsyncErrors.js";
import { ErrorHandler } from "./errorHandler.js";
import jwt from "jsonwebtoken";
import { redis } from "../config/redis.js";

//Check if user is authenticated or not
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    console.log("TRACE: isAuthenticated started for", req.originalUrl);
    const accessToken = req.cookies.accessToken;

    // Check if token exists
    if (!accessToken) {
        return next(new ErrorHandler(400, "Please login to access this resource"));
    }

    // Verify token safely
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);

    if (!decoded) {
        return next(new ErrorHandler(400, "Invalid token or access token isnot valid, please login again"));
    }

    const user = await redis.get(decoded.id);

    if (!user) {
        return next(new ErrorHandler(400, "User not found, please login again"));
    }

    req.user = JSON.parse(user);

    next();
});

// validate user roles
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log("TRACE: authorizeRoles checking", roles, "against", req.user?.role);
        if (!roles.includes(req.user?.role || '')) {
            return next(new ErrorHandler(403, `Role: ${req.user?.role} is not allowed to access this resource`));
        }
        next();
    };
};
