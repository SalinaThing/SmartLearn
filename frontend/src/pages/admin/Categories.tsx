import React from 'react'
import Heading from '@/utils/Heading'
import AdminSidebar from '@/components/Admin/Sidebar/AdminSidebar'
import AdminProtected from '@/hooks/adminProtected'
import DashboardHero from '@/components/Teacher/DashboardHero'
import EditCategory from '@/components/Teacher/Customization/EditCategory'

type Props = {}

const CategoriesPage = (props: Props) => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="SmartLearn - Admin Categories"
                    description="SmartLearn Administrator - Manage Categories"
                    keywords="SmartLearn, Admin, Categories"
                />

                <div className='flex h-screen'>
                    <div className="1500px:w-[16%] w-1/5">
                        <AdminSidebar activeItem={6} />
                    </div>

                    <div className="w-[85%] h-screen overflow-y-scroll">
                        <DashboardHero />
                        <EditCategory />
                    </div>
                </div>
            </AdminProtected>
        </div>
    )
}

export default CategoriesPage
