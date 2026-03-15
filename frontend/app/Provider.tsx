"use client"

import {store} from "../redux/store";
import React,{ ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { apiSlice } from "../redux/features/api/apiSlice";


interface ProviderProps {
    children?: ReactNode;
}

export default function Providers({ children }: ProviderProps) {
    useEffect(() => {
        void store.dispatch(
            apiSlice.endpoints.refreshToken.initiate(undefined, { forceRefetch: true })
        );
        void store.dispatch(
            apiSlice.endpoints.loadUser.initiate(undefined, { forceRefetch: true })
        );
    }, []);

    return (
        <>
            <Provider store={store}>
                {children}
            </Provider>
        </>
    )
}