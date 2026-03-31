import React from 'react'
import TeacherLayout from '@/layouts/TeacherLayout'
import AllCourses from '@/components/Teacher/Course/AllCourses'

const page = () => {
  return (
    <TeacherLayout title="Teacher All Courses" description="Manage your course listings" activeItem={4}>
        <AllCourses />
    </TeacherLayout>
  )
}

export default page
