import React, { FC } from 'react'
import AdminSidebar from '../components/Admin/Sidebar/AdminSidebar'
import AdminProtected from '../hooks/adminProtected'
import Heading from '../utils/Heading'
import DashboardHeader from '../components/Teacher/DashboardHeader'

interface Props {
    children: React.ReactNode;
    title?: string;
    description?: string;
    activeItem?: number;
}

const AdminLayout: FC<Props> = ({ children, title = "Admin Dashboard", description = "SmartLearn Administrator Workspace", activeItem }) => {
    const [open, setOpen] = React.useState(false);
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <AdminProtected>
            <div className='flex min-h-screen bg-white dark:bg-gray-900'>
                <Heading
                    title={`${title} - SmartLearn`}
                    description={description}
                    keywords="SmartLearn, Admin Dashboard, Analytics"
                />

                {/* Collapsible Admin Sidebar */}
                <AdminSidebar 
                    activeItem={activeItem} 
                    open={open} 
                    setOpen={setOpen} 
                    isCollapsed={isCollapsed} 
                    setIsCollapsed={setIsCollapsed} 
                />

                {/* Main Content Area - Synchronized Indentation */}
                <div 
                    className={`flex-1 w-full transition-all duration-300 ${
                        isCollapsed ? "800px:ml-[80px]" : "800px:ml-[250px]"
                    }`}
                >
                    <DashboardHeader open={open} setOpen={setOpen} />
                    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-[1600px]">
                        {children}
                    </div>
                </div>
            </div>
        </AdminProtected>
    )
}

export default AdminLayout;
