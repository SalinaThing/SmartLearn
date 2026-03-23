 "use client"
 
import Heading from '@/utils/Heading'
import TeacherProtected from '@/hooks/teacherProtected'
import React from 'react'
import DashboardHero from '@/components/Teacher/DashboardHero'
import TeacherSidebar from '@/components/Teacher/Sidebar/TeacherSidebar'
import AllCourses from '@/components/Teacher/Course/AllCourses'
 
 type Props = {}
 
 const page = (props: Props) => {
   return (
    <div>
      <TeacherProtected>
            <Heading
                title="SmartLearn - Teacher"
                description="Welcome to the SmartLearning - your gateway to online education. Explore courses, manage your learning, and connect with educators and peers."
                keywords="SmartLearn, Online Education, Courses, Students, Teachers"
            />

            <div className='flex h-screen'>
                <div className="1500px:w-[16%] w-1/5">
                    <TeacherSidebar />
                </div>

                <div className="w-[85%]">
                    <DashboardHero/>
                    <AllCourses/>
                </div>

            </div>
        </TeacherProtected>
    </div>
   )
 }

 export default page
