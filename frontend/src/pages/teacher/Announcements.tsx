import React, { useEffect, useState } from "react";
import Heading from "@/utils/Heading";
import TeacherSidebar from "@/components/Teacher/Sidebar/TeacherSidebar";
import DashboardHeader from "@/components/Teacher/DashboardHeader";
import TeacherProtected from "@/hooks/teacherProtected";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useUser } from "@/hooks/useUser";
import { styles } from "@/styles/style";
import StudentAnnouncements from "@/components/Course/StudentAnnouncements";

const Announcements = () => {
  const { user } = useUser();
  const { data: coursesData } = useGetAllCoursesQuery({});
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
            <div className="mb-5">
              <label className={styles.label}>Select Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className={styles.input}
              >
                <option value="">Select a course</option>
                {coursesData?.courses?.map((course: any) => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCourse ? (
              <StudentAnnouncements courseId={selectedCourse} user={user} />
            ) : (
              <p className="text-black dark:text-white">Please select a course to manage announcements.</p>
            )}
          </div>
        </div>
      </div>
    </TeacherProtected>
  );
};

export default Announcements;
