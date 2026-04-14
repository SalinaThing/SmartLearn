import mongoose from "mongoose";
import dotenv from "dotenv";
import NotificationModel from "./models/notificationModel.js";
import FeedbackModel from "./models/feedbackModel.js";
import Announcement from "./models/announcementModel.js";
import CourseModel from "./models/courseModel.js";
import userModel from "./models/userModel.js";

dotenv.config();

const populateHistory = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected");

        const admins = await userModel.find({ role: "admin" }).select("_id");
        if (admins.length === 0) {
            console.log("No admins found!");
            process.exit(0);
        }

        let total = 0;

        // 1. Feedback
        const feedbacks = await FeedbackModel.find().populate("user", "name");
        for (const f of feedbacks) {
            const exists = await NotificationModel.exists({
                title: "New Feedback Received",
                message: new RegExp(f.comment.substring(0, 20), "i"),
                role: "admin"
            });
            if (!exists) {
                await NotificationModel.create({
                    title: "New Feedback Received",
                    message: `A student (${f.user?.name || 'Unknown'}) has given feedback.`,
                    role: "admin",
                    createdAt: f.createdAt
                });
                total++;
            }
        }

        // 2. Announcements
        const announcements = await Announcement.find().populate("userId", "name");
        for (const a of announcements) {
            const exists = await NotificationModel.exists({
                title: "New Announcement Posted",
                message: new RegExp(a.title.substring(0, 20), "i"),
                role: "admin"
            });
            if (!exists) {
                await NotificationModel.create({
                    title: "New Announcement Posted",
                    message: `Teacher ${a.userId?.name || 'Someone'} has posted an announcement: "${a.title}"`,
                    role: "admin",
                    createdAt: a.createdAt
                });
                total++;
            }
        }

        // 3. Q&A and Reviews (Questions & Replies)
        const courses = await CourseModel.find();
        for (const c of courses) {
            // Reviews
            for (const r of c.reviews) {
                const exists = await NotificationModel.exists({
                    title: "New Review",
                    role: "admin",
                    createdAt: r.createdAt || c.createdAt
                });
                if (!exists) {
                    await NotificationModel.create({
                        title: "New Review",
                        message: `New review in ${c.name}`,
                        role: "admin",
                        createdAt: r.createdAt || c.createdAt
                    });
                    total++;
                }
            }

            // Questions & Replies
            for (const cd of c.courseData) {
                for (const q of cd.questions) {
                    // Question itself
                    const qExists = await NotificationModel.exists({ title: "New Question", role: "admin", createdAt: q.createdAt });
                    if (!qExists) {
                        await NotificationModel.create({ title: "New Question", message: `New question in ${cd.title}`, role: "admin", createdAt: q.createdAt });
                        total++;
                    }
                    // Replies
                    for (const ans of q.questionReplies) {
                        const aExists = await NotificationModel.exists({ title: "Question Answered", role: "admin", createdAt: ans.createdAt });
                        if (!aExists) {
                            await NotificationModel.create({ title: "Question Answered", message: `New reply in ${c.name}`, role: "admin", createdAt: ans.createdAt });
                            total++;
                        }
                    }
                }
            }
        }

        console.log(`Successfully generated ${total} retroactive admin notifications.`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

populateHistory();
