import React from 'react'
import StudentLayout from '@/layouts/StudentLayout'
import StudentDashboardWidgets from '@/components/Student/Widgets/StudentDashboardWidgets'

type Props = {}

const StudentDashboard = (props: Props) => {
    return (
        <StudentLayout title="Student Dashboard" description="Overview of your learning progress" activeItem={1}>
            <StudentDashboardWidgets />
        </StudentLayout>
    )
}

export default StudentDashboard;
