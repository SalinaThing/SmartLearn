

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
    VideoCallIcon,
    WebIcon,
    QuizIcon,
    WysiwygIcon,
    ManageHistoryIcon,
    SettingsIcon,
    ExitToAppIcon,
    FeedbackIcon,
} from "./Icon";
import { useUser } from "@/hooks/useUser";
import Image from "@/utils/Image";
import { useTheme } from "@/utils/ThemeProvider";
import { useLogoutUserQuery } from "@/redux/features/auth/authApi";
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
}

const Item: FC<itemProps> = ({ title, to, icon, selected, setSelected }) => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        setSelected(title);
        navigate(to);
    };

    return (
        <MenuItem
            active={selected === title}
            onClick={handleClick}
            icon={icon}
        >
            <Typography className="!text-[16px] !font-Poppins">
                {title}
            </Typography>
        </MenuItem>
    );
};

type Props = {
    activeItem?: number;
}

const Sidebar: FC<Props> = ({ activeItem }) => {
    const { user } = useUser();
    const [logoutUser, setLogoutUser] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");
    const isAdmin = user?.role?.toLowerCase() === "admin";
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    const { isSuccess, error } = useLogoutUserQuery(undefined, {
        skip: !logoutUser ? true : false,
    });

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (activeItem === 14) setSelected("Quizzes");
        if (activeItem === 15) setSelected("Announcements");
        // Add more mappings if needed
    }, [activeItem]);

    useEffect(() => {
        if (isSuccess) {
            signOut({ redirect: false }).then(() => {
                window.location.href = "/";
            });
        }
    }, [isSuccess]);

    if (!mounted) {
        return null;
    }

    const logoutHandler = () => {
        setLogoutUser(true);
    };

    return (
        <Box
            sx={{
                "& .pro-sidebar-inner": {
                    background: `${theme === "dark" ? "#111C43 !important" : "#fff !important"
                        }`,
                },

                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important",
                },

                "& .pro-inner-item:hover": {
                    color: "#868dfb !important",
                },

                "& .pro-menu-item.active": {
                    color: "#6870fa !important",
                },

                "& .pro-inner-item": {
                    padding: "5px 35px 5px 20px !important",
                    opacity: 1,
                },

                "& .pro-menu-item": {
                    color: `${theme !== "dark" && "#000"}`,
                },
            }}
            className="!bg-white dark:bg-[#111C43]"
        >
            <ProSidebar
                collapsed={isCollapsed}
                style={{
                    height: "100vh",
                    width: isCollapsed ? "0" : "100%",
                    zIndex: 9999,
                }}
            >
                <Menu iconShape="square">
                    {/* LOGO AND MENU ICON */}

                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
                        style={{
                            margin: "10px 0 20px 0",
                        }}
                    >
                        {!isCollapsed && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="15px"
                            >
                                <Link to="/">
                                    <h3 className="text-[25px] font-Poppins uppercase dark:text-white text-black">
                                        SmartLearn
                                    </h3>
                                </Link>

                                <IconButton
                                    onClick={() => setIsCollapsed(!isCollapsed)}
                                    className="inline-block"
                                >
                                    <ArrowBackIosIcon className="text-black dark:text-[#ffffffc1]" />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {!isCollapsed && (
                        <>
                            <Box mb="25px">
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <Link to="/profile">
                                        <Image
                                            alt="profile-user"
                                            width={100}
                                            height={100}
                                            src={user?.avatar ? user.avatar.url : avatarDefault}
                                            style={{
                                                cursor: "pointer",
                                                borderRadius: "50%",
                                                border: "3px solid #5b6fe6",
                                            }} />
                                    </Link>
                                </Box>

                                <Box textAlign="center">
                                    <Typography
                                        variant="h4"
                                        className="!text-[20px] text-black dark:text-[#ffffffc1]"
                                        sx={{ m: "10px 0 0 0" }}
                                    >
                                        {user?.name}
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        className="!text-[20px] text-black dark:text-[#ffffffc1] capitalize"
                                        sx={{ m: "10px 0 0 0" }}
                                    >
                                        - {user?.role}
                                    </Typography>
                                </Box>
                            </Box>
                        </>
                    )}

                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        <Item
                            title="Return to Home"
                            to="/"
                            icon={<HomeOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title="Dashboard"
                            to="/teacher"
                            icon={<OndemandVideoIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Typography
                            variant="h5"
                            className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
                            sx={{ m: "15px 0 5px 25px" }}
                        >
                            {!isCollapsed && "Data"}
                        </Typography>

                        {/* Invoices */}
                        <Item
                            title="Users"
                            to="/teacher/all-users"
                            icon={<GroupsIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title="Invoices"
                            to="/teacher/invoices"
                            icon={<ReceiptOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Typography
                            variant="h5"
                            className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
                            sx={{ m: "15px 0 5px 25px" }}
                        >
                            {!isCollapsed && "Content"}
                        </Typography>

                        {/* Courses */}
                        <Item
                            title="Create Courses"
                            to="/teacher/create-course"
                            icon={<VideoCallIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title="Live Courses"
                            to="/teacher/allcourses"
                            icon={<OndemandVideoIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Typography
                            variant="h5"
                            className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
                            sx={{ m: "15px 0 5px 25px" }}
                        >
                            {!isCollapsed && "Customization"}
                        </Typography>

                        <Item
                            title="Quizzes"
                            to="/teacher/quizzes"
                            icon={<QuizIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title="Announcements"
                            to="/teacher/announcements"
                            icon={<WysiwygIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title="FeedBack"
                            to="/teacher/feedback"
                            icon={<FeedbackIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title="Faq"
                            to="/teacher/faq"
                            icon={<FeedbackIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title="Categories"
                            to="/teacher/categories"
                            icon={<WysiwygIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Typography
                            variant="h5"
                            className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            {!isCollapsed && "Controllers"}
                        </Typography>

                        <Item
                            title="Manage Team"
                            to="/teacher/team"
                            icon={<PeopleOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Typography
                            variant="h6"
                            className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            {!isCollapsed && "Analytics"}
                        </Typography>

                        <Item
                            title="Course Analytics"
                            to="/teacher/course-analytics"
                            icon={<BarChartOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title="Orders Analytics"
                            to="/teacher/order-analytics"
                            icon={<MapOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title="Users Analytics"
                            to="/teacher/user-analytics"
                            icon={<ManageHistoryIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Typography
                            variant="h5"
                            className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            {!isCollapsed && "Extras"}
                        </Typography>

                        <div onClick={logoutHandler}>
                            <Item
                                title="LogoutUser"
                                to="/"
                                icon={<ExitToAppIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                        </div>
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    )
}

export default Sidebar;
