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
import Invoices from "./pages/teacher/Invoices";
import OrderAnalytics from "./pages/teacher/OrderAnalytics";
import UserAnalytics from "./pages/teacher/UserAnalytics";
import CourseAnalytics from "./pages/teacher/CourseAnalytics";
import Categories from "./pages/teacher/Categories";
import Faq from "./pages/teacher/Faq";
import Team from "./pages/teacher/Team";
import AllUsers from "./pages/teacher/AllUsers";
import AllCourses from "./pages/teacher/AllCourses";
import Quizzes from "./pages/teacher/Quizzes";
import Feedback from "./pages/teacher/Feedback";
import QuizPage from "./pages/QuizPage";
import FeedbackPage from "./pages/FeedbackPage";
import AboutPage from "./pages/About";
import FAQPage from "./pages/FAQ";


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
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/create-course" element={<CreateCourse />} />
        <Route path="/teacher/edit-course/:id" element={<EditCourse />} />
        <Route path="/teacher/hero-layout" element={<HeroLayout />} />
        <Route path="/teacher/invoices" element={<Invoices />} />
        <Route path="/teacher/order-analytics" element={<OrderAnalytics />} />
        <Route path="/teacher/user-analytics" element={<UserAnalytics />} />
        <Route path="/teacher/course-analytics" element={<CourseAnalytics />} />
        <Route path="/teacher/categories" element={<Categories />} />
        <Route path="/teacher/faq" element={<Faq />} />
        <Route path="/teacher/team" element={<Team />} />
        <Route path="/teacher/all-users" element={<AllUsers />} />
        <Route path="/teacher/allcourses" element={<AllCourses />} />
        <Route path="/teacher/quizzes" element={<Quizzes />} /> 
        <Route path="/teacher/feedback" element={<Feedback />} /> 
        <Route path="/quiz" element={<QuizPage />} /> 
        <Route path="/feedback" element={<FeedbackPage />} /> 
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
      </Route>
    </Routes>
  );
}
