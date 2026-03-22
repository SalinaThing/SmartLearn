"use client"

import './globals.css'
import React, { useMemo } from 'react'
import { ThemeProvider } from './utils/ThemeProvider'
import { Toaster } from 'react-hot-toast'
import Providers from './Provider'
import {SessionProvider} from 'next-auth/react'
import Loader from './components/Loader/Loader'
import { useSelector } from "react-redux";

import { apiSlice } from '@/redux/features/api/apiSlice'

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
  const selectLoadUser = useMemo(
    () => apiSlice.endpoints.loadUser.select(undefined),
    []
  );
  const loadUserState = useSelector(selectLoadUser);
  const isLoading = Boolean(loadUserState?.isLoading);

  return(
    <>
      {
        isLoading ? <Loader/> : <>{children}</>
      }
    </>
  )
}