import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../auth/authSlice";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl:
            import.meta.env.VITE_API_URL || "http://localhost:7000/api/v1",
        credentials: "include",
    }),
    tagTypes: ["Layout", "Notifications"],
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
                      console.log(error);
                      dispatch(userLoggedOut());
                }
            },
        })
    }),
});

export const {useRefreshTokenQuery, useLoadUserQuery} = apiSlice;
