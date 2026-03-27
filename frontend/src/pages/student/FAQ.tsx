import React from 'react';
import StudentLayout from '@/layouts/StudentLayout';
import StudentQuestions from '@/components/Student/Dashboard/StudentQuestions';

const FAQPage = () => {
    return (
        <StudentLayout title="My Q&A - SMART LEARN" description="Manage your course questions and view replies" activeItem={27}>
            <div className="w-[95%] m-auto mt-10">
                <StudentQuestions />
            </div>
        </StudentLayout>
    );
};

export default FAQPage;
