import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import cloudinary from "cloudinary";
import { ErrorHandler } from "../middlewares/errorHandler.js";
import CourseModel from "../models/courseModel.js";
import userModel from "../models/userModel.js";
import NotificationModel from "../models/notificationModel.js";
import { redis } from "../config/redis.js";
import mongoose from "mongoose";
import { io } from "../serverSocket.js";
import sendEmail from "../utils/sendMail.js";

// Upload Video (Kept for API consistency but not used in frontend)
export const uploadVideo = catchAsyncErrors(async (req, res, next) => {
    try {
        if (!req.file) return next(new ErrorHandler(400, "No video file provided"));
        
        // Use upload_large for better support of large video files
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.v2.uploader.upload_stream(
                {
                    resource_type: "video",
                    folder: "courses",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        res.status(200).json({ success: true, url: result.secure_url, public_id: result.public_id });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// Upload Pdf
export const uploadPdf = catchAsyncErrors(async (req, res, next) => {
    try {
        if (!req.file) return next(new ErrorHandler(400, "No pdf file provided"));

        // Use upload_stream/upload_large logic for large PDF files
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.v2.uploader.upload_stream(
                {
                    resource_type: "auto", // auto handles raw files like PDF
                    folder: "courses",
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
            url: result.secure_url, 
            public_id: result.public_id,
            originalName: req.file.originalname 
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// Upload Course
export const uploadCourse = catchAsyncErrors(async (req, res, next) => {
    try {
        const data = req.body || {};
        const thumbnail = data.thumbnail;
        if (thumbnail && typeof thumbnail === "string" && thumbnail.startsWith("data:")) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        data.teacher = req.user._id;

        const course = await CourseModel.create(data);
        res.status(201).json({
            success: true,
            course,
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// Edit Course
export const editCourse = catchAsyncErrors(async (req, res, next) => {
    try {
        const data = req.body || {};
        const thumbnail = data.thumbnail;
        const courseId = req.params.id;

        const originalCourse = await CourseModel.findById(courseId);

        if (originalCourse.teacher && originalCourse.teacher.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler(403, "You are not authorized to edit this course"));
        }

        if (thumbnail && typeof thumbnail === "string" && thumbnail.startsWith("data:")) {
            if (originalCourse.thumbnail?.public_id) {
                await cloudinary.v2.uploader.destroy(originalCourse.thumbnail.public_id);
            }
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        const course = await CourseModel.findByIdAndUpdate(courseId, { $set: data }, { new: true });
        res.status(200).json({
            success: true,
            course,
        });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// Get Single Course (without purchasing)
export const getSingleCourse = catchAsyncErrors(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const cache = await redis.get(courseId);
        if (cache) {
            const course = JSON.parse(cache);
            return res.status(200).json({ success: true, course });
        } else {
            const course = await CourseModel.findById(courseId).select(
                "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
            );
            if (!course) return next(new ErrorHandler(404, "Course not found"));
            await redis.set(courseId, JSON.stringify(course), "EX", 604800);
            res.status(200).json({ success: true, course });
        }
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// Get All Course (without purchasing)
export const getAllCourse = catchAsyncErrors(async (req, res, next) => {
    try {
        const { search, category, level, minPrice, maxPrice, sort } = req.query;
        let query = {};
        if (search) query.name = { $regex: search, $options: "i" };
        if (category && category !== "All") query.categories = category;
        if (level && level !== "All") query.level = level;
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let sortQuery = { createdAt: -1 };
        if (sort === "price_asc") sortQuery = { price: 1 };
        if (sort === "price_desc") sortQuery = { price: -1 };
        if (sort === "popular") sortQuery = { purchased: -1 };
        if (sort === "newest") sortQuery = { createdAt: -1 };

        const courses = await CourseModel.find(query).sort(sortQuery).select(
            "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
        res.status(200).json({ success: true, courses });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// Get Course content By User
export const getCourseByUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const userCourseList = req.user.courses || [];
        const courseId = req.params.id;
        const courseExists = userCourseList?.find((course) => course.courseId === courseId);

        if (!courseExists && req.user.role !== "admin" && req.user.role !== "teacher") {
            return next(new ErrorHandler(403, "You have not purchased this course"));
        }

        const course = await CourseModel.findById(courseId);
        res.status(200).json({ success: true, content: course?.courseData || [] });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// Add Questions
export const addQuestion = catchAsyncErrors(async (req, res, next) => {
    try {
        const { question, courseId, contentId } = req.body || {};
        const course = await CourseModel.findById(courseId);
        if (!course) return next(new ErrorHandler(404, "Course not found"));

        const courseContent = course.courseData.find((item) => item._id.equals(contentId));
        if (!courseContent) return next(new ErrorHandler(404, "Invalid content id"));

        const newQuestion = {
            user: req.user,
            question,
            questionReplies: [],
        };
        courseContent.questions.push(newQuestion);

        await NotificationModel.create({
            user: req.user._id,
            title: "New Question",
            message: `You have a new question in ${courseContent.title}`,
        });

        await course.save();
        io.emit("notification", { action: "New Question Request" });
        res.status(200).json({ success: true, course });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// Add Answer
export const addAnswer = catchAsyncErrors(async (req, res, next) => {
    try {
        const { answer, courseId, contentId, questionId } = req.body || {};
        const course = await CourseModel.findById(courseId);
        if (!course) return next(new ErrorHandler(404, "Course not found"));

        const courseContent = course.courseData.find((item) => item._id.equals(contentId));
        if (!courseContent) return next(new ErrorHandler(404, "Invalid content id"));

        const question = courseContent.questions.find((item) => item._id.equals(questionId));
        if (!question) return next(new ErrorHandler(404, "Invalid question id"));

        const newAnswer = { user: req.user, answer };
        question.questionReplies.push(newAnswer);

        await course.save();

        if (req.user._id === question.user._id) {
            await NotificationModel.create({
                user: req.user._id,
                title: "New Question Reply",
                message: `You have a new question reply in ${courseContent.title}`,
            });
            io.emit("notification", { action: "New Answer Received" });
        } else {
            await sendEmail({
                email: question.user.email,
                subject: "Question Reply",
                template: "question-reply.ejs",
                data: {
                    name: question.user.name,
                    title: courseContent.title,
                },
            });
        }
        res.status(200).json({ success: true, course });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// Add Review 
export const addReview = catchAsyncErrors(async (req, res, next) => {
    try {
        const userCourseList = req.user.courses;
        const courseId = req.params.id;
        const isAdmin = req.user.role === "admin";
        const courseExists = userCourseList.find((course) => course.courseId === courseId);
        if (!courseExists && !isAdmin) return next(new ErrorHandler(400, "You are not eligible to access this course"));

        const course = await CourseModel.findById(courseId);
        const { review, rating } = req.body;
        const newReview = {
            user: req.user,
            rating,
            comment: review,
        };
        course.reviews.push(newReview);

        let avg = 0;
        course.reviews.forEach((r) => { avg += r.rating; });
        course.ratings = avg / course.reviews.length;

        await course.save();
        await redis.set(courseId, JSON.stringify(course), "EX", 604800);

        await NotificationModel.create({
            user: req.user._id,
            title: "New Review",
            message: `${req.user.name} has given a review in ${course.name}`,
        });
        io.emit("notification", { action: "New Review Received" });

        res.status(200).json({ success: true, course });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

// Add Reply To Review
export const addReplyToReview = catchAsyncErrors(async (req, res, next) => {
    try {
        const { comment, courseId, reviewId } = req.body;
        const course = await CourseModel.findById(courseId);
        if (!course) return next(new ErrorHandler(404, "Course not found"));

        const review = course.reviews.find((rev) => rev._id.equals(reviewId));
        if (!review) return next(new ErrorHandler(404, "Review not found"));

        const replyData = { user: req.user, comment };
        if (!review.commentReplies) review.commentReplies = [];
        review.commentReplies.push(replyData);

        await course.save();
        await redis.set(courseId, JSON.stringify(course), "EX", 604800);

        res.status(200).json({ success: true, course });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

export const getTeacherAllCourses = catchAsyncErrors(async (req, res, next) => {
    try {
        let query = {};
        if (req.user.role === "teacher") query.teacher = req.user._id;

        const courses = await CourseModel.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, courses });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

export const getQuestionsByUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const courses = await CourseModel.find({ 'courseData.questions.user._id': req.user._id });
        let questions = [];
        courses.forEach(course => {
            course.courseData.forEach(content => {
                content.questions.forEach(q => {
                    if (q.user._id.toString() === req.user._id.toString()) {
                        questions.push({ ...q.toObject(), courseName: course.name });
                    }
                });
            });
        });
        res.status(200).json({ success: true, questions });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

export const getReviewsByUser = catchAsyncErrors(async (req, res, next) => {
    try {
        const courses = await CourseModel.find({ 'reviews.user._id': req.user._id });
        let reviews = [];
        courses.forEach(course => {
            course.reviews.forEach(r => {
                if (r.user._id.toString() === req.user._id.toString()) {
                    reviews.push({ ...r.toObject(), courseName: course.name });
                }
            });
        });
        res.status(200).json({ success: true, reviews });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

export const editReview = catchAsyncErrors(async (req, res, next) => {
    try {
        const { rating, review, courseId, reviewId } = req.body;
        const course = await CourseModel.findById(courseId);
        if (!course) return next(new ErrorHandler(404, "Course not found"));

        const courseReview = course.reviews.find((rev) => rev._id.equals(reviewId));
        if (!courseReview) return next(new ErrorHandler(404, "Review not found"));

        if (courseReview.user._id.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler(403, "Not authorized to edit this review"));
        }

        courseReview.rating = rating;
        courseReview.comment = review;

        let avg = 0;
        course.reviews.forEach((r) => { avg += r.rating; });
        course.ratings = avg / course.reviews.length;

        await course.save();
        res.status(200).json({ success: true, course });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

export const editQuestion = catchAsyncErrors(async (req, res, next) => {
    try {
        const { question, courseId, contentId, questionId } = req.body;
        const course = await CourseModel.findById(courseId);
        const courseContent = course.courseData.find((item) => item._id.equals(contentId));
        const questionItem = courseContent.questions.find((item) => item._id.equals(questionId));

        if (questionItem.user._id.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler(403, "Not authorized"));
        }

        questionItem.question = question;
        await course.save();
        res.status(200).json({ success: true, course });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

export const deleteCourse = catchAsyncErrors(async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await CourseModel.findById(id);
        if (!course) return next(new ErrorHandler(404, "Course not found"));

        if (course.teacher && course.teacher.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return next(new ErrorHandler(403, "Not authorized"));
        }

        await course.deleteOne({ _id: id });
        await redis.del(id);
        res.status(200).json({ success: true, message: "Course deleted successfully" });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

export const updateCourseProgress = catchAsyncErrors(async (req, res, next) => {
    try {
        const { courseId, contentId } = req.body;
        const user = await userModel.findById(req.user._id);
        if (!user) return next(new ErrorHandler(404, "User not found"));

        const courseIndex = user.courses.findIndex((course) => course.courseId === courseId);
        if (courseIndex === -1) return next(new ErrorHandler(404, "Course not found"));

        const courseProgress = user.courses[courseIndex];
        if (!courseProgress.completedLessons) courseProgress.completedLessons = [];

        if (!courseProgress.completedLessons.includes(contentId)) {
            courseProgress.completedLessons.push(contentId);
        }

        await user.save();
        await redis.set(req.user._id, JSON.stringify(user));
        res.status(200).json({ success: true, courseProgress });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

export const logCourseView = catchAsyncErrors(async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const user = await userModel.findById(req.user._id);

        if (!user.viewedCourses.includes(courseId)) {
            user.viewedCourses.push(courseId);
            if (user.viewedCourses.length > 20) user.viewedCourses.shift();
            await user.save();
            await redis.set(req.user._id, JSON.stringify(user));
        }
        res.status(200).json({ success: true });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

export const logSearchQuery = catchAsyncErrors(async (req, res, next) => {
    try {
        const { keyword } = req.body;
        const user = await userModel.findById(req.user._id);

        if (keyword && !user.searchHistory.includes(keyword)) {
            user.searchHistory.push(keyword);
            if (user.searchHistory.length > 20) user.searchHistory.shift();
            await user.save();
            await redis.set(req.user._id, JSON.stringify(user));
        }
        res.status(200).json({ success: true });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

export const getSuggestedCourses = catchAsyncErrors(async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        const purchasedCourseIds = user.courses.map((c) => c.courseId);

        let userCategories = [];
        let userTags = [];

        if (purchasedCourseIds.length > 0) {
            const purchasedCourses = await CourseModel.find({ _id: { $in: purchasedCourseIds } });
            purchasedCourses.forEach(c => {
                if (c.categories) userCategories.push(c.categories);
                if (c.tags) userTags.push(c.tags);
            });
        }

        if (user.viewedCourses && user.viewedCourses.length > 0) {
            const viewedCourses = await CourseModel.find({ _id: { $in: user.viewedCourses } });
            viewedCourses.forEach(c => {
                if (c.categories) userCategories.push(c.categories);
                if (c.tags) userTags.push(c.tags);
            });
        }

        const searchKeywords = user.searchHistory || [];

        const allCourses = await CourseModel.find().select(
            "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );

        const scoredCourses = allCourses.map(course => {
            let score = 0;

            if (purchasedCourseIds.includes(course._id.toString())) {
                return { ...course.toObject(), score: -1 };
            }

            if (userCategories.includes(course.categories)) score += 3;
            if (userTags.includes(course.tags)) score += 2;

            searchKeywords.forEach(keyword => {
                const lowerK = keyword.toLowerCase();
                if (course.name.toLowerCase().includes(lowerK)) score += 2;
                if (course.tags && course.tags.toLowerCase().includes(lowerK)) score += 1;
                if (course.categories && course.categories.toLowerCase().includes(lowerK)) score += 1;
            });

            const daysSinceCreated = (new Date() - new Date(course.createdAt)) / (1000 * 60 * 60 * 24);
            if (daysSinceCreated < 14) score += 2;

            return { ...course.toObject(), score };
        });

        const suggestedCourses = scoredCourses
            .filter(c => c.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        if (suggestedCourses.length === 0) {
            const defaultMux = allCourses
                .filter(c => !purchasedCourseIds.includes(c._id.toString()))
                .sort((a, b) => b.purchased - a.purchased)
                .slice(0, 10);
            return res.status(200).json({ success: true, courses: defaultMux });
        }

        res.status(200).json({ success: true, courses: suggestedCourses });
    } catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});
