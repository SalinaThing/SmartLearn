import React from 'react';
import { useGetAnnouncementsByCourseQuery } from '@/redux/features/announcements/announcementApi';
import Loader from '../Loader/Loader';
import { format } from 'timeago.js';

type Props = {
    courseId: string;
}

const StudentAnnouncements = ({ courseId }: Props) => {
    const { data, isLoading } = useGetAnnouncementsByCourseQuery(courseId);

    return (
        <div className="w-full">
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full p-4">
                    {data?.announcements.length === 0 ? (
                        <p className="text-black dark:text-white text-center mt-10">No announcements yet.</p>
                    ) : (
                        data?.announcements.map((item: any) => (
                            <div key={item._id} className="mb-6 p-4 bg-slate-500 bg-opacity-10 rounded-lg">
                                <h1 className="text-[20px] font-Poppins font-[500] text-black dark:text-white">
                                    {item.title}
                                </h1>
                                <p className="text-[16px] text-[#000000b8] dark:text-[#ffffffb8] mt-2 whitespace-pre-line">
                                    {item.content}
                                </p>
                                <div className="text-right mt-2">
                                    <small className="text-[#00000083] dark:text-[#ffffff83]">
                                        {format(item.createdAt)}
                                    </small>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentAnnouncements;
