"use client"
import React from 'react'
import Heading from '../../utils/Heading'
import TeacherSidebar from '../../components/Teacher/Sidebar/TeacherSidebar'
import TeacherProtected from '../../hooks/teacherProtected'
import DashboardHero from '../../components/Teacher/DashboardHero'
import EditHero from '../../components/Teacher/Customization/EditHero'

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
                    <EditHero />
                </div>

            </div>
        </TeacherProtected>
    </div>
  )
}

export default page
