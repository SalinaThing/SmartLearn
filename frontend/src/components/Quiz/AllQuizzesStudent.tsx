import React, { useState, useEffect } from 'react';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useGetQuizzesByCourseQuery } from '@/redux/features/quizzes/quizApi';
import Loader from '@/components/Loader/Loader';
import { styles } from '@/styles/style';
import { Link, useSearchParams } from 'react-router-dom';
import { useGetAllCoursesByUserQuery } from '@/redux/features/courses/coursesApi';
import QuizListStudent from '../Course/QuizListStudent';
import CourseImage from '@/utils/Image';

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

    const enrolledCourses = (user?.role === "admin" || user?.role === "teacher")
        ? allCoursesData?.courses || []
        : (allCoursesData?.courses || []).filter((course: any) =>
            enrolledCourseIds.includes(course?._id)
        );

    return (
        <div className={`w-[90%] 800px:w-[85%] m-auto ${embedded ? "mt-0" : "mt-[120px]"}`}>
            {!activeCourse ? (
                <>
                    <h1 className="text-[25px] font-Poppins font-bold mb-6">
                        <span className="text-black dark:text-white">Your</span>
                        <span className="text-[#3ccbae] ml-2">Quizzes</span>
                    </h1>
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
                                    user={user}
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

const CourseQuizSummary = ({ course, onViewQuizzes, user }: { course: any, onViewQuizzes: () => void, user?: any }) => {
    const { data, isLoading } = useGetQuizzesByCourseQuery(course._id, { refetchOnMountOrArgChange: true });

    if (isLoading) return <div className="h-[250px] flex items-center justify-center p-4 border border-gray-200 dark:border-gray-800 rounded-lg animate-pulse">Loading...</div>;

    const quizCount = data?.quizzes?.length || 0;

    return (
        <div 
            onClick={onViewQuizzes}
            className="w-full min-h-[35vh] cursor-pointer dark:bg-slate-500 dark:bg-opacity-20 backdrop-blur border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-slate-700 rounded-lg p-3 shadow-sm dark:shadow-inner hover:shadow-lg transition-all duration-300"
        >
            <div className="relative">
                <CourseImage
                    src={course?.thumbnail?.url || "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"}
                    width={400}
                    height={300}
                    style={{ objectFit: "cover" }}
                    className="rounded w-full h-[180px] object-cover"
                    alt={course?.name || "Course thumbnail"}
                />
                <div className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg">
                    {quizCount} {quizCount === 1 ? "Quiz" : "Quizzes"}
                </div>
            </div>
            
            <div className="mt-3">
                <h1 className="font-Poppins text-[16px] font-semibold text-black dark:text-[#fff] line-clamp-2 min-h-[50px]">
                    {course?.name || "Untitled Course"}
                </h1>

                <div className="w-full flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 mt-2">
                    <div className="flex items-center gap-2">
                        {user?.role !== "admin" && user?.role !== "teacher" && (
                            <div className="px-3 py-1 bg-[#3ccbae] text-white text-[12px] font-bold rounded-full uppercase tracking-wider">
                                Ready to Take
                            </div>
                        )}
                    </div>
                    <div 
                        className="flex items-center bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-lg text-blue-600 dark:text-blue-400 text-[13px] font-semibold hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                    >
                        {(user?.role === "admin" || user?.role === "teacher") ? "Get Access \u2192" : "View Now \u2192"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllQuizzesStudent;
