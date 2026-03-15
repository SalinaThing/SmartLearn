import express from "express";
import { addAnswer, addQuestion, 
         editCourse, uploadCourse,
         getAllCourse, getCourseByUser, getSingleCourse, 
         addReview, addReplyToReview,
         getTeacherAllCourses,
         deleteCourse,
         generateVideoUrl} 
        from "../controllers/courseController.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";
import { updateAccessToken } from "../controllers/userController.js";

const courseRouter = express.Router();

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

courseRouter.delete("/delete-course/:id", updateAccessToken, isAuthenticated, authorizeRoles("teacher"), deleteCourse);
 

export default courseRouter;

