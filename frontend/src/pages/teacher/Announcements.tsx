import React, { useEffect, useState } from "react";
import Heading from "@/utils/Heading";
import TeacherSidebar from "@/components/Teacher/Sidebar/TeacherSidebar";
import DashboardHeader from "@/components/Teacher/DashboardHeader";
import TeacherProtected from "@/hooks/teacherProtected";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useUser } from "@/hooks/useUser";
import { styles } from "@/styles/style";
import StudentAnnouncements from "@/components/Course/StudentAnnouncements";
import CreateAnnouncement from "@/components/Teacher/Announcements/CreateAnnouncement";

const Announcements = () => {
  const { user } = useUser();
  const { data: coursesData, isLoading: coursesLoading } = useGetAllCoursesQuery({});
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    if (!selectedCourse && coursesData?.courses?.length) {
      setSelectedCourse(coursesData.courses[0]._id);
    }
  }, [coursesData, selectedCourse]);

  return (
    <TeacherProtected>
      <Heading
        title="SmartLearn - Announcements"
        description="Manage course announcements"
        keywords="announcements, teacher dashboard, SmartLearn"
      />
      <div className="flex min-h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <TeacherSidebar activeItem={15} />
        </div>
        <div className="1500px:w-[84%] w-4/5">
          <DashboardHeader />

          <div className="w-[95%] m-auto mt-6">
            <h1 className={`${styles.title} !text-left mb-6`}>Manage Announcements</h1>
            
            <div className="bg-white dark:bg-[#111c43] p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
               <div className="mb-2">
                    <label className="text-[14px] font-medium text-gray-700 dark:text-gray-300">Select Course</label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className={`${styles.input} !mt-1`}
                    >
                      <option value="">Select a course to manage</option>
                      {coursesData?.courses?.map((course: any) => (
                        <option key={course._id} value={course._id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                </div>
            </div>

            {coursesLoading ? (
              <p className="text-black dark:text-white text-center mt-10">Loading courses...</p>
            ) : !coursesData?.courses?.length ? (
              <p className="text-black dark:text-white text-center mt-10">
                You have no courses yet. Please <a href="/teacher/create-course" className="text-[#39c1f3] underline">create a course</a> first.
              </p>
            ) : (
              selectedCourse ? (
                <div className="space-y-8">
                   <StudentAnnouncements courseId={selectedCourse} user={user} />
                </div>
              ) : (
                <p className="text-black dark:text-white text-center py-10">Please select a course to manage announcements.</p>
              )
            )}
          </div>
        </div>
      </div>
    </TeacherProtected>
  );
};

export default Announcements;

