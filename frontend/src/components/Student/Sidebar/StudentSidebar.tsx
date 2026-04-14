import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {
    HomeOutlinedIcon,
    ArrowForwardIosIcon,
    ArrowBackIosIcon,
    PeopleOutlinedIcon,
    ReceiptOutlinedIcon,
    BarChartOutlinedIcon,
    MapOutlinedIcon,
    GroupsIcon,
    OndemandVideoIcon,
    WebIcon,
    WysiwygIcon,
    ManageHistoryIcon,
    SettingsIcon,
    ExitToAppIcon,
    FeedbackIcon,
    NotificationsIcon,
} from "../../Teacher/Sidebar/Icon";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import Image from "@/utils/Image";
import { useTheme } from "@/utils/ThemeProvider";
import { useLogoutUserMutation } from "@/redux/features/auth/authApi";
import { signOut } from "@/auth/oauth";
import { FC, useEffect, useState } from "react";
import { JSX } from "@emotion/react/jsx-runtime";
import { Box, IconButton, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const avatarDefault = "/assets/heroicon3.jpg";

interface itemProps {
    title: string;
    to: string;
    icon: JSX.Element;
    selected: string;
    setSelected: any;
    setOpen?: any;
    isLightMode: boolean;
}

const Item: FC<itemProps> = ({ title, to, icon, selected, setSelected, setOpen, isLightMode }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        setSelected(title);
        if (setOpen) setOpen(false); // Close drawer on mobile
        navigate(to);
    };

    return (
        <MenuItem
            active={selected === title}
            onClick={handleClick}
            icon={icon}
            style={{
                color: selected === title
                    ? "#6870fa"
                    : isLightMode ? "#000" : "#ffffffa6",
            }}
        >
            <Typography className="!text-[16px] !font-Poppins">
                {title}
            </Typography>
        </MenuItem>
    );
};

type Props = {
    activeItem?: number;
    open?: boolean;
    setOpen?: any;
    isCollapsed?: boolean;
    setIsCollapsed?: any;
}

const StudentSidebar: FC<Props> = ({ activeItem, open, setOpen, isCollapsed, setIsCollapsed }) => {
    const { user } = useUser();
    const [logoutUser] = useLogoutUserMutation();
    const navigate = useNavigate();
    const [selected, setSelected] = useState("Dashboard");
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (activeItem === 1) setSelected("Dashboard");
        if (activeItem === 2) setSelected("My Enrolled Courses");
        if (activeItem === 14) setSelected("My Quizzes");
        if (activeItem === 26) setSelected("My Feedback");
    }, [activeItem]);

    if (!mounted) return null;

    const logoutHandler = async () => {
        const roleString = "Student";
        try {
            await logoutUser({}).unwrap();
            toast.success(`Logout with ${roleString} successfully`);
        } catch (err) {
            console.error("Logout Error:", err);
        } finally {
            signOut({ redirect: false }).then(() => {
                navigate("/");
            });
        }
    };

    const isLightMode = theme === "light";

    return (
        <>
            <style>
                {`
                    .pro-sidebar .pro-sidebar-inner {
                        background-color: ${isLightMode ? "#ffffff !important" : "#111C43 !important"};
                    }
                    .pro-sidebar .pro-sidebar-layout {
                        background-color: ${isLightMode ? "#ffffff !important" : "#111C43 !important"};
                    }
                    .pro-sidebar {
                        background-color: ${isLightMode ? "#ffffff !important" : "#111C43 !important"};
                    }
                    .pro-menu-item {
                        color: ${isLightMode ? "#000 !important" : "#ffffffa6 !important"};
                    }
                    .pro-menu-item.active {
                        color: #6870fa !important;
                    }
                `}
            </style>

            {/* Mobile Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] 800px:hidden transition-opacity duration-300"
                    onClick={() => setOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 z-[1000] h-screen transition-all duration-300 ease-in-out shadow-xl ${open ? "left-0" : "-left-[250px]"
                    } 800px:left-0 ${isCollapsed ? "w-[80px]" : "w-[250px]"} overflow-y-auto overflow-x-hidden custom-scrollbar`}
                style={{
                    backgroundColor: isLightMode ? "#ffffff" : "#111C43", // Explicit wrapper override
                }}
            >
                <div className="h-full flex flex-col">
                    <ProSidebar
                        collapsed={isCollapsed}
                        style={{
                            height: "100vh",
                            width: "100%",
                            background: isLightMode ? "#fff" : "#111C43",
                        }}
                    >
                        <Menu iconShape="square">
                            <MenuItem
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                icon={isCollapsed ? <ArrowForwardIosIcon style={{ color: isLightMode ? "#000" : "#fff" }} /> : undefined}
                                style={{ margin: "10px 0 20px 0" }}
                            >
                                {!isCollapsed && (
                                    <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                                        <Link to="/">
                                            <h3 className="text-[25px] font-Poppins uppercase font-bold tracking-tight" style={{ color: isLightMode ? "#000" : "#fff" }}>
                                                SmartLearn
                                            </h3>
                                        </Link>
                                        <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                            <ArrowBackIosIcon style={{ color: isLightMode ? "#000" : "#fff", fontSize: "18px" }} />
                                        </IconButton>
                                    </Box>
                                )}
                            </MenuItem>

                            {!isCollapsed && (
                                <Box mb="25px" className="flex flex-col items-center">
                                    <Link to="/profile" className="mb-4">
                                        <Image
                                            alt="profile-user"
                                            width={100}
                                            height={100}
                                            src={user?.avatar ? user.avatar.url : avatarDefault}
                                            className="cursor-pointer rounded-full border-4 border-[#5b6fe6] shadow-lg object-cover"
                                        />
                                    </Link>
                                    <div className="text-center px-4">
                                        <h4 className="text-[18px] font-semibold mb-1 truncate max-w-[180px]" style={{ color: isLightMode ? "#000" : "#fff" }}>
                                            {user?.name}
                                        </h4>
                                        <p className="text-[14px] font-medium tracking-wide" style={{ color: isLightMode ? "#4b5563" : "#d1d5db" }}>
                                            Student Portal
                                        </p>
                                    </div>
                                </Box>
                            )}

                            <Box
                                paddingLeft={isCollapsed ? undefined : "5%"}
                                sx={{
                                    "& .pro-inner-item": {
                                        padding: "5px 35px 5px 20px !important",
                                        color: isLightMode ? "#000 !important" : "#ffffffa6 !important",
                                    },
                                    "& .pro-inner-item:hover": {
                                        color: "#868dfb !important",
                                        backgroundColor: "transparent !important",
                                    },
                                    "& .pro-menu-item.active": {
                                        color: "#6870fa !important",
                                    },
                                    "& .pro-icon-wrapper": {
                                        color: isLightMode ? "#000 !important" : "#fff !important",
                                        backgroundColor: "transparent !important"
                                    }
                                }}
                            >
                                <Item title="Return to Home" to="/" icon={<HomeOutlinedIcon />} selected={selected} setSelected={setSelected} setOpen={setOpen} isLightMode={isLightMode} />
                                <Item title="Dashboard" to="/student/dashboard" icon={<WebIcon />} selected={selected} setSelected={setSelected} setOpen={setOpen} isLightMode={isLightMode} />

                                {!isCollapsed && (
                                    <p className="text-[15px] font-Poppins px-6 py-2 mt-4 font-[600]" style={{ color: isLightMode ? "#000" : "#9ca3af" }}>
                                        Learning
                                    </p>
                                )}
                                <Item title="Enrolled Courses" to="/student/courses" icon={<OndemandVideoIcon />} selected={selected} setSelected={setSelected} setOpen={setOpen} isLightMode={isLightMode} />
                                <Item title="Notifications" to="/notifications" icon={<NotificationsIcon />} selected={selected} setSelected={setSelected} setOpen={setOpen} isLightMode={isLightMode} />

                                {!isCollapsed && (
                                    <p className="text-[15px] font-Poppins px-6 py-2 mt-4 font-[600]" style={{ color: isLightMode ? "#000" : "#9ca3af" }}>
                                        Community
                                    </p>
                                )}
                                <Item title="FeedBack" to="/student/feedback" icon={<FeedbackIcon />} selected={selected} setSelected={setSelected} setOpen={setOpen} isLightMode={isLightMode} />

                                {!isCollapsed && (
                                    <p className="text-[15px] font-Poppins px-6 py-2 mt-4 font-[600]" style={{ color: isLightMode ? "#000" : "#9ca3af" }}>
                                        Extras
                                    </p>
                                )}
                                <MenuItem
                                    icon={<ExitToAppIcon style={{ color: isLightMode ? "#000" : "#fff" }} />}
                                    onClick={logoutHandler}
                                    style={{
                                        marginTop: "10px",
                                        marginBottom: "40px"
                                    }}
                                >
                                    <Typography className="!text-[16px] !font-Poppins">
                                        Logout
                                    </Typography>
                                </MenuItem>
                            </Box>
                        </Menu>
                    </ProSidebar>
                </div>
            </div>
        </>
    )
}

export default StudentSidebar;
