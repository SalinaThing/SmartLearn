import { apiSlice } from "../api/apiSlice";

export const feedbackApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        submitFeedback: builder.mutation({
            query: (data) => ({
                url: "submit-feedback",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
        }),
        getAllFeedback: builder.query({
            query: () => ({
                url: "get-all-feedback",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        getStudentFeedback: builder.query({
            query: () => ({
                url: "get-student-feedback",
                method: "GET",
                credentials: "include" as const,
            }),
        }),
        updateFeedback: builder.mutation({
            query: ({ id, rating, comment }) => ({
                url: `update-feedback/${id}`,
                method: "PUT",
                body: { rating, comment },
                credentials: "include" as const,
            }),
        }),
        deleteFeedback: builder.mutation({
            query: (id) => ({
                url: `delete-feedback/${id}`,
                method: "DELETE",
                credentials: "include" as const,
            }),
        }),
    }),
});

export const {
    useSubmitFeedbackMutation,
    useGetAllFeedbackQuery,
    useGetStudentFeedbackQuery,
    useUpdateFeedbackMutation,
    useDeleteFeedbackMutation,
} = feedbackApi;
