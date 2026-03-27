import React, { FC } from "react";
import { Link } from "react-router-dom";
import StudentEnrolledCourses from "../Dashboard/StudentEnrolledCourses";
import StudentQuizResults from "../Dashboard/StudentQuizResults";
import StudentFeedbackList from "../Dashboard/StudentFeedbackList";
import StudentNotifications from "../Dashboard/StudentNotifications";
import { useUser } from "@/hooks/useUser";
import { Box, CircularProgress } from '@mui/material';
import {
    PiBookOpenTextFill,
    PiCertificateFill,
    PiChatTeardropDotsFill,
    PiExamFill
} from "react-icons/pi";

type Props = {
    value?: number;
};

const CircularProgressWithLabel: FC<{ value: number }> = ({ value }) => {
    return (
        <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
                variant="determinate"
                value={value}
                size={55}
                color={value > 80 ? "info" : "error"}
                thickness={4}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div className="text-[10px] font-bold dark:text-white text-black">
                    {Math.round(value)}%
                </div>
            </Box>
        </Box>
    );
}
import StudentAnnouncementsPreview from "../Dashboard/StudentAnnouncementsPreview";


const StudentDashboardWidgets: FC<Props> = () => {
    const { user } = useUser();

    // Calculate some dummy/real progress
    const courseProgress = user?.courses?.length > 0 ? 100 : 0;
    const quizProgress = 0; // Placeholder

    return (
        <div className="space-y-10">
            {/* Welcome Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                    Enrolled Student Dashboard: {user?.name} 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Manage your enrolled courses, keep track of quizzes, and share your feedback.
                </p>
            </div>

            {/* Premium Stats Grid (Teacher Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Enrolled Courses Card */}
                <Link to="/student/dashboard" className="bg-white dark:bg-[#111C43] rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-b-4 border-blue-500 block">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                                <PiBookOpenTextFill className="text-blue-600 dark:text-blue-400 text-3xl" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                                {user?.courses?.length || 0}
                            </h3>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                                Enrolled in Course
                            </p>
                        </div>
                        <CircularProgressWithLabel value={courseProgress} />
                    </div>
                </Link>

                {/* Quizzes Completed Card */}
                <Link to="/student/quizzes" className="bg-white dark:bg-[#111C43] rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-b-4 border-[#3ccbae] block">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
                                <PiExamFill className="text-[#3ccbae] text-3xl" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                                Attend
                            </h3>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                                Available Quizzes
                            </p>
                        </div>
                        <CircularProgressWithLabel value={quizProgress} />
                    </div>
                </Link>

                {/* Feedback Given Card */}
                <Link to="/student/feedback" className="bg-white dark:bg-[#111C43] rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-b-4 border-amber-500 block">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                                <PiChatTeardropDotsFill className="text-amber-600 text-3xl" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                                Edit
                            </h3>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                                My Feedback
                            </p>
                        </div>
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg text-amber-600 text-xs font-bold animate-pulse">
                            Active
                        </div>
                    </div>
                </Link>

                {/* Certificates Card */}
                <div className="bg-white dark:bg-[#111C43] rounded-xl shadow-lg p-6 hover:shadow-xl transition-all border-b-4 border-purple-500">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-4">
                                <PiCertificateFill className="text-purple-600 text-3xl" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                                0
                            </h3>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                                Certificates
                            </p>
                        </div>
                        <CircularProgressWithLabel value={0} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content: Enrolled Courses & Quizzes */}
                <div className="lg:col-span-8 space-y-10">
                    <StudentEnrolledCourses />
                    <StudentAnnouncementsPreview />
                    <StudentQuizResults />
                </div>

                {/* Right Sidebar: Notifications & Feedback */}
                <div className="lg:col-span-4 space-y-10">
                    <StudentNotifications />
                    <StudentFeedbackList />
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardWidgets;
