import React from 'react'
import AdminLayout from '@/layouts/AdminLayout'
import AllUsers from '@/components/Teacher/Users/AllUsers'

const TeamPage = () => {
    return (
        <AdminLayout
            title="Manage Team"
            description="SmartLearn Administrator - Manage Team"
            activeItem={7}
        >
            <AllUsers isTeam={true} />
        </AdminLayout>
    )
}

export default TeamPage
