import React from 'react'
import AdminLayout from '@/layouts/AdminLayout'
import AllInvoices from '@/components/Teacher/Orders/All_Invoices'

const page = () => {
  return (
    <AdminLayout title="All Invoices" description="Manage platform earnings" activeItem={3}>
        <AllInvoices />
    </AdminLayout>
  )
}

export default page
