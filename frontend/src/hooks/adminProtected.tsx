import { useUser } from "./useUser";
import { Navigate } from "react-router-dom";
import React from "react";

interface Props {
    children: React.ReactNode;
}

export default function AdminProtected({ children }: Props) {
    const { user, isLoading } = useUser();

    if (isLoading) {
        return null;
    }

    const isAdmin = user?.role?.toLowerCase() === "admin";

    return isAdmin ? <>{children}</> : <Navigate to="/" />;
}
