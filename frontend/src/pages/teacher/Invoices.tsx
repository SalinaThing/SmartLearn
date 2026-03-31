"use client"

import React from 'react'
import TeacherLayout from '@/layouts/TeacherLayout'
import AllInvoices from '@/components/Teacher/Orders/All_Invoices'

const page = () => {
  return (
    <TeacherLayout title="Teacher Invoices" description="Manage your earnings and sales history" activeItem={3}>
        <AllInvoices />
    </TeacherLayout>
  )
}

export default page
