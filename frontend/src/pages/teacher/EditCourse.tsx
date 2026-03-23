import DashboardHeader from '@/components/Teacher/DashboardHeader'
import Heading from '@/utils/Heading'
import TeacherSidebar from "@/components/Teacher/Sidebar/TeacherSidebar"
import React from 'react'
import EditCourse from '@/components/Teacher/Course/EditCourse'
import { useParams } from 'react-router-dom'

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>()
  return (
    <div>

            <Heading
                title="SmartLearn - Teacher"
                description="Welcome to the SmartLearn - your gateway to online education. Explore courses, manage your learning, and connect with educators and peers."
                keywords="SmartLearn, Online Education, Courses, Students, Teachers"
            /> 

            <div className='flex h-[200vh]'>
                <div className="1500px:w-[24%] w-1/5">
                    <TeacherSidebar />
                </div>

                <div className="w-[76%]">
                    <DashboardHeader/>
                    <EditCourse id={id!}/>

                </div>

            </div>
    </div>
  )
}
