import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import userAuth from "./userAuth";
import { useSelector } from "react-redux";
import { apiSlice } from "@/redux/features/api/apiSlice";
import { useSession } from "@/auth/session";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
  const isAuthenticated = userAuth();
  const navigate = useNavigate();
  const { data, status } = useSession();
  const hasNextAuthSession = Boolean(data?.user);
  const isSessionLoading = status === "loading";
  const selectLoadUser = useMemo(
    () => apiSlice.endpoints.loadUser.select(undefined),
    []
  );
  const loadUserState = useSelector(selectLoadUser);
  const isLoading = Boolean(loadUserState?.isLoading);
  const isAuthed = isAuthenticated || hasNextAuthSession;

  useEffect(() => {
    if (!isLoading && !isSessionLoading && !isAuthed) {
      navigate("/", { replace: true });
    }
  }, [isAuthed, isLoading, isSessionLoading, navigate]);

  if (isLoading || isSessionLoading || !isAuthed) return null;
  return <>{children}</>;
}
