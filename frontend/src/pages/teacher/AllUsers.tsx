import React from 'react'
import TeacherLayout from '@/layouts/TeacherLayout'
import AllUsers from '@/components/Teacher/Users/AllUsers'

const page = () => {
  return (
    <TeacherLayout title="Teacher All Users" description="Manage your team and students" activeItem={2}>
        <AllUsers />
    </TeacherLayout>
  )
}

export default page
