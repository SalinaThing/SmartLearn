import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import cloudinary from "cloudinary";
import { ErrorHandler } from "../middlewares/errorHandler.js";
import CourseModel from "../models/courseModel.js";
import { createCourse } from "../services/courseService.js";
import { redis } from "../config/redis.js";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import sendEmail from "../utils/sendMail.js";
import { fileURLToPath } from "url";
import NotificationModel from "../models/notificationModel.js";
import { getAllCoursesService } from "../services/courseService.js";
import axios from "axios";
import { io } from "../serverSocket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Upload Course
export const uploadCourse = catchAsyncErrors(async (req, res, next) => {
    try {
        const data = req.body || {};
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            if (typeof thumbnail !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Thumbnail must be a base64 string or file path."
                });
            }
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }
        createCourse(data, res, next);

        // Notify students about new course
        try {
            await NotificationModel.create({
                title: "New Course Available",
                message: `A new course "${data.name}" has been published!`,
                role: 'student'
            });
            // Emit socket event
            io.to("student").emit("newNotification", {
                title: "New Course Available",
                message: `A new course "${data.name}" has been published!`,
            });
        } catch (error) {
            console.log("New course notification error:", error);
        }
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//Edit Course
export const editCourse = catchAsyncErrors(async (req, res, next) => {
    try {
        const data = req.body || {};
        const thumbnail = data.thumbnail;

        // Get courseId and find existing course
        const courseId = req.params.id;
        const courseData = await CourseModel.findById(courseId);

        if (!courseId) {
            return next(new ErrorHandler(400, "Missing course id parameter"));
        };

        // Logic for thumbnail remains the same as your current working version
        if (thumbnail && !thumbnail.startsWith("https")) {
            await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);

            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses"
            });

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }

        if (thumbnail.startsWith("https")) {
            data.thumbnail = {
                public_id: courseData?.thumbnail.public_id,
                url: courseData?.thumbnail.url,
            }
        }

        //Update course
        const updatedCourse = await CourseModel.findByIdAndUpdate(
            courseId,
            { $set: data },
            { new: true }
        );

        // Invalidate Redis cache so students get fresh data
        await redis.del(courseId);

        res.status(200).json({
            success: true,
            course: updatedCourse,
        });

        // Notify students about course update
        try {
            await NotificationModel.create({
                title: "Course Updated",
                message: `Course "${updatedCourse.name}" has been updated with new content.`,
                role: 'student'
            });
            // Emit socket event
            io.to("student").emit("newNotification", {
                title: "Course Updated",
                message: `Course "${updatedCourse.name}" has been updated with new content.`,
            });
        } catch (error) {
            console.log("Course update notification error:", error);
        }
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//Get single course ---without purchasing
export const getSingleCourse = catchAsyncErrors(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        if (!courseId) {
            return next(new ErrorHandler(400, "Missing course id parameter"));
        }

        const isCacheExists = await redis.get(courseId);
        if (isCacheExists) {
            const course = JSON.parse(isCacheExists);
            return res.status(200).json({
                success: true,
                course,
            });
        } else {
            const course = await CourseModel.findById(req.params.id).select(
                "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
            );

            await redis.set(courseId, JSON.stringify(course), "EX", 604800); // Cache for 7 days    
            if (!course) {
                return next(new ErrorHandler(400, "Course not found"));
            }
            res.status(200).json({
                success: true,
                course,
            });
        }

    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//Get all courses without purchasing
export const getAllCourse = catchAsyncErrors(async (req, res, next) => {
    try {
        const { search, category, level, minPrice, maxPrice, sort } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }
        if (category && category !== "All") {
            query.categories = category;
        }
        if (level && level !== "All") {
            query.level = level;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
             query.price = {};
             if (minPrice) query.price.$gte = Number(minPrice);
             if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Sorting logic
        let sortQuery = { createdAt: -1 }; // default newest
        if (sort === "price_asc") sortQuery = { price: 1 };
        if (sort === "price_desc") sortQuery = { price: -1 };
        if (sort === "popular") sortQuery = { purchased: -1 };
        if (sort === "newest") sortQuery = { createdAt: -1 };

        const courses = await CourseModel.find(query).sort(sortQuery).select(
            "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );

        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
}
);

//Get all courses with purchasing
export const getCourseByUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const userCourseList = req.user.courses || [];
        const courseId = req.params.id;

        const courseExists = userCourseList?.find(
            (course) => course.courseId === courseId
        );

        if (!courseExists && req.user.role !== "admin" && req.user.role !== "teacher") {
            return next(new ErrorHandler(400, "You are not eligible. You have not purchased this course"));
        }

        const course = await CourseModel.findById(courseId);
        const courseContent = course?.courseData || {};
        res.status(200).json({
            success: true,
            content: courseContent,
        });

    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//Add Questions in course
export const addQuestion = catchAsyncErrors(async (req, res, next) => {
    try {
        const { question, courseId, contentId } = req.body || {};

        const course = await CourseModel.findById(courseId);
        if (!course) {
            console.log("Course not found for id:", courseId);
            return next(new ErrorHandler(400, "Course not found"));
        }

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            console.log("Invalid contentId:", contentId);
            return next(new ErrorHandler(400, "Invalid content id"));
        }

        const courseContent = course.courseData?.find((item) => item._id.toString() === contentId.toString());
        if (!courseContent) {
            const availableContent = course.courseData?.map(item => ({
                id: item._id.toString(),
                title: item.title
            })) || [];
            return next(new ErrorHandler(400, `Content not found in course. Available content IDs: ${JSON.stringify(availableContent)}`));
        }

        //create a new question object
        const newQuestion = {
            user: req.user,
            question,
            questionReplies: [],
        };

        //add this question to our course content
        courseContent.questions.push(newQuestion);

        await NotificationModel.create({
            title: "New Question Added",
            message: `You have a new question in course ${courseContent.title}`,
            role: 'teacher'
        });

        // Emit socket event for real-time notification
        io.to("teacher").emit("newNotification", {
            title: "New Question Added",
            message: `You have a new question in course ${courseContent.title}`,
        });

        //save the updated course
        await course?.save();

        res.status(200).json({
            success: true,
            course,
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//Add answer to question in course
export const addAnswer = catchAsyncErrors(async (req, res, next) => {
    try {
        const { answer, courseId, contentId, questionId } = req.body || {};
        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler(404, "Course not found"));
        }

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler(400, "Invalid content id"));
        }

        const courseContent = course?.courseData?.find((item) =>
            item._id.toString() === contentId.toString());
        if (!courseContent) {
            return next(new ErrorHandler(400, "Content not found in course"));
        }

        const question = courseContent?.questions?.find((item) =>
            item._id.toString() === questionId.toString());
        if (!question) {
            return next(new ErrorHandler(400, "Question not found in course content"));
        }

        const newAnswer = {
            user: req.user,
            answer,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        //add this answer to our question
        question.questionReplies.push(newAnswer);

        //save the updated course
        await course?.save();

        if (req.user?._id.toString() === question.user._id.toString()) {
            //create a notification for the question asker
            await NotificationModel.create({
                user: question.user._id,
                title: "New Question Reply received",
                message: `You have a new question reply in ${courseContent.title}`,
            });

            // Emit socket event
            io.to(question.user._id.toString()).emit("newNotification", {
                user: question.user._id,
                title: "New Question Reply received",
                message: `You have a new question reply in ${courseContent.title}`,
            });

        } else {
            const data = {
                name: question.user.name,
                title: courseContent.title,
                question: question.question,
                reply: answer,
            };

            const html = await ejs.renderFile(path.join(__dirname, "../mails/questionReply.ejs"), data);

            try {
                await sendEmail({
                    email: question.user.email,
                    subject: "Question Reply",
                    template: "questionReply.ejs",
                    data,
                })
            } catch (err) {
                console.log("Error sending email notification:", err);
                return next(new ErrorHandler(500, err.message));
            }
        }

        res.status(200).json({
            success: true,
            course,
        });

    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//Add review for course
export const addReview = catchAsyncErrors(async (req, res, next) => {
    try {
        const userCourseList = req.user?.courses || [];
        const courseId = req.params.id;

        //check if courseId already exists in userCourselist
        const courseExists = userCourseList?.some((course) =>
            course.courseId === courseId || (course._id && course._id.toString() === courseId.toString()));
        if (!courseExists) {
            return next(new ErrorHandler(400, "You are not eligible. You have not purchased this course"));
        }

        const course = await CourseModel.findById(courseId);
        const { rating, review } = req.body || {};

        const reviewData = {
            user: req.user,
            rating,
            comment: review,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        course?.reviews.push(reviewData);

        let avg = 0;
        course?.reviews.forEach((rev) => {
            avg += rev.rating;
        });
        if (course) {
            course.ratings = avg / course.reviews.length; // Example:We have 2 reviews one is 5 another, one is 4 so math working like 9/2 = 4.5 ratings
        }
        await course?.save();

        await redis.set(courseId, JSON.stringify(course), "EX", 604800); //7days

        //create notification for course instructor
        await NotificationModel.create({
            title: "New Review Received",
            message: `${req.user.name} has given a review in "${course?.name}" course`,
            role: 'teacher'
        });

        // Emit socket event
        io.to("teacher").emit("newNotification", {
            title: "New Review Received",
            message: `${req.user.name} has given a review in "${course?.name}" course`,
        });

        res.status(200).json({
            success: true,
            course,
        });

    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//Add replyReview
export const addReplyToReview = catchAsyncErrors(async (req, res, next) => {
    try {
        const { comment, courseId, reviewId } = req.body || {};

        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler(404, "Course not found"));
        }

        const review = course?.reviews?.find(
            (rev) => rev._id.toString() === reviewId.toString());
        if (!review) {
            return next(new ErrorHandler(404, "Review not found"));
        }

        const replyData = {
            user: req.user,
            comment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        if (!review.commentReplies) {
            review.commentReplies = [];
        }

        review.commentReplies?.push(replyData);

        await course?.save();
        await redis.set(courseId, JSON.stringify(course), "EX", 604800); //7days

        // Create notification for the reviewer
        await NotificationModel.create({
            user: review.user._id,
            title: "New Review Reply",
            message: `The instructor replied to your review in "${course?.name}"`,
        });

        // Emit socket event
        io.to(review.user._id.toString()).emit("newNotification", {
            user: review.user._id,
            title: "New Review Reply",
            message: `The instructor replied to your review in "${course?.name}"`,
        });

        res.status(200).json({
            success: true,
            course,
        });

    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//get all courses (teacher only)
export const getTeacherAllCourses = catchAsyncErrors(async (req, res, next) => {
    try {
        getAllCoursesService(res);

    } catch (err) {
        return next(new ErrorHandler(400, err.message));
    }
});

//Delete course --Teacher only
export const deleteCourse = catchAsyncErrors(async (req, res, next) => {
    try {
        const { id } = req.params || {};
        const course = await CourseModel.findById(id);

        if (!course) {
            return next(new ErrorHandler(404, "Course not found"));
        }

        await course.deleteOne({ id });

        await redis.del(id.toString());

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (err) {
        return next(new ErrorHandler(400, err.message));
    }
});

//Generate videoUrl
export const generateVideoUrl = catchAsyncErrors(async (req, res, next) => {
    try {
        const { videoId } = req.body || {};
        const response = await axios.post(
            `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
            { ttl: 300 },
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Apisecret ${process.env.VDOCIPHER_API_KEY}`,
                }
            }
        )
        res.json(response.data);

    } catch (err) {
        return next(new ErrorHandler(400, err.message));
    }
});

//Upload video to Cloudinary
export const uploadVideo = catchAsyncErrors(async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ErrorHandler(400, "No video file provided"));
        }

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.v2.uploader.upload_stream(
                {
                    resource_type: "video",
                    folder: "course-videos",
                    chunk_size: 6000000,
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        res.status(200).json({
            success: true,
            public_id: result.public_id,
            url: result.secure_url,
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//Upload PDF to Cloudinary
export const uploadPdf = catchAsyncErrors(async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ErrorHandler(400, "No PDF file provided"));
        }

        if (req.file.mimetype !== "application/pdf") {
            return next(new ErrorHandler(400, "Only PDF files are allowed"));
        }

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.v2.uploader.upload_stream(
                {
                    resource_type: "raw",
                    folder: "course-pdfs",
                    format: "pdf",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        res.status(200).json({
            success: true,
            public_id: result.public_id,
            url: result.secure_url,
            originalName: req.file.originalname,
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//get all questions by user
export const getQuestionsByUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const courses = await CourseModel.find({ "courseData.questions.user._id": userId.toString() });

        const userQuestions = [];

        courses.forEach((course) => {
            course.courseData.forEach((content) => {
                content.questions.forEach((question) => {
                    if (question.user._id.toString() === userId.toString()) {
                        userQuestions.push({
                            ...question.toObject(),
                            courseName: course.name,
                            courseId: course._id,
                            contentTitle: content.title
                        });
                    }
                });
            });
        });

        res.status(200).json({
            success: true,
            questions: userQuestions,
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//get all reviews by user
export const getReviewsByUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const courses = await CourseModel.find({ "reviews.user._id": userId.toString() });

        const userReviews = [];

        courses.forEach((course) => {
            course.reviews.forEach((review) => {
                if (review.user._id.toString() === userId.toString()) {
                    userReviews.push({
                        ...review.toObject(),
                        courseName: course.name,
                        courseId: course._id
                    });
                }
            });
        });

        res.status(200).json({
            success: true,
            reviews: userReviews,
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//edit review
export const editReview = catchAsyncErrors(async (req, res, next) => {
    try {
        const { rating, review, courseId, reviewId } = req.body || {};
        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler(404, "Course not found"));
        }

        const reviewItem = course.reviews.id(reviewId);
        if (!reviewItem) {
            return next(new ErrorHandler(404, "Review not found"));
        }

        if (reviewItem.user._id.toString() !== req.user?._id.toString()) {
            return next(new ErrorHandler(403, "You can only edit your own reviews"));
        }

        reviewItem.rating = rating;
        reviewItem.comment = review;
        reviewItem.updatedAt = new Date().toISOString();

        // Recalculate average rating
        let avg = 0;
        course.reviews.forEach((rev) => {
            avg += rev.rating;
        });
        course.ratings = avg / course.reviews.length;

        await course.save();
        await redis.set(courseId, JSON.stringify(course), "EX", 604800);

        res.status(200).json({
            success: true,
            course,
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//edit question
export const editQuestion = catchAsyncErrors(async (req, res, next) => {
    try {
        const { question, courseId, contentId, questionId } = req.body || {};
        const course = await CourseModel.findById(courseId);

        if (!course) {
            return next(new ErrorHandler(404, "Course not found"));
        }

        const courseContent = course.courseData.find((item) => item._id.toString() === contentId.toString());
        if (!courseContent) {
            return next(new ErrorHandler(404, "Content not found"));
        }

        const questionItem = courseContent.questions.find((q) => q._id.toString() === questionId.toString());
        if (!questionItem) {
            return next(new ErrorHandler(404, "Question not found"));
        }

        if (questionItem.user._id.toString() !== req.user?._id.toString()) {
            return next(new ErrorHandler(403, "You can only edit your own questions"));
        }

        questionItem.question = question;
        questionItem.updatedAt = new Date().toISOString();

        await course.save();
        await redis.set(courseId, JSON.stringify(course), "EX", 604800);

        res.status(200).json({
            success: true,
            course,
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});
