import React from 'react'
import AdminLayout from '@/layouts/AdminLayout'
import AllUsers from '@/components/Teacher/Users/AllUsers'

const page = () => {
    return (
        <AdminLayout title="Admin All Users" description="Manage platform users" activeItem={2}>
            <AllUsers />
        </AdminLayout>
    )
}

export default page
