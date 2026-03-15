"use-cleint"

import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCoursesAnaltyics: builder.query({
            query: () => ({
                url: `get-course-analytics`,
                method: "GET",
                credentials: "include" as const,
            })
        }),

        getUsersAnaltyics: builder.query({
            query: () => ({
                url: `get-user-analytics`,
                method: "GET",
                credentials: "include" as const,
            })
        }),

        getOrdersAnaltyics: builder.query({
            query: () => ({
                url: `get-order-analytics`,
                method: "GET",
                credentials: "include" as const,
            })
        }),

    })
});

export const { 
    useGetCoursesAnaltyicsQuery,
    useGetOrdersAnaltyicsQuery,
    useGetUsersAnaltyicsQuery,
    
} = analyticsApi;