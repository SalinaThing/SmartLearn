import React, { useState } from 'react';
import TeacherLayout from '@/layouts/TeacherLayout';
import AllQuizzes from '@/components/Teacher/Quizzes/AllQuizzes';
import AllResultsTeacher from '@/components/Teacher/Quizzes/AllResultsTeacher';
import CreateQuiz from '@/components/Teacher/Quizzes/CreateQuiz';
import EditQuiz from '@/components/Teacher/Quizzes/EditQuiz';

const Quizzes = () => {
    const [route, setRoute] = useState("All Quizzes");
    const [quizData, setQuizData] = useState<any>(null);

    return (
        <TeacherLayout title="Teacher Quizzes" description="Manage and create assessments" activeItem={14}>
            <div className="w-full">
                <div className="w-full flex justify-end px-4 mt-5 gap-4">
                    <button
                        className={`${route === "All Quizzes" ? "bg-gradient-to-r from-[#39c1f3] to-[#2a9fd8] hover:from-[#2a9fd8] hover:to-[#1f8bc0] shadow-md border-transparent text-white" : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#39c1f3] dark:hover:border-[#39c1f3]"} px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95`}
                        onClick={() => setRoute("All Quizzes")}
                    >
                        All Quizzes
                    </button>
                    <button
                        className={`${route === "Create Quiz" ? "bg-gradient-to-r from-[#39c1f3] to-[#2a9fd8] hover:from-[#2a9fd8] hover:to-[#1f8bc0] shadow-md border-transparent text-white" : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#39c1f3] dark:hover:border-[#39c1f3]"} px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95`}
                        onClick={() => setRoute("Create Quiz")}
                    >
                        Create Quiz
                    </button>
                    <button
                        className={`${route === "All Results" ? "bg-gradient-to-r from-[#39c1f3] to-[#2a9fd8] hover:from-[#2a9fd8] hover:to-[#1f8bc0] shadow-md border-transparent text-white" : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#39c1f3] dark:hover:border-[#39c1f3]"} px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-95`}
                        onClick={() => setRoute("All Results")}
                    >
                        Student Results
                    </button>
                </div>
                
                <div className="mt-8">
                    {route === "All Quizzes" && <AllQuizzes setRoute={setRoute} setQuizData={setQuizData} />}
                    {route === "Create Quiz" && <CreateQuiz setRoute={setRoute} />}
                    {route === "Edit Quiz" && <EditQuiz setRoute={setRoute} quizData={quizData} />}
                    {route === "All Results" && <AllResultsTeacher />}
                </div>
            </div>
        </TeacherLayout>
    );
};

export default Quizzes;
