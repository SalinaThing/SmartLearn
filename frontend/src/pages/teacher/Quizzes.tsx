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
                        className={`${route === "All Quizzes" ? "bg-[#2190ff]" : "bg-gray-500"} text-white px-4 py-2 rounded-md font-Poppins transition-all`}
                        onClick={() => setRoute("All Quizzes")}
                    >
                        All Quizzes
                    </button>
                    <button
                        className={`${route === "Create Quiz" ? "bg-[#2190ff]" : "bg-gray-500"} text-white px-4 py-2 rounded-md font-Poppins transition-all`}
                        onClick={() => setRoute("Create Quiz")}
                    >
                        Create Quiz
                    </button>
                    <button
                        className={`${route === "All Results" ? "bg-[#2190ff]" : "bg-gray-500"} text-white px-4 py-2 rounded-md font-Poppins transition-all`}
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
