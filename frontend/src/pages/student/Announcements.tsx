import React, { useState, useEffect } from 'react';
import StudentLayout from '@/layouts/StudentLayout';
import { useGetAllCoursesByUserQuery } from '@/redux/features/courses/coursesApi';
import { useUser } from '@/hooks/useUser';
import Loader from '@/components/Loader/Loader';
import { styles } from '@/styles/style';
import StudentAnnouncements from '@/components/Course/StudentAnnouncements';

const AnnouncementsPage = () => {
    const { user } = useUser();
    const { data: coursesData, isLoading: coursesLoading } = useGetAllCoursesByUserQuery({});
    const [selectedCourse, setSelectedCourse] = useState("");
    
    const enrolledCourses = coursesData?.courses?.filter((course: any) => 
        user?.courses?.some((userCourse: any) => userCourse.courseId === course._id)
    ) || [];

    useEffect(() => {
        if (enrolledCourses.length > 0 && !selectedCourse) {
            setSelectedCourse(enrolledCourses[0]._id);
        }
    }, [enrolledCourses, selectedCourse]);

    return (
        <StudentLayout title="Announcements" description="Stay updated with course progress" activeItem={15}>
            <div className="w-[95%] m-auto mt-10">
                <h1 className={`${styles.title} !text-left`}>Course Announcements</h1>
                
                <div className="mb-8">
                    <label className={styles.label}>Select Enrolled Course</label>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className={`${styles.input} !w-full md:!w-[400px] mt-2`}
                    >
                        <option value="">Select a course</option>
                        {enrolledCourses.map((course: any) => (
                            <option key={course._id} value={course._id}>{course.name}</option>
                        ))}
                    </select>
                </div>

                {coursesLoading ? (
                    <Loader />
                ) : (
                    <div className="bg-white dark:bg-[#111C43] p-6 rounded-xl shadow-md min-h-[400px]">
                        {selectedCourse ? (
                            <StudentAnnouncements courseId={selectedCourse} user={user} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                Please select a course to view announcements.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </StudentLayout>
    );
};

export default AnnouncementsPage;
