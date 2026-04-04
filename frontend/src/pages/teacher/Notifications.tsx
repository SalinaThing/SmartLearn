import React from 'react'
import TeacherLayout from '@/layouts/TeacherLayout'
import AllNotifications from '@/components/Admin/Notifications/AllNotifications'

const NotificationsPage = () => {
    return (
        <TeacherLayout title="Teacher Notifications" description="SmartLearn Teacher Alerts and Notifications" activeItem={21}>
            <div className="w-full">
                <AllNotifications isDashboard={true} />
            </div>
        </TeacherLayout>
    )
}

export default NotificationsPage
