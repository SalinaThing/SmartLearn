import Result from "../models/resultModel.js";
import userModel from "../models/userModel.js";
import QuizModel from "../models/quizModel.js";
import CourseModel from "../models/courseModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";
import { io } from "../serverSocket.js";
import NotificationModel from "../models/notificationModel.js";
import { redis } from "../config/redis.js";
import mongoose from "mongoose";

// CREATE RESULT
export const createResult = async (req, res, next) => {
    try {
        const { title, courseId, quizId, totalQuestions, correct, wrong } = req.body;
        console.log("DEBUG_RESULT: Attempting to create result for", title);

        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Login required" });
        }

        if (req.user?.role !== "student") {
            return res.status(403).json({ success: false, message: "Only students can attempt quizzes" });
        }

        const numTotal = Number(totalQuestions) || 0;
        const numCorrect = Number(correct) || 0;
        const computedWrong = wrong !== undefined ? Number(wrong) : Math.max(0, numTotal - numCorrect);

        // Normalize ID
        const normalizedUserId = String(userId);

        const calculatedScore = numTotal > 0 ? Math.round((numCorrect / numTotal) * 100) : 0;
        let calculatedPerformance = 'Needs Work';
        if (calculatedScore >= 85) calculatedPerformance = 'Excellent';
        else if (calculatedScore >= 70) calculatedPerformance = 'Good';
        else if (calculatedScore >= 50) calculatedPerformance = 'Average';

        const payload = {
            title: String(title || "Quiz").trim(),
            totalQuestions: numTotal,
            correct: numCorrect,
            wrong: computedWrong,
            score: calculatedScore,
            performance: calculatedPerformance,
            user: normalizedUserId, // We will use string for maximum compatibility
            courseId: (courseId && String(courseId).length === 24) ? courseId : undefined,
            quizId: (quizId && String(quizId).length === 24) ? quizId : undefined
        };

        // 1. DIRECT DATABASE INSERTION (Bypassing Mongoose strictness)
        const dbResult = await Result.collection.insertOne({
            ...payload,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log("DEBUG_RESULT: Direct collection insert successful with ID", dbResult.insertedId);

        if (quizId && String(quizId).length === 24) {
            try {
                await QuizModel.findByIdAndUpdate(quizId, { $inc: { attemptsCount: 1 } });
            } catch (e) { console.log("Quiz update error", e.message); }
        }

        // Handle certificate and notifications...
        let certificateAwarded = false;

        if (calculatedScore >= 70) {
            try {
                // Only award certificates for premium (paid) courses
                let isPremiumCourse = false;
                if (courseId) {
                    const course = await CourseModel.findById(courseId);
                    if (course && (course.price > 0 || course.isPremium)) {
                        isPremiumCourse = true;
                    }
                }

                if (isPremiumCourse) {
                    const currentUser = await userModel.findById(userId);
                    if (currentUser) {
                        const quizIdStr = quizId ? String(quizId) : "";
                        const alreadyHasCertificate = currentUser.certificates?.some(c => String(c.quizId || "") === quizIdStr);

                        if (!alreadyHasCertificate) {
                            const certificateData = {
                                title: `Certificate of Achievement for ${title}`,
                                courseId: payload.courseId || String(courseId),
                                quizId: quizIdStr,
                                score: `${numCorrect}/${numTotal}`,
                                date: new Date()
                            };
                            const updatedUser = await userModel.findByIdAndUpdate(userId,
                                { $push: { certificates: certificateData } }, { new: true }
                            );
                            if (updatedUser) {
                                await redis.set(String(userId), JSON.stringify(updatedUser), "EX", 604800);
                                certificateAwarded = true;
                            }
                        }
                    }
                }
            } catch (e) { console.log("Cert error:", e.message); }
        }

        try {
            if (io) {
                await NotificationModel.create({
                    title: "Quiz Attempted",
                    message: `${req.user?.name || "Student"} scored ${numCorrect}/${numTotal}.`,
                    role: 'teacher'
                });
                io.to("teacher").emit("newNotification", { title: "Quiz Attempt" });
            }
        } catch (e) { console.log("Notify error:", e.message); }

        return res.status(201).json({
            success: true,
            message: certificateAwarded ? "Congratulations! Certificate earned." : "Result saved successfully!",
            certificateAwarded,
            result: { ...payload, _id: dbResult.insertedId }
        });

    } catch (err) {
        console.error("DEBUG_RESULT_CRASH:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// LIST RESULTS FOR A USER
export const listResults = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Login required" });
        }

        const normalizedId = String(userId);
        const { courseId } = req.query;

        console.log(`DEBUG_LIST: Fetching for user ${normalizedId}, courseId: [${courseId}]`);

        // 2. Direct collection find to match the direct insert
        const items = await Result.collection.find({
            $or: [
                { user: normalizedId },
                { user: userId },
                { user: mongoose.Types.ObjectId.isValid(normalizedId) ? new mongoose.Types.ObjectId(normalizedId) : normalizedId }
            ]
        }).sort({ createdAt: -1 }).toArray();

        console.log(`DEBUG_LIST: Found ${items.length} raw records`);

        let results = items;
        if (courseId && String(courseId).length === 24) {
            results = items.filter(i => String(i.courseId) === String(courseId));
        }

        return res.status(200).json({
            success: true,
            results
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// GET ALL RESULTS (Teacher only - for monitoring)
export const getAllResults = catchAsyncErrors(async (req, res, next) => {
    try {
        const results = await Result.find().populate("user", "name email").sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            results
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});