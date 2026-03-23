import React from 'react';
import Heading from '@/utils/Heading';
import TeacherSidebar from '@/components/Teacher/Sidebar/TeacherSidebar';
import DashboardHeader from '@/components/Teacher/DashboardHeader';
import AllFeedback from '@/components/Teacher/Feedback/AllFeedback';
import TeacherProtected from '@/hooks/teacherProtected';

const Feedback = () => {
  return (
    <div>
      <TeacherProtected>
        <Heading
          title="SmartLearn - Teacher"
          description="SmartLearn is a platform for students to learn and get help from teachers"
          keywords="Programming,MERN,Redux,Machine Learning"
        />
        <div className="flex min-h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <TeacherSidebar />
          </div>
          <div className="w-[85%]">
            <DashboardHeader />
            <AllFeedback />
          </div>
        </div>
      </TeacherProtected>
    </div>
  );
};

export default Feedback;
