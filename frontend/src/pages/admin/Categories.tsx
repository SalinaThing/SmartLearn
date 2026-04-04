import React from 'react'
import AdminLayout from '@/layouts/AdminLayout'
import EditCategory from '@/components/Teacher/Customization/EditCategory'

type Props = {}

const CategoriesPage = (props: Props) => {
    return (
        <AdminLayout
            title="Admin Categories"
            description="SmartLearn Administrator - Manage Categories"
            activeItem={6}
        >
            <EditCategory />
        </AdminLayout>
    )
}

export default CategoriesPage
