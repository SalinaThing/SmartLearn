import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const fixTimestampsFinal = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const db = mongoose.connection.db;
        const courses = await db.collection("courses").find().toArray();
        
        console.log(`Processing ${courses.length} courses...`);

        for (let course of courses) {
            let changed = false;

            // Fix reviews
            if (course.reviews) {
                for (let review of course.reviews) {
                    if (review._id) {
                        const idTimestamp = review._id.getTimestamp();
                        // If createdAt is missing or significantly later than _id timestamp (more than 1 hour off)
                        // we set it to the _id timestamp.
                        if (!review.createdAt || Math.abs(new Date(review.createdAt) - idTimestamp) > 3600000) {
                            review.createdAt = idTimestamp;
                            review.updatedAt = idTimestamp;
                            changed = true;
                        }
                    }
                    if (review.commentReplies) {
                        for (let reply of review.commentReplies) {
                            // Replies don't have _id often, so use parent review timestamp
                            if (!reply.createdAt) {
                                reply.createdAt = review.createdAt;
                                changed = true;
                            }
                        }
                    }
                }
            }

            // Fix Q&A
            if (course.courseData) {
                for (let content of course.courseData) {
                    if (content.questions) {
                        for (let question of content.questions) {
                            if (question._id) {
                                const idTimestamp = question._id.getTimestamp();
                                if (!question.createdAt || Math.abs(new Date(question.createdAt) - idTimestamp) > 3600000) {
                                    question.createdAt = idTimestamp;
                                    question.updatedAt = idTimestamp;
                                    changed = true;
                                }
                            }
                            if (question.questionReplies) {
                                for (let reply of question.questionReplies) {
                                    if (!reply.createdAt) {
                                        reply.createdAt = question.createdAt;
                                        changed = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (changed) {
                // Use native updateOne to bypass Mongoose timestamps middleware
                await db.collection("courses").updateOne(
                    { _id: course._id },
                    { $set: { 
                        reviews: course.reviews,
                        courseData: course.courseData
                    }}
                );
                console.log(`Updated course: ${course.name}`);
            }
        }

        console.log("Migration complete.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

fixTimestampsFinal();
