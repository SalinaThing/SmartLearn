import React from 'react'
import AdminLayout from '@/layouts/AdminLayout'
import CourseAnalytics from '@/components/Teacher/Analytics/CourseAnalytics'

const CourseAnalyticsPage = () => {
    return (
        <AdminLayout title="Course Analytics" description="Analyze course performance and data" activeItem={4}>
            <CourseAnalytics />
        </AdminLayout>
    )
}

export default CourseAnalyticsPage
