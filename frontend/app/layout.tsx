"use client"

import './globals.css'
import React, { useEffect, useMemo } from 'react'
import { ThemeProvider } from './utils/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import Providers from './Provider'
import {SessionProvider} from 'next-auth/react'
import Loader from './components/Loader/Loader'
import { useSelector } from "react-redux";
import { apiSlice, useLoadUserQuery } from '@/redux/features/api/apiSlice'

import { io } from "socket.io-client";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "";

const socketId = io(ENDPOINT, {
  transports: ["websocket"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300"
      >
        <Providers>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Custom>
                {children}
              </Custom>
            <Toaster position="top-center" reverseOrder={false} />
          </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  )
}

const Custom: React.FC <{children: React.ReactNode}> = ({children}) => {
  const {isLoading} = useLoadUserQuery({});
  useEffect(() => {
    socketId.on("connection", () => {});
  }, [])
  return(
    <>
      {
        isLoading ? <Loader/> : <>{children}</>
      }
    </>
  )
}