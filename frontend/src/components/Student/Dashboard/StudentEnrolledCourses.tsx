import React, { FC } from 'react';
import { useGetAllCoursesByUserQuery } from '@/redux/features/courses/coursesApi';
import { useUser } from '@/hooks/useUser';
import CourseCard from '../../Course/CourseCard';
import Loader from '../../Loader/Loader';

const StudentEnrolledCourses: FC = () => {
    const { user } = useUser();
    const { data, isLoading } = useGetAllCoursesByUserQuery({});

    const enrolledCourses = data?.courses?.filter((course: any) => 
        user?.courses?.some((userCourse: any) => userCourse.courseId === course._id)
    ) || [];

    if (isLoading) return <Loader />;

    return (
        <div className="w-full mt-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Enrolled in Course
            </h2>
            {enrolledCourses.length === 0 ? (
                <div className="bg-white dark:bg-[#111C43] rounded-xl p-8 text-center shadow-md">
                    <p className="text-gray-500 dark:text-gray-400">
                        You are not enrolled in any courses yet.
                    </p>
                    <button className="mt-4 px-6 py-2 bg-[#3ccbae] text-white rounded-lg hover:bg-[#2bb298] transition-colors">
                        Browse Courses
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCourses.map((course: any) => (
                        <CourseCard key={course._id} item={course} isProfile={true} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentEnrolledCourses;
