import React, { FC } from 'react'
import UserAnalytics from '../Analytics/UserAnalytics';
import { BiBorderLeft } from 'react-icons/bi';
import { Box, CircularProgress } from '@mui/material';
import { PiUsersFourLight } from 'react-icons/pi';
import OrderAnalytics from '../Analytics/OrderAnalytics';
import All_Invoices from '../Orders/All_Invoices';
import CourseAnalytics from '../Analytics/CourseAnalytics';

type Props = {
    open?: boolean;
    value?: number;
}

const CircularProgressWithLabel: FC<Props> = ({ value }) => {
    return (
        <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
                variant="determinate"
                value={value}
                size={45}
                color={value && value > 99 ? "info" : "error"}
                thickness={4}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
            </Box>
        </Box>
    );
}

const DashboardWidgets: FC<Props> = ({ value }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">

                {/* Main Analytics Row */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    {/* Top Section - User Analytics */}
                    <div className="w-full transform transition-all duration-300 hover:shadow-xl">
                        <div className="bg-white dark:bg-[#111C43] rounded-xl shadow-md overflow-hidden">
                            <div className="p-3 sm:p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
                                    User Analytics
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    User engagement and activity overview
                                </p>
                            </div>
                            <div className="p-2 sm:p-3 md:p-4">
                                <UserAnalytics isDashboard={true} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comparison Section - Side by Side Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mt-6 sm:mt-8">
                    {/* Sales Card */}
                    <div className="bg-white dark:bg-[#111C43] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                        <div className="p-3 sm:p-4 md:p-6">
                            <div className="flex items-start justify-between gap-3 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#3ccbae] bg-opacity-10 flex items-center justify-center mb-2 sm:mb-3">
                                        <BiBorderLeft className="dark:text-[#45CBA0] text-[#3ccbae] text-xl sm:text-2xl md:text-3xl" />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-1 sm:mt-2">
                                        120
                                    </h3>
                                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mt-1 break-words">
                                        Sales Obtained
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 whitespace-nowrap">
                                            ↑ +120%
                                        </span>
                                    </div>
                                </div>
                                <div className="text-center flex-shrink-0">
                                    <CircularProgressWithLabel value={100} />
                                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">
                                        +120%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />

                    {/* New Users Card */}
                    <div className="bg-white dark:bg-[#111C43] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                        <div className="p-3 sm:p-4 md:p-6">
                            <div className="flex items-start justify-between gap-3 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#3ccbae] bg-opacity-10 flex items-center justify-center mb-2 sm:mb-3">
                                        <PiUsersFourLight className="dark:text-[#45CBA0] text-[#3ccbae] text-xl sm:text-2xl md:text-3xl" />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-1 sm:mt-2">
                                        450
                                    </h3>
                                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mt-1 break-words">
                                        New Users
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 whitespace-nowrap">
                                            ↑ +150%
                                        </span>
                                    </div>
                                </div>
                                <div className="text-center flex-shrink-0">
                                    <CircularProgressWithLabel value={100} />
                                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">
                                        +150%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <br />

                {/* Bottom Section - Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mt-6 sm:mt-8">
                    {/* Course Analytics */}
                    <div className="bg-white dark:bg-[#111C43] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                        <div className="p-2 sm:p-3 md:p-4">
                            <CourseAnalytics isDashboard={true} />
                        </div>
                    </div>
                    <br />
                    <br />

                    {/* Order Analytics */}
                    <div className="bg-white dark:bg-[#111C43] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                        <div className="p-2 sm:p-3 md:p-4">
                            <OrderAnalytics isDashboard={true} />
                        </div>
                    </div>
                </div>
                <br />
                <br />

                {/* Bottom Section - Recent Transactions */}
                <div className="grid grid-cols-1 mt-6 sm:mt-8">
                    <div className="bg-white dark:bg-[#111C43] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-2 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-white">
                                Recent Transactions
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Latest transactions overview
                            </p>
                        </div>
                        <div className="p-0">
                            <All_Invoices isDashboard={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardWidgets