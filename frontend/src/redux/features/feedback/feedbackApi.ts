import { apiSlice } from "../api/apiSlice";

export const feedbackApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        submitFeedback: builder.mutation({
            query: (data) => ({
                url: "submit-feedback",
                method: "POST",
                body: data,
            }),
        }),
        getAllFeedback: builder.query({
            query: () => ({
                url: "get-all-feedback",
                method: "GET",
            }),
        }),
    }),
});

export const {
    useSubmitFeedbackMutation,
    useGetAllFeedbackQuery,
} = feedbackApi;
