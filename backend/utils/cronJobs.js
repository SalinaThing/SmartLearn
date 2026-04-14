import cron from 'node-cron';
import CourseModel from '../models/courseModel.js';
import FeedbackModel from '../models/feedbackModel.js';
import QuizModel from '../models/quizModel.js';
import ResultModel from '../models/resultModel.js';
import NotificationModel from '../models/notificationModel.js';

export const initCronJobs = () => {
    // Run every day at midnight (0 0 * * *)
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log('Running automated cleanup task for records older than 6 months...');

            // Calculate exact date 6 months ago from now
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            // 1. Delete old feedback entries
            const feedbackDel = await FeedbackModel.deleteMany({
                createdAt: { $lt: sixMonthsAgo }
            });
            console.log(`Deleted ${feedbackDel.deletedCount} old feedback entries.`);

            // 2. Delete old quizzes
            const quizDel = await QuizModel.deleteMany({
                createdAt: { $lt: sixMonthsAgo }
            });
            console.log(`Deleted ${quizDel.deletedCount} old quizzes.`);

            // 3. Delete old quiz results tracking
            const resultDel = await ResultModel.deleteMany({
                createdAt: { $lt: sixMonthsAgo }
            });
            console.log(`Deleted ${resultDel.deletedCount} old quiz attempts.`);

            // 4. Delete old courses
            const courseDel = await CourseModel.deleteMany({
                createdAt: { $lt: sixMonthsAgo }
            });
            console.log(`Deleted ${courseDel.deletedCount} old courses.`);

            // 5. Delete read notifications older than 30 days
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const notificationDel = await NotificationModel.deleteMany({
                status: 'read',
                createdAt: { $lt: thirtyDaysAgo }
            });
            console.log(`Deleted ${notificationDel.deletedCount} old read notifications.`);

            console.log('Cleanup task completed successfully.');
        } catch (error) {
            console.error('Error during automated cleanup task:', error);
        }
    });

    console.log('Cron jobs initialized: Daily cleanup for 6-months old data is actively scheduled.');
};
