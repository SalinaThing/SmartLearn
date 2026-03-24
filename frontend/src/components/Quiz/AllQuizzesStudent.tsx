import React from 'react';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useGetQuizzesByCourseQuery } from '@/redux/features/quizzes/quizApi';
import Loader from '@/components/Loader/Loader';
import { styles } from '@/styles/style';
import { Link } from 'react-router-dom';

const AllQuizzesStudent = ({ embedded = false }: { embedded?: boolean }) => {
    const { data: userData, isLoading: userLoading } = useLoadUserQuery(undefined, {});
    const user = userData?.user;

    if (userLoading) return <Loader />;

    return (
        <div className={`w-[90%] 800px:w-[85%] m-auto ${embedded ? "mt-0" : "mt-[120px]"}`}>
            <h1 className={`${styles.title} text-left`}>Your Quizzes</h1>
            <br />
            {user?.courses?.length === 0 ? (
                <div className="text-center mt-10">
                    <p className="text-xl dark:text-white text-black">You haven't enrolled in any courses yet.</p>
                    <Link to="/courses" className="text-blue-500 underline mt-4 inline-block">Browse Courses</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user?.courses?.map((course: any) => (
                        <CourseQuizSummary key={course._id} course={course} />
                    ))}
                </div>
            )}
        </div>
    );
};

const CourseQuizSummary = ({ course }: { course: any }) => {
    const { data, isLoading } = useGetQuizzesByCourseQuery(course._id);

    if (isLoading) return <div className="h-[200px] flex items-center justify-center p-4 border border-gray-200 dark:border-gray-800 rounded-lg animate-pulse">Loading...</div>;

    const quizCount = data?.quizzes?.length || 0;

    return (
        <div className="p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold dark:text-white text-black mb-2">{course.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{quizCount} Quizzes available</p>
            <div className="flex justify-between items-center">
                <Link 
                    to={`/course-access/${course._id}`} 
                    className={`${styles.button} !w-[140px] !h-[35px] !text-[14px]`}
                >
                    View Quizzes
                </Link>
            </div>
        </div>
    );
};

export default AllQuizzesStudent;
