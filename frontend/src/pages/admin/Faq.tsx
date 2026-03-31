import React from 'react'
import Heading from '@/utils/Heading'
import AdminSidebar from '@/components/Admin/Sidebar/AdminSidebar'
import AdminProtected from '@/hooks/adminProtected'
import DashboardHero from '@/components/Teacher/DashboardHero'
import EditFAQ from '@/components/Teacher/Customization/EditFAQ'

type Props = {}

const FaqPage = (props: Props) => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="SmartLearn - Admin FAQ"
                    description="SmartLearn Administrator - Manage FAQ"
                    keywords="SmartLearn, Admin, FAQ"
                />

                <div className='flex h-screen'>
                    <div className="1500px:w-[16%] w-1/5">
                        <AdminSidebar activeItem={5} />
                    </div>

                    <div className="w-[85%] h-screen overflow-y-scroll">
                        <DashboardHero />
                        <EditFAQ />
                    </div>
                </div>
            </AdminProtected>
        </div>
    )
}

export default FaqPage
