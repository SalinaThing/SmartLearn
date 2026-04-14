import React from 'react'
import AdminLayout from '@/layouts/AdminLayout'
import AllNotifications from '@/components/Admin/Notifications/AllNotifications'

const NotificationsPage = () => {
    return (
        <AdminLayout title="Admin Notifications" description="SmartLearn Administrator Alerts and Notifications" activeItem={12}>
            <div className="w-full">
                <AllNotifications isDashboard={true} />
            </div>
        </AdminLayout>
    )
}

export default NotificationsPage
