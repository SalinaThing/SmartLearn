import express from "express";
import multer from "multer";
import { addAnswer, addQuestion, 
         editCourse, uploadCourse,
         getAllCourse, getCourseByUser, getSingleCourse, 
         addReview, addReplyToReview,
         getTeacherAllCourses,
         deleteCourse,
         generateVideoUrl,
         uploadVideo,
         uploadPdf } 
        from "../controllers/courseController.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import { updateAccessToken } from "../controllers/userController.js";

const courseRouter = express.Router();

// Multer for video uploads (in-memory, max 100MB)
const videoUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 },
});

// Multer for PDF uploads (in-memory, max 20MB)
const pdfUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"), false);
        }
    },
});

courseRouter.post("/create-course", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), uploadCourse);
courseRouter.put("/edit-course/:id", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), editCourse);

courseRouter.get("/get-single-course/:id", getSingleCourse);
courseRouter.get("/get-all-course", getAllCourse);
courseRouter.get("/get-course-by-user/:id", updateAccessToken, isAuthenticated, getCourseByUser);

courseRouter.put("/add-question", updateAccessToken, isAuthenticated, addQuestion);
courseRouter.put("/add-answer", updateAccessToken, isAuthenticated, addAnswer);
courseRouter.put("/add-review/:id", updateAccessToken, isAuthenticated, addReview);
courseRouter.put("/add-reply-to-review", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), addReplyToReview);
   
courseRouter.get("/get-teacher-courses", isAuthenticated, authorizeRoles("teacher"), getTeacherAllCourses);

courseRouter.post("/getVdoCipherOTP", generateVideoUrl);
courseRouter.post("/upload-video", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), videoUpload.single("video"), uploadVideo);
courseRouter.post("/upload-pdf", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), pdfUpload.single("pdf"), uploadPdf);

courseRouter.delete("/delete-course/:id", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), deleteCourse);

export default courseRouter;
