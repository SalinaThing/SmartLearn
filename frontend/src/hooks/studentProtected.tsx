import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./useUser";
import Loader from "../components/Loader/Loader";

interface Props {
    children: React.ReactNode;
}

const StudentProtected = ({ children }: Props) => {
    const { user, isAuthenticated, isLoading } = useUser();

    if (isLoading) {
        return <Loader />;
    }

    if (!user || !isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Students, Teachers, and Admins can view the student dashboard for testing/management
    const isAllowed = user.role === "student" || user.role === "teacher" || user.role === "admin";

    return isAllowed ? <>{children}</> : <Navigate to="/" replace />;
};

export default StudentProtected;
