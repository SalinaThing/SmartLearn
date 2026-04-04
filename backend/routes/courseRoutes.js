import express from "express";
import multer from "multer";
import {
    addAnswer, addQuestion,
    editCourse, uploadCourse,
    getAllCourse, getCourseByUser, getSingleCourse,
    addReview, addReplyToReview,
    getTeacherAllCourses,
    deleteCourse,
    uploadVideo,
    uploadPdf,
    getQuestionsByUser,
    getReviewsByUser,
    editReview,
    editQuestion,
    updateCourseProgress,
    logCourseView,
    logSearchQuery,
    getSuggestedCourses
}
    from "../controllers/courseController.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import { updateAccessToken } from "../controllers/userController.js";

const courseRouter = express.Router();

// Multer for PDF uploads (in-memory, max 1GB)
const pdfUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"), false);
        }
    },
});

// Multer for Video uploads (in-memory, max 1GB)
const videoUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("video/")) {
            cb(null, true);
        } else {
            cb(new Error("Only video files are allowed"), false);
        }
    },
});

courseRouter.post("/update-course-progress", updateAccessToken, isAuthenticated, updateCourseProgress);
courseRouter.post("/create-course", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), uploadCourse);
courseRouter.put("/edit-course/:id", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), editCourse);

courseRouter.get("/get-single-course/:id", getSingleCourse);
courseRouter.get("/get-all-course", getAllCourse);
courseRouter.get("/get-course-by-user/:id", updateAccessToken, isAuthenticated, getCourseByUser);

courseRouter.put("/add-question", updateAccessToken, isAuthenticated, addQuestion);
courseRouter.put("/add-answer", updateAccessToken, isAuthenticated, addAnswer);
courseRouter.put("/add-review/:id", updateAccessToken, isAuthenticated, addReview);
courseRouter.put("/add-reply-to-review", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), addReplyToReview);

courseRouter.get("/get-teacher-courses", isAuthenticated, authorizeRoles("teacher", "admin"), getTeacherAllCourses);

courseRouter.post("/log-course-view", updateAccessToken, isAuthenticated, logCourseView);
courseRouter.post("/log-search-query", updateAccessToken, isAuthenticated, logSearchQuery);
courseRouter.get("/get-suggested-courses", updateAccessToken, isAuthenticated, getSuggestedCourses);

courseRouter.post("/upload-video", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), videoUpload.single("video"), uploadVideo);
courseRouter.post("/upload-pdf", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), pdfUpload.single("pdf"), uploadPdf);

courseRouter.get("/get-questions-by-user", updateAccessToken, isAuthenticated, getQuestionsByUser);
courseRouter.get("/get-reviews-by-user", updateAccessToken, isAuthenticated, getReviewsByUser);
courseRouter.put("/edit-review", updateAccessToken, isAuthenticated, editReview);
courseRouter.put("/edit-question", updateAccessToken, isAuthenticated, editQuestion);

courseRouter.delete("/delete-course/:id", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), deleteCourse);



export default courseRouter;
