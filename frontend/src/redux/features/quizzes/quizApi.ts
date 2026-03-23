import { apiSlice } from "../api/apiSlice";

export const quizApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createQuiz: builder.mutation({
            query: (data) => ({
                url: "create-quiz",
                method: "POST",
                body: data,
            }),
        }),
        getQuizzesByCourse: builder.query({
            query: (courseId) => ({
                url: `get-quizzes/${courseId}`,
                method: "GET",
            }),
        }),
        updateQuiz: builder.mutation({
            query: ({ id, data }) => ({
                url: `update-quiz/${id}`,
                method: "PUT",
                body: data,
            }),
        }),
        deleteQuiz: builder.mutation({
            query: (id) => ({
                url: `delete-quiz/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useCreateQuizMutation,
    useGetQuizzesByCourseQuery,
    useUpdateQuizMutation,
    useDeleteQuizMutation,
} = quizApi;
