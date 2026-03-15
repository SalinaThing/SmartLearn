"use client"

import React from "react";
import { useSelector } from "react-redux"
import { redirect } from "next/navigation";

interface ProtectedProps{
    children: React.ReactNode;
}

export default function TeacherProtected({children}: ProtectedProps){
    const {user} = useSelector((state:any) => state.auth);

    if (user) {
        const isTeacher = user?.role === "teacher";
    return isTeacher ? children: redirect("/")
    }
}