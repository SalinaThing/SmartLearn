import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "@/components/Loader/Loader";
import RootShell from "./RootShell";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Profile from "./pages/Profile";
import CourseDetail from "./pages/CourseDetail";
import CourseAccess from "./pages/CourseAccess";
import TeacherDashboard from "./pages/teacher/Dashboard";
import CreateCourse from "./pages/teacher/CreateCourse";
import EditCourse from "./pages/teacher/EditCourse";
import HeroLayout from "./pages/teacher/HeroLayout";
import Quizzes from "./pages/teacher/Quizzes";
import Announcements from "./pages/teacher/Announcements";
import Feedback from "./pages/teacher/Feedback";
import StudentDashboard from "./pages/student/Dashboard";
import StudentQuizzes from "./pages/student/Quizzes";
import StudentAnnouncements from "./pages/student/Announcements";
import StudentFeedback from "./pages/student/Feedback";
import StudentFAQ from "./pages/student/FAQ";
import StudentReviews from "./pages/student/Reviews";
import EnrolledCoursesPage from "./pages/student/EnrolledCourses";
import QuizPage from "./pages/QuizPage";
import FeedbackPage from "./pages/FeedbackPage";
import AboutPage from "./pages/About";
import FAQPage from "./pages/FAQ";


import Invoices from "./pages/teacher/Invoices";
import OrderAnalytics from "./pages/teacher/OrderAnalytics";
import UserAnalytics from "./pages/teacher/UserAnalytics";
import CourseAnalytics from "./pages/teacher/CourseAnalytics";
import Categories from "./pages/teacher/Categories";
import Faq from "./pages/teacher/Faq";
import Team from "./pages/teacher/Team";
import AllUsers from "./pages/teacher/AllUsers";
import AllCourses from "./pages/teacher/AllCourses";

// Admin Imports
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAllUsers from "./pages/admin/AllUsers";
import AdminAllCourses from "./pages/admin/AllCourses";
import AdminInvoices from "./pages/admin/Invoices";
import AdminFaq from "./pages/admin/Faq";
import AdminCategories from "./pages/admin/Categories";
import AdminTeam from "./pages/admin/Team";
import AdminUserAnalytics from "./pages/admin/UserAnalytics";
import AdminOrderAnalytics from "./pages/admin/OrderAnalytics";
import AdminCourseAnalytics from "./pages/admin/CourseAnalytics";

export default function App() {
  return (
    <Routes>
      <Route element={<RootShell />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/courses"
          element={
            <Suspense fallback={<Loader />}>
              <Courses />
            </Suspense>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/course-access/:id" element={<CourseAccess />} />

        {/* Teacher Routes */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/create-course" element={<CreateCourse />} />
        <Route path="/teacher/edit-course/:id" element={<EditCourse />} />
        <Route path="/teacher/hero-layout" element={<HeroLayout />} />
        <Route path="/teacher/invoices" element={<Invoices />} />
        <Route path="/teacher/order-analytics" element={<OrderAnalytics />} />
        <Route path="/teacher/user-analytics" element={<UserAnalytics />} />
        <Route path="/teacher/course-analytics" element={<CourseAnalytics />} />
        <Route path="/teacher/team" element={<Team />} />
        <Route path="/teacher/all-users" element={<AllUsers />} />
        <Route path="/teacher/allcourses" element={<AllCourses />} />
        <Route path="/teacher/quizzes" element={<Quizzes />} />
        <Route path="/teacher/announcements" element={<Announcements />} />
        <Route path="/teacher/feedback" element={<Feedback />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminAllUsers />} />
        <Route path="/admin/courses" element={<AdminAllCourses />} />
        <Route path="/admin/invoices" element={<AdminInvoices />} />
        <Route path="/admin/faq" element={<AdminFaq />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/team" element={<AdminTeam />} />
        <Route path="/admin/user-analytics" element={<AdminUserAnalytics />} />
        <Route path="/admin/order-analytics" element={<AdminOrderAnalytics />} />
        <Route path="/admin/course-analytics" element={<AdminCourseAnalytics />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/courses" element={<EnrolledCoursesPage />} />
        <Route path="/student/quizzes" element={<StudentQuizzes />} />
        <Route path="/student/announcements" element={<StudentAnnouncements />} />
        <Route path="/student/feedback" element={<StudentFeedback />} />
        <Route path="/student/faq" element={<StudentFAQ />} />
        <Route path="/student/reviews" element={<StudentReviews />} />

        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
      </Route>
    </Routes>
  );
}
