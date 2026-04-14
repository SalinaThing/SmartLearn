import { ErrorHandler } from "./errorHandler.js";

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err?.statusCode || 500;
  const message = err?.message || "Internal Server Error";

  // Wrong Mongoose ID Error
  if (err?.name === "CastError") {
    return res.status(400).json({ success: false, message: `Resource not found. Invalid: ${err.path}` });
  }

  // Mongoose duplicate key error
  if (err?.code === 11000) {
    return res.status(400).json({ success: false, message: `Duplicate ${Object.keys(err.keyValue)} entered` });
  }

  // Wrong JWT error
  if (err?.name === "JsonWebTokenError") {
    return res.status(400).json({ success: false, message: "JSON Web Token is invalid. Try again!!!" });
  }

  // JWT Expire error
  if (err?.name === "TokenExpiredError") {
    return res.status(400).json({ success: false, message: "JSON Web Token is expired. Try again!!!" });
  }

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

export default errorMiddleware;
