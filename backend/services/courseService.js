import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import CourseModel from "../models/courseModel.js";

//Create course
export const createCourse = catchAsyncErrors (async(data, res) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
        success: true,
        course,
    });
});

//get all courses
export const getAllCoursesService = async (res) => {
    const courses = await CourseModel.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        courses,
    });
};