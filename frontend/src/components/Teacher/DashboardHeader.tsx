import { ThemeSwitcher } from "@/utils/ThemeSwitcher";
import { useGetAllNotificationsQuery, useUpdateNotificationStatusMutation } from "@/redux/features/notifications/notificationApi";
import { format } from "timeago.js";
import React, { FC, useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useUser } from "@/hooks/useUser";
import { io } from "socket.io-client";

const ENDPOINT = import.meta.env.VITE_SOCKET_SERVER_URI || "";
const socketId = io(ENDPOINT, {
    transports: ["websocket"],
});

type Props = {
    open?: boolean;
    setOpen?: any;
    hideNotifications?: boolean;
};

const DashboardHeader: FC<Props> = ({ open: propOpen, setOpen: propSetOpen, hideNotifications }) => {
    const { user } = useUser();
    const { data, refetch } = useGetAllNotificationsQuery(undefined, { refetchOnMountOrArgChange: true })
    const [updateNotification, { isSuccess }] = useUpdateNotificationStatusMutation();
    const [notifications, setNotifications] = useState<any>([]);

    // Internal state for notification modal
    const [notifOpen, setNotifOpen] = useState(false);

    const handleToggleNotif = () => {
        setNotifOpen(!notifOpen);
    };

    const handleToggleSidebar = () => {
        if (propSetOpen) {
            propSetOpen(!propOpen);
        }
    };

    const [audio] = useState(
        new Audio("/notification.mp3")
    );
    const playerNotificationSound = () => {
        audio.play().catch((err) => {
            console.log("Notification sound could not be played:", err);
        });
    }

    useEffect(() => {
        if (data) {
            setNotifications(
                data.notifications.filter((item: any) => item.status === "unread")
            );
        }
    }, [data]);

    useEffect(() => {
        if (isSuccess) {
            refetch();
        }
    }, [isSuccess]);

    useEffect(() => {
        audio.load();
    }, [audio]);

    useEffect(() => {
        if (user) {
            socketId.emit("join", { userId: user._id, role: user.role });
        }
    }, [user]);

    useEffect(() => {
        socketId.on("newNotification", (data) => {
            refetch();
            playerNotificationSound();
        });

        return () => {
            socketId.off("newNotification");
        };
    }, [refetch]);

    const handleNotificationStatusChange = async (id: string) => {
        await updateNotification(id);
    }

    return (
        <div className="w-full h-[80px] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-[100] bg-white dark:bg-[#0f172a] shadow-sm border-b border-gray-100 dark:border-gray-800 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80 transition-all duration-300">
            {/* Mobile Sidebar Toggle */}
            <div
                className="800px:hidden cursor-pointer dark:text-white text-black text-2xl"
                onClick={handleToggleSidebar}
            >
                <HiOutlineMenuAlt3 />
            </div>

            <div className="flex items-center ml-auto">
                <ThemeSwitcher />

                {!hideNotifications && (
                    <>
                        <div
                            className="relative cursor-pointer m-2"
                            onClick={handleToggleNotif}
                        >
                            <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
                            <span className="absolute -top-2 -right-2 bg-[#3ccbae] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
                                {notifications && notifications.length}
                            </span>
                        </div>

                        {notifOpen && (
                            <div className="w-[350px] min-h-[100px] max-h-[50vh] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 right-0 z-[9999] rounded overflow-y-auto">
                                <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
                                    Notifications
                                </h5>
                                {
                                    notifications && notifications.length > 0 ? (
                                    notifications.map((item: any, index: number) => (
                                        <div key={index} className="dark:bg-[#2d3a4ea1] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f]">
                                            <div className="w-full flex items-center justify-between p-2">
                                                <p className="text-black dark:text-white font-medium">
                                                    {item.title}
                                                </p>
                                                <p className="text-[#39c1f3] text-sm cursor-pointer hover:underline"
                                                    onClick={() => handleNotificationStatusChange(item._id)}
                                                >
                                                    Mark read
                                                </p>
                                            </div>
                                            <p className="px-2 text-sm text-gray-400">
                                                {item.message}
                                            </p>
                                            <p className="p-2 text-gray-500 text-[12px]">
                                                {format(item.createdAt)}
                                            </p>
                                        </div>
                                    ))
                                    ) : (
                                        <p className="text-center p-4 text-gray-500">No new notifications</p>
                                    )
                                }
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>

    );
};

export default DashboardHeader;
