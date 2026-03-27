import React from 'react';
import StudentLayout from '@/layouts/StudentLayout';
import StudentReviews from '@/components/Student/Dashboard/StudentReviews';

const StudentReviewsPage = () => {
    return (
        <StudentLayout title="My Reviews - SMART LEARN" description="Review your feedback and instructor responses" activeItem={28}>
            <div className="w-[95%] m-auto mt-10">
                <StudentReviews />
            </div>
        </StudentLayout>
    );
};

export default StudentReviewsPage;
