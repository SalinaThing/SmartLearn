import React, { useState } from 'react'
import TeacherProtected from '@/hooks/teacherProtected'
import Heading from '@/utils/Heading'
import TeacherSidebar from '@/components/Teacher/Sidebar/TeacherSidebar'
import DashboardHeader from '@/components/Teacher/DashboardHeader'
import CreateAnnouncement from '@/components/Teacher/Announcements/CreateAnnouncement'
import AllAnnouncements from '@/components/Teacher/Announcements/AllAnnouncements'

const Announcements = () => {
    const [route, setRoute] = useState("All Announcements");

    return (
        <TeacherProtected>
            <div className="flex h-screen">
                <div className="1500px:w-[16%] w-1/5">
                    <TeacherSidebar activeItem={15} />
                </div>
                <div className="1500px:w-[84%] w-4/5">
                    <DashboardHeader />
                    {route === "All Announcements" && (
                        <div className="w-full">
                            <div className="w-full flex justify-end px-4 mt-5">
                                <button
                                    className="bg-[#2190ff] text-white px-4 py-2 rounded-md font-Poppins"
                                    onClick={() => setRoute("Create Announcement")}
                                >
                                    Create New
                                </button>
                            </div>
                            <AllAnnouncements />
                        </div>
                    )}
                    {route === "Create Announcement" && (
                        <CreateAnnouncement setRoute={setRoute} />
                    )}
                </div>
            </div>
        </TeacherProtected>
    )
}

export default Announcements
