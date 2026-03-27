import React, { useState, useEffect } from 'react';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useGetQuizzesByCourseQuery } from '@/redux/features/quizzes/quizApi';
import Loader from '@/components/Loader/Loader';
import { styles } from '@/styles/style';
import { Link, useSearchParams } from 'react-router-dom';
import { useGetAllCoursesByUserQuery } from '@/redux/features/courses/coursesApi';
import QuizListStudent from '../Course/QuizListStudent';

const AllQuizzesStudent = ({ embedded = false }: { embedded?: boolean }) => {
    const { data: userData, isLoading: userLoading } = useLoadUserQuery(undefined, {});
    const { data: allCoursesData, isLoading: coursesLoading } = useGetAllCoursesByUserQuery({});
    const [searchParams] = useSearchParams();
    const urlCourseId = searchParams.get("courseId");
    
    const user = userData?.user;
    const [activeCourse, setActiveCourse] = useState<any>(null);

    useEffect(() => {
        if (allCoursesData && urlCourseId && !activeCourse) {
            const course = allCoursesData.courses.find((c: any) => c._id === urlCourseId);
            if (course) {
                setActiveCourse(course);
            }
        }
    }, [allCoursesData, urlCourseId, activeCourse]);

    if (userLoading || coursesLoading) return <Loader />;

    const enrolledCourseIds = (user?.courses || [])
        .map((c: any) => {
            if (typeof c === 'string') return c;
            return c?.courseId || c?._id || c?.course?._id;
        })
        .filter(Boolean);

    const enrolledCourses = (allCoursesData?.courses || []).filter((course: any) =>
        enrolledCourseIds.includes(course?._id)
    );

    return (
        <div className={`w-[90%] 800px:w-[85%] m-auto ${embedded ? "mt-0" : "mt-[120px]"}`}>
            {!activeCourse ? (
                <>
                    <h1 className={`${styles.title} text-left`}>Your Quizzes</h1>
                    <br />
                    {enrolledCourses.length === 0 ? (
                        <div className="text-center mt-10">
                            <p className="text-xl dark:text-white text-black">You haven't enrolled in any courses yet.</p>
                            <Link to="/courses" className="text-blue-500 underline mt-4 inline-block">Browse Courses</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolledCourses.map((course: any) => (
                                <CourseQuizSummary 
                                    key={course._id} 
                                    course={course} 
                                    onViewQuizzes={() => setActiveCourse(course)} 
                                />
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="w-full">
                    <button 
                        onClick={() => setActiveCourse(null)} 
                        className="text-blue-500 mb-6 flex items-center hover:text-blue-600 transition-colors font-Poppins"
                    >
                        &larr; Back to Course List
                    </button>
                    <h2 className="text-2xl font-bold dark:text-white text-black mb-4 font-Poppins">
                        {activeCourse.name} - Quizzes
                    </h2>
                    <div className="mt-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-2 md:p-6">
                        <QuizListStudent courseId={activeCourse._id} user={user} />
                    </div>
                </div>
            )}
        </div>
    );
};

const CourseQuizSummary = ({ course, onViewQuizzes }: { course: any, onViewQuizzes: () => void }) => {
    const { data, isLoading } = useGetQuizzesByCourseQuery(course._id, { refetchOnMountOrArgChange: true });

    if (isLoading) return <div className="h-[200px] flex items-center justify-center p-4 border border-gray-200 dark:border-gray-800 rounded-lg animate-pulse">Loading...</div>;

    const quizCount = data?.quizzes?.length || 0;

    return (
        <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold dark:text-white text-black mb-2">{course.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{quizCount} Quizzes available</p>
            <div className="flex justify-between items-center">
                <button
                    onClick={onViewQuizzes}
                    className={`${styles.button} !w-[140px] !h-[35px] !text-[14px]`}
                >
                    View Quizzes
                </button>
            </div>
        </div>
    );
};

export default AllQuizzesStudent;
