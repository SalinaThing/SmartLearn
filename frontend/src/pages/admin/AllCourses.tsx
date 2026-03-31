import React from 'react'
import AdminLayout from '@/layouts/AdminLayout'
import AllCourses from '@/components/Teacher/Course/AllCourses'

const page = () => {
    return (
        <AdminLayout title="Admin All Courses" description="Manage platform courses" activeItem={4}>
            <AllCourses />
        </AdminLayout>
    )
}

export default page
