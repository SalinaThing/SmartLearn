import React from 'react'
import AdminLayout from '@/layouts/AdminLayout'
import EditFAQ from '@/components/Teacher/Customization/EditFAQ'

type Props = {}

const FaqPage = (props: Props) => {
    return (
        <AdminLayout
            title="Admin FAQ"
            description="SmartLearn Administrator - Manage FAQ"
            activeItem={5}
        >
            <EditFAQ />
        </AdminLayout>
    )
}

export default FaqPage
