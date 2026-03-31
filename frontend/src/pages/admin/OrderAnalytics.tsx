import React from 'react'
import AdminLayout from '@/layouts/AdminLayout'
import OrderAnalytics from '@/components/Teacher/Analytics/OrderAnalytics'

const OrderAnalyticsPage = () => {
    return (
        <AdminLayout title="Order Analytics" description="Analyze platform sales and order data" activeItem={9}>
            <OrderAnalytics />
        </AdminLayout>
    )
}

export default OrderAnalyticsPage
