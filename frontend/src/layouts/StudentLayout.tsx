import React, { FC } from 'react'
import StudentSidebar from '../components/Student/Sidebar/StudentSidebar'
import StudentProtected from '../hooks/studentProtected'
import Heading from '../utils/Heading'
import DashboardHeader from '../components/Teacher/DashboardHeader'

interface Props {
    children: React.ReactNode;
    title?: string;
    description?: string;
    activeItem?: number;
}

const StudentLayout: FC<Props> = ({ children, title = "Student Dashboard", description = "SmartLearn Student Workspace", activeItem }) => {
    return (
        <StudentProtected>
            <div className='flex min-h-screen'>
                <Heading
                    title={`${title} - SmartLearn`}
                    description={description}
                    keywords="SmartLearn, Student Dashboard, Learning Progress"
                />
                <div className="1500px:w-[16%] w-1/5">
                    <StudentSidebar activeItem={activeItem} />
                </div>
                <div className="w-[85%] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    <DashboardHeader />
                    <div className="p-4 sm:p-8">
                        {children}
                    </div>
                </div>
            </div>
        </StudentProtected>
    )
}

export default StudentLayout;
