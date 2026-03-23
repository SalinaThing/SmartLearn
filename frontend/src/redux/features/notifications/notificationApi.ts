import { apiSlice } from "../api/apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllNotifications: builder.query({
            query: (type) => ({
                url: `get-all-notifications`,
                method: "GET",
                credentials: "include" as const,
            }),
            providesTags: ["Notifications"],
        }),

        updateNotificationStatus: builder.mutation({
            query: (id) => ({
                url: `/update-notification-status/${id}`,
                method: "PUT",
                credentials: "include" as const,
            }),
            invalidatesTags: ["Notifications"],
        }),

    })
});

export const { 
    useGetAllNotificationsQuery,
    useUpdateNotificationStatusMutation,
} = notificationApi;
