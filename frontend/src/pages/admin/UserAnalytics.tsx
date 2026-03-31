import React from 'react'
import AdminLayout from '@/layouts/AdminLayout'
import UserAnalytics from '@/components/Teacher/Analytics/UserAnalytics'

const UserAnalyticsPage = () => {
    return (
        <AdminLayout title="User Analytics" description="Analyze user growth and activity data" activeItem={8}>
            <UserAnalytics />
        </AdminLayout>
    )
}

export default UserAnalyticsPage
