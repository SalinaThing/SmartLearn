import { apiSlice } from "../api/apiSlice";

export const announcementApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createAnnouncement: builder.mutation({
            query: (data) => ({
                url: "create-announcement",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Announcements"],
        }),
        getAnnouncementsByCourse: builder.query({
            query: (courseId) => ({
                url: `get-announcements/${courseId}`,
                method: "GET",
            }),
            providesTags: ["Announcements"],
        }),
        updateAnnouncement: builder.mutation({
            query: ({ id, data }) => ({
                url: `update-announcement/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Announcements"],
        }),
        deleteAnnouncement: builder.mutation({
            query: (id) => ({
                url: `delete-announcement/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Announcements"],
        }),
    }),
});

export const {
    useCreateAnnouncementMutation,
    useGetAnnouncementsByCourseQuery,
    useUpdateAnnouncementMutation,
    useDeleteAnnouncementMutation,
} = announcementApi;
