import "./globals.css";
import React, { useEffect } from "react";
import { ThemeProvider } from "./utils/ThemeProvider";
import { Toaster } from "react-hot-toast";
import Providers from "./Provider";
import { SessionProvider } from "./auth/session";
import Loader from "./components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { io } from "socket.io-client";
import { Outlet } from "react-router-dom";

const ENDPOINT = import.meta.env.VITE_SOCKET_SERVER_URI || "";

const socketId = io(ENDPOINT, {
  transports: ["websocket"],
});

function Custom({ children }: { children: React.ReactNode }) {
  const { isLoading } = useLoadUserQuery(undefined);
  useEffect(() => {
    socketId.on("connection", () => {});
  }, []);
  return <>{isLoading ? <Loader /> : children}</>;
}

export default function RootShell() {
  return (
    <Providers>
      <SessionProvider>
        <ThemeProvider>
          <Custom>
            <Outlet />
          </Custom>
          <Toaster position="top-center" reverseOrder={false} />
        </ThemeProvider>
      </SessionProvider>
    </Providers>
  );
}
