import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./useUser";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function TeacherProtected({ children }: ProtectedProps) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const role = user?.role?.toLowerCase();
  const isTeacher = role === "teacher";
  return isTeacher ? <>{children}</> : <Navigate to="/" replace />;
}
