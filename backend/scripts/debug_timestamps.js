import mongoose from "mongoose";
import dotenv from "dotenv";
import CourseModel from "../models/courseModel.js";

dotenv.config();

const debugTimestamps = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const courses = await CourseModel.find();
        
        for (let course of courses) {
            console.log(`Course: ${course.name}`);
            if (course.reviews) {
                course.reviews.forEach((r, i) => {
                    console.log(`  Review ${i}: ${r.comment.substring(0, 20)}...`);
                    console.log(`    _id: ${r._id}`);
                    console.log(`    createdAt: ${r.createdAt}`);
                    if (r._id) console.log(`    _id timestamp: ${r._id.getTimestamp()}`);
                    
                    if (r.commentReplies) {
                        r.commentReplies.forEach((rp, j) => {
                            console.log(`    Reply ${j}: ${rp.comment.substring(0, 20)}...`);
                            console.log(`      createdAt: ${rp.createdAt}`);
                        });
                    }
                });
            }
        }
        
        process.exit(0);
    } catch (error) {
        console.error("Debug failed:", error);
        process.exit(1);
    }
};

debugTimestamps();
