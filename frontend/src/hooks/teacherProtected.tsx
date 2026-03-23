import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function TeacherProtected({ children }: ProtectedProps) {
  const { user } = useSelector((state: any) => state.auth);

  if (!user) {
    return null;
  }
  const isTeacher = user?.role === "teacher";
  return isTeacher ? <>{children}</> : <Navigate to="/" replace />;
}
