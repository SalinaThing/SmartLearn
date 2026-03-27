import React from 'react';
import StudentLayout from '@/layouts/StudentLayout';
import FeedbackForm from '@/components/Course/FeedbackForm';
import StudentFeedbackList from '@/components/Student/Dashboard/StudentFeedbackList';

const FeedbackPage = () => {
    return (
        <StudentLayout title="My Feedback" description="Manage your feedback to teachers" activeItem={26}>
            <div className="w-[95%] m-auto mt-10 space-y-10">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Submit New Feedback</h1>
                    <FeedbackForm />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Previous Feedback</h1>
                    <StudentFeedbackList />
                </div>
            </div>
        </StudentLayout>
    );
};

export default FeedbackPage;
