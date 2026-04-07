import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../auth/authSlice";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl:
            import.meta.env.VITE_API_URL || "http://localhost:7000/api/v1",
        credentials: "include",
    }),
    tagTypes: ["Layout", "Notifications", "Results", "User"],
    endpoints: (builder) => ({
        refreshToken: builder.query({
            query: (data) => ({
                url: "refresh",
                method: "POST",
                credentials: "include" as const,
            }),
        }),

        loadUser: builder.query({
            query: (data) => ({
                url: "me",
                method: "GET",
                credentials: "include" as const,
            }),
            providesTags: ["User"],

            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userLoggedIn({
                          accessToken: result.data.accessToken,
                          user: result.data.user,
                        })
                    );
                } catch (error) {
                      // log error but don't force logout on every fetch failure as it may clear tokens during navigations
                      console.log("loadUser error:", error);
                }
            },
        })
    }),
});

export const {useRefreshTokenQuery, useLoadUserQuery} = apiSlice;
