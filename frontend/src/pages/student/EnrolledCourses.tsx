import React from 'react';
import StudentLayout from '@/layouts/StudentLayout';
import StudentEnrolledCourses from '@/components/Student/Dashboard/StudentEnrolledCourses';

const EnrolledCoursesPage = () => {
    return (
        <StudentLayout title="My Enrolled Courses" description="View and manage your enrolled courses" activeItem={2}>
            <div className="w-[95%] m-auto mt-10">
                <StudentEnrolledCourses />
            </div>
        </StudentLayout>
    );
};

export default EnrolledCoursesPage;