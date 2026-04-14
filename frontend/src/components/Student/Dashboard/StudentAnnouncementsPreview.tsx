import React, { FC } from 'react';
import { useGetAnnouncementsByCourseQuery } from '@/redux/features/announcements/announcementApi';
import { useGetAllCoursesByUserQuery } from '@/redux/features/courses/coursesApi';
import { useUser } from '@/hooks/useUser';
import Loader from '../../Loader/Loader';
import { format } from 'timeago.js';
import { PiSpeakerHighFill } from 'react-icons/pi';
import { Link } from 'react-router-dom';

const StudentAnnouncementsPreview: FC = () => {
    const { user } = useUser();
    const { data: coursesData, isLoading: coursesLoading } = useGetAllCoursesByUserQuery({});
    
    // Get the first enrolled course to show some announcements
    const firstCourseId = user?.courses?.[0]?.courseId || "";
    const { data: announcementsData, isLoading: announcementsLoading } = useGetAnnouncementsByCourseQuery(firstCourseId, { skip: !firstCourseId });

    const announcements = announcementsData?.announcements?.slice(0, 3) || [];

    if (coursesLoading || announcementsLoading) return <Loader />;

    return (
        <div className="w-full mt-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Latest Announcements
                </h2>
                <Link to="/student/announcements" className="text-[#39c1f3] text-sm font-semibold hover:underline">
                    View All
                </Link>
            </div>
            
            <div className="space-y-4">
                {announcements.length === 0 ? (
                    <div className="bg-white dark:bg-[#111C43] rounded-xl p-8 text-center shadow-md text-gray-500 dark:text-gray-400">
                        {firstCourseId ? "No recent announcements for your courses." : "Enroll in a course to see announcements."}
                    </div>
                ) : (
                    announcements.map((item: any) => (
                        <div key={item._id} className="bg-white dark:bg-[#111C43] rounded-xl p-4 shadow-md border-l-4 border-amber-500 hover:shadow-lg transition-all">
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg shrink-0">
                                    <PiSpeakerHighFill size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-800 dark:text-white truncate">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                                        {item.content}
                                    </p>
                                    <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                        <span>{format(item.createdAt)}</span>
                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">New</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentAnnouncementsPreview;
