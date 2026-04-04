import React from 'react'
import StudentLayout from '@/layouts/StudentLayout'
import AllNotifications from '@/components/Admin/Notifications/AllNotifications'

const NotificationsPage = () => {
    return (
        <StudentLayout title="My Notifications" description="Student alerts and notifications" activeItem={8}>
            <div className="w-full">
                <AllNotifications isDashboard={true} />
            </div>
        </StudentLayout>
    )
}

export default NotificationsPage
