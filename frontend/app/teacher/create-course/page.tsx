"use client"
import DashboardHeader from '../../../app/components/Teacher/DashboardHeader'
import Heading from '../../../app/utils/Heading'
import TeacherSidebar from "../../components/Teacher/Sidebar/TeacherSidebar"
import React from 'react'
import CreateCourse from '../../../app/components/Teacher/Course/CreateCourse'

type Props = {}

const page = (props: Props) => {
  return (
    <div>

            <Heading
                title="SmartLearn - Teacher"
                description="Welcome to the SmartLearn - your gateway to online education. Explore courses, manage your learning, and connect with educators and peers."
                keywords="SmartLearn, Online Education, Courses, Students, Teachers"
            /> 

            <div className='flex h-[200vh'>
                <div className="1500px:w-[24%] w-1/5">
                    <TeacherSidebar />
                </div>

                <div className="w-[76%]">
                    <DashboardHeader/>
                    <CreateCourse/>

                </div>

            </div>
    </div>
  )
}

export default page