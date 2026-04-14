import React, { FC, useEffect } from "react";
import { format } from "timeago.js";
import { useGetAllNotificationsQuery, useUpdateNotificationStatusMutation } from "@/redux/features/notifications/notificationApi";
import Loader from "../../Loader/Loader";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Props = {
    isDashboard?: boolean;
};

const AllNotifications: FC<Props> = ({ isDashboard }) => {
    const { data, refetch, isLoading } = useGetAllNotificationsQuery(undefined, { refetchOnMountOrArgChange: true });
    const [updateNotification, { isSuccess, error }] = useUpdateNotificationStatusMutation();
    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success("Notification marked as read");
        }
        if (error) {
            const err = error as any;
            toast.error(err?.data?.message || "Something went wrong");
        }
    }, [isSuccess, error, refetch]);

    const handleStatusChange = async (id: string) => {
        await updateNotification(id);
    };

    const handleNotificationClick = async (item: any) => {
        if (item.status === "unread") {
            await updateNotification(item._id);
        }
        if (item.path) {
            navigate(item.path);
        }
    };

    return (
        <div className={`w-full ${!isDashboard ? "p-4" : ""}`}>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full">
                    <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white mb-6">
                        Notifications
                    </h1>
                    <div className="grid grid-cols-1 gap-4">
                        {data?.notifications?.length === 0 ? (
                            <p className="text-center text-gray-500 mt-10">No notifications yet</p>
                        ) : (
                            data?.notifications?.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    onClick={() => handleNotificationClick(item)}
                                    className={`p-4 rounded-lg shadow-sm border cursor-pointer group ${item.status === "unread"
                                            ? "bg-blue-50 dark:bg-[#111C43] border-blue-200 dark:border-blue-800"
                                            : "bg-white dark:bg-slate-800 border-gray-100 dark:border-gray-700"
                                        } hover:shadow-md transition-all duration-300`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h5 className={`text-[18px] font-Poppins font-[500] ${item.status === "unread" ? "text-[#39c1f3] dark:text-[#39c1f3]" : "text-black dark:text-white"}`}>
                                            {item.title}
                                        </h5>
                                        {item.status === "unread" && (
                                            <button
                                                onClick={() => handleStatusChange(item._id)}
                                                className="text-[12px] bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                                            >
                                                Mark read
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 font-Poppins text-[15px] mb-3">
                                        {item.message}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[12px] text-gray-500">
                                            {format(item.createdAt)}
                                        </span>
                                        <span className={`text-[11px] uppercase px-2 py-0.5 rounded ${item.status === "unread" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllNotifications;
