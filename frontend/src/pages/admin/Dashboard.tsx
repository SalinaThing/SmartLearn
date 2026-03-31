import React from 'react'
import AdminLayout from '@/layouts/AdminLayout'
import DashboardHero from '@/components/Teacher/DashboardHero'

const page = () => {
    return (
        <AdminLayout title="Admin Dashboard" description="SmartLearn Administrator Overview" activeItem={1}>
            <DashboardHero isDashboard={true} />
        </AdminLayout>
    )
}

export default page
