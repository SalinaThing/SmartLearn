import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/auth/session";
import { useUser } from "./useUser";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading, isAuthenticated } = useUser();
  const { data: sessionData, status: sessionStatus } = useSession();
  
  const hasNextAuthSession = Boolean(sessionData?.user);
  const isSessionLoading = sessionStatus === "loading";
  const isAuthed = isAuthenticated || hasNextAuthSession;

  useEffect(() => {
    if (!isUserLoading && !isSessionLoading && !isAuthed) {
      navigate("/", { replace: true });
    }
  }, [isAuthed, isUserLoading, isSessionLoading, navigate]);

  if (isUserLoading || isSessionLoading || !isAuthed) return null;
  return <>{children}</>;
}
