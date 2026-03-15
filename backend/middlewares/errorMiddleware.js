import { ErrorHandler } from "./errorHandler.js";

const errorMiddleware = (err, req, res, next) => {  // next is required for Express error middleware signature
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong Mongoose ID Error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(400, message);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(400, message);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid. Try again!!!";
    err = new ErrorHandler(400, message);
  }

  // JWT Expire error
  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token is expired. Try again!!!";
    err = new ErrorHandler(400, message);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorMiddleware;
