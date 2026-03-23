import React, { useState } from 'react';
import Heading from '@/utils/Heading';
import TeacherSidebar from '@/components/Teacher/Sidebar/TeacherSidebar';
import DashboardHeader from '@/components/Teacher/DashboardHeader';
import AllQuizzes from '@/components/Teacher/Quizzes/AllQuizzes';
import AllResultsTeacher from '@/components/Teacher/Quizzes/AllResultsTeacher';
import CreateQuiz from '@/components/Teacher/Quizzes/CreateQuiz';
import EditQuiz from '@/components/Teacher/Quizzes/EditQuiz';
import TeacherProtected from '@/hooks/teacherProtected';

const Quizzes = () => {
    const [route, setRoute] = useState("All Quizzes");
    const [quizData, setQuizData] = useState<any>(null);

    return (
        <TeacherProtected>
            <Heading
                title="SmartLearn - Teacher"
                description="SmartLearn is a platform for students to learn and get help from teachers"
                keywords="Programming,MERN,Redux,Machine Learning"
            />
            <div className="flex h-screen">
                <div className="1500px:w-[16%] w-1/5">
                    <TeacherSidebar activeItem={14} />
                </div>
                <div className="1500px:w-[84%] w-4/5">
                    <DashboardHeader />
                    <div className="w-full flex justify-end px-4 mt-5 gap-4">
                        <button
                            className={`${route === "All Quizzes" ? "bg-[#2190ff]" : "bg-gray-500"} text-white px-4 py-2 rounded-md font-Poppins`}
                            onClick={() => setRoute("All Quizzes")}
                        >
                            All Quizzes
                        </button>
                        <button
                            className={`${route === "Create Quiz" ? "bg-[#2190ff]" : "bg-gray-500"} text-white px-4 py-2 rounded-md font-Poppins`}
                            onClick={() => setRoute("Create Quiz")}
                        >
                            Create Quiz
                        </button>
                        <button
                            className={`${route === "All Results" ? "bg-[#2190ff]" : "bg-gray-500"} text-white px-4 py-2 rounded-md font-Poppins`}
                            onClick={() => setRoute("All Results")}
                        >
                            Student Results
                        </button>
                    </div>
                    {route === "All Quizzes" && <AllQuizzes setRoute={setRoute} setQuizData={setQuizData} />}
                    {route === "Create Quiz" && <CreateQuiz setRoute={setRoute} />}
                    {route === "Edit Quiz" && <EditQuiz setRoute={setRoute} quizData={quizData} />}
                    {route === "All Results" && <AllResultsTeacher />}
                </div>
            </div>
        </TeacherProtected>
    );
};

export default Quizzes;
