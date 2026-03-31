import React from 'react'
import TeacherLayout from '@/layouts/TeacherLayout'
import DashboardHero from '@/components/Teacher/DashboardHero'

const page = () => {
    return (
        <TeacherLayout title="Teacher Dashboard" description="SmartLearn Teacher Overview" activeItem={1}>
            <DashboardHero isDashboard={true} />
        </TeacherLayout>
    )
}

export default page
