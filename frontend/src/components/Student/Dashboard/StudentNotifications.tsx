import React, { FC, useEffect, useState } from 'react';
import { useGetAllNotificationsQuery, useUpdateNotificationStatusMutation } from '@/redux/features/notifications/notificationApi';
import Loader from '../../Loader/Loader';
import { PiBellRingingFill, PiEnvelopeSimpleOpenFill } from 'react-icons/pi';
import { format } from 'timeago.js';

const StudentNotifications: FC = () => {
    const { data, isLoading, refetch } = useGetAllNotificationsQuery(undefined, {
        pollingInterval: 30000, // Poll every 30 seconds
    });
    const [updateStatus, { isSuccess }] = useUpdateNotificationStatusMutation();

    const notifications = data?.notifications || [];

    useEffect(() => {
        if (isSuccess) {
            refetch();
        }
    }, [isSuccess, refetch]);

    const handleRead = async (id: string) => {
        await updateStatus(id);
    };

    if (isLoading) return <Loader />;

    return (
        <div className="w-full mt-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <PiBellRingingFill className="text-amber-500" />
                Latest Replies & Notifications
            </h2>
            <div className="space-y-3">
                {notifications.length === 0 ? (
                    <div className="bg-white dark:bg-[#111C43] rounded-xl p-8 text-center shadow-md text-gray-500 dark:text-gray-400">
                        No new notifications.
                    </div>
                ) : (
                    notifications.map((item: any) => (
                        <div 
                            key={item._id} 
                            className={`bg-white dark:bg-[#111C43] rounded-xl p-4 shadow-sm border-l-4 transition-all ${
                                item.status === 'unread' ? 'border-amber-500 bg-amber-50/10' : 'border-gray-300 dark:border-gray-600'
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-full ${item.status === 'unread' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                                    <PiEnvelopeSimpleOpenFill size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`text-sm font-bold ${item.status === 'unread' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {item.title}
                                        </h3>
                                        <span className="text-[10px] text-gray-400">
                                            {format(item.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {item.message}
                                    </p>
                                    {item.status === 'unread' && (
                                        <button 
                                            onClick={() => handleRead(item._id)}
                                            className="text-amber-600 dark:text-amber-400 text-xs mt-2 hover:underline"
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentNotifications;
