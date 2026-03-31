import React from 'react'
import Heading from '@/utils/Heading'
import AdminSidebar from '@/components/Admin/Sidebar/AdminSidebar'
import AdminProtected from '@/hooks/adminProtected'
import DashboardHero from '@/components/Teacher/DashboardHero'
import AllUsers from '@/components/Teacher/Users/AllUsers'

type Props = {}

const TeamPage = (props: Props) => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="SmartLearn - Admin Team"
                    description="SmartLearn Administrator - Manage Team"
                    keywords="SmartLearn, Admin, Team"
                />

                <div className='flex h-screen'>
                    <div className="1500px:w-[16%] w-1/5">
                        <AdminSidebar activeItem={7} />
                    </div>

                    <div className="w-[85%] h-screen overflow-y-scroll">
                        <DashboardHero />
                        <AllUsers isTeam={true} />
                    </div>
                </div>
            </AdminProtected>
        </div>
    )
}

export default TeamPage
