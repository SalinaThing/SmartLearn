import React from "react";
import { styles } from "@/styles/style";
import { 
  FiUsers, FiBookOpen, FiZap, FiMessageCircle, FiAward, 
  FiTrendingUp, FiCheckCircle, FiStar, FiHelpCircle, 
  FiBarChart2, FiBell, FiVideo, FiClipboard, FiMessageSquare,
  FiEye, FiThumbsUp, FiCalendar, FiLock, FiUnlock
} from "react-icons/fi";
import { 
  FaChalkboardTeacher, FaUserGraduate, FaRegLightbulb, 
  FaChartLine, FaComments, FaQuestionCircle 
} from "react-icons/fa";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";

type Props = {
    setOpen: (open: boolean) => void;
    setRoute: (route: string) => void;
};

const About = ({ setOpen, setRoute }: Props) => {
    const { isAuthenticated } = useUser();
    const navigate = useNavigate();

    const handleSignUpTrigger = (rolePath: string) => {
        if (!isAuthenticated) {
            setOpen(true);
            setRoute("SignUp");
        } else {
            navigate(rolePath);
        }
    };

    const features = [
        {
            icon: <FaChalkboardTeacher className="text-3xl" />,
            title: "For Teachers",
            description: "Upload courses personally, create premium content, and manage your teaching journey",
            items: ["Upload personal courses", "Create premium courses", "Manage course content", "Track student progress"]
        },
        {
            icon: <FaUserGraduate className="text-3xl" />,
            title: "For Students",
            description: "Access courses, take quizzes, and track your learning progress",
            items: ["Access all courses", "Take interactive quizzes", "Track completion percentage", "Get instant results"]
        },
        {
            icon: <FiClipboard className="text-3xl" />,
            title: "Quiz Management",
            description: "Create and manage quizzes with automatic grading",
            items: ["Create custom quizzes", "Automatic grading", "View student results", "Detailed analytics"]
        },
        {
            icon: <FiMessageCircle className="text-3xl" />,
            title: "Communication",
            description: "Stay connected with real-time communication tools",
            items: ["Q&A discussions", "Review replies", "Feedback system", "Announcements"]
        },
        {
            icon: <FiStar className="text-3xl" />,
            title: "Reviews & Ratings",
            description: "Build trust with authentic reviews and ratings",
            items: ["Course ratings", "Student reviews", "Teacher responses", "Quality feedback"]
        },
        {
            icon: <FiBell className="text-3xl" />,
            title: "Notifications",
            description: "Stay updated with real-time notifications",
            items: ["Course updates", "Quiz results", "Teacher announcements", "Feedback responses"]
        }
    ];

    const teacherFeatures = [
        "Upload personal courses",
        "Create premium courses",
        "Create and manage quizzes",
        "View quiz results of students",
        "See student feedback",
        "Reply to Q&A and reviews",
        "Create announcements for students"
    ];

    const studentFeatures = [
        "Access all courses",
        "Take quiz exams and get results",
        "Rate and review courses",
        "Ask questions in Q&A",
        "Give feedback to teachers",
        "Track course completion percentage",
        "View teacher announcements"
    ];

    const stats = [
        { value: "40k+", label: "Online Courses", icon: <FiBookOpen /> },
        { value: "500k+", label: "Registered Students", icon: <FiUsers /> },
        { value: "50+", label: "Expert Teachers", icon: <FaChalkboardTeacher /> },
        { value: "98%", label: "Satisfaction Rate", icon: <FiAward /> }
    ];

    return (
        <div className="text-black dark:text-white bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <br />
            <br />
            <div className="w-[95%] 800px:w-[85%] m-auto">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className={`${styles.title} 800px:!text-[55px]`}>
                        What is <span className="text-gradient">SmartLearn?</span>
                    </h1>
                    <p className="text-[18px] font-Poppins max-w-3xl mx-auto mt-4 text-gray-600 dark:text-gray-300">
                        SmartLearn is a comprehensive learning management system that bridges the gap between teachers and students,
                        providing a seamless platform for education, interaction, and growth.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex justify-center mb-3 text-blue-500">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    {stat.icon}
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Main Description */}
                <div className="bg-gradient-to-r from-[#39c1f310] to-[#2a9fd820] dark:from-[#39c1f310] dark:to-[#2a9fd820] rounded-2xl p-8 mb-12">
                    <p className="text-[18px] font-Poppins leading-relaxed text-center">
                        SmartLearn is a cutting-edge learning management system designed to empower both students and teachers. 
                        Our platform provides a seamless experience for course management, interactive quizzes, and real-time feedback.
                        <br />
                        <br />
                        Whether you are a student looking to enhance your skills with premium courses and assessments, or a teacher 
                        aiming to provide world-class education with automated grading and detailed analytics, SmartLearn is for you.
                        <br />
                        <br />
                        Join our community today and start your journey towards excellence!
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {features.map((feature, index) => (
                        <div key={index} className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-r from-[#39c1f3] to-[#2a9fd8] rounded-2xl text-white group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
                            <ul className="space-y-2">
                                {feature.items.map((item, idx) => (
                                    <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <FiCheckCircle className="text-green-500 mr-2 text-xs" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Teacher vs Student Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Teacher Card */}
                    <div className="bg-gradient-to-br from-[#39c1f3]/10 to-[#2a9fd8]/10 dark:from-[#39c1f3]/20 dark:to-[#2a9fd8]/20 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-500 rounded-xl text-white">
                                <FaChalkboardTeacher className="text-2xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">For Teachers</h2>
                        </div>
                        <ul className="space-y-3">
                            {teacherFeatures.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Student Card */}
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-green-500 rounded-xl text-white">
                                <FaUserGraduate className="text-2xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">For Students</h2>
                        </div>
                        <ul className="space-y-3">
                            {studentFeatures.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center py-12">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Join thousands of teachers and students already using SmartLearn</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button 
                            onClick={() => handleSignUpTrigger("/teacher")}
                            className="px-8 py-3 bg-gradient-to-r from-[#39c1f3] to-[#2a9fd8] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                        >
                            Get Started as Teacher
                        </button>
                        <button 
                            onClick={() => handleSignUpTrigger("/student/dashboard")}
                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                        >
                            Start Learning as Student
                        </button>
                    </div>
                </div>
            </div>
            <br />
            <br />
        </div>
    );
};

export default About;