import React from 'react';
import TeacherLayout from '@/layouts/TeacherLayout';
import AllFeedback from '@/components/Teacher/Feedback/AllFeedback';

const Feedback = () => {
  return (
    <TeacherLayout title="Teacher Feedback" description="Manage and review student feedback" activeItem={303}>
        <AllFeedback />
    </TeacherLayout>
  );
};

export default Feedback;
