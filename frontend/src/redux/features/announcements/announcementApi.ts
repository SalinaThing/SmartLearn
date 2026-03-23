import { apiSlice } from "../api/apiSlice";

export const announcementApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createAnnouncement: builder.mutation({
            query: (data) => ({
                url: "create-announcement",
                method: "POST",
                body: data,
            }),
        }),
        getAnnouncementsByCourse: builder.query({
            query: (courseId) => ({
                url: `get-announcements/${courseId}`,
                method: "GET",
            }),
        }),
        deleteAnnouncement: builder.mutation({
            query: (id) => ({
                url: `delete-announcement/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useCreateAnnouncementMutation,
    useGetAnnouncementsByCourseQuery,
    useDeleteAnnouncementMutation,
} = announcementApi;
