import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import AllFeedback from '@/components/Teacher/Feedback/AllFeedback';

const Feedback = () => {
    return (
        <AdminLayout 
            title="Admin Feedback" 
            description="View all student feedback for courses and teachers" 
            activeItem={11}
        >
            <AllFeedback />
        </AdminLayout>
    );
};

export default Feedback;
