"use client"
import React from 'react'
import TeacherLayout from '@/layouts/TeacherLayout'
import CreateCourse from '@/components/Teacher/Course/CreateCourse'

const page = () => {
    return (
        <TeacherLayout title="Create Course" description="Build something new and share your knowledge" activeItem={3}>
            <CreateCourse />
        </TeacherLayout>
    )
}

export default page
