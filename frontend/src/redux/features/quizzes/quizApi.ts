import { apiSlice } from "../api/apiSlice";

export const quizApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createQuiz: builder.mutation({
            query: (data) => ({
                url: "create-quiz",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
            invalidatesTags: ["Quizzes"],
        }),
        getQuizzesByCourse: builder.query({
            query: (courseId) => ({
                url: `get-quizzes/${courseId}`,
                method: "GET",
                credentials: "include" as const,
            }),
            providesTags: ["Quizzes"]
        }),
        updateQuiz: builder.mutation({
            query: ({ id, data }) => ({
                url: `update-quiz/${id}`,
                method: "PUT",
                body: data,
                credentials: "include" as const,
            }),
            invalidatesTags: ["Quizzes"],
        }),
        deleteQuiz: builder.mutation({
            query: (id) => ({
                url: `delete-quiz/${id}`,
                method: "DELETE",
                credentials: "include" as const,
            }),
            invalidatesTags: ["Quizzes"],
        }),
    }),
});

export const {
    useCreateQuizMutation,
    useGetQuizzesByCourseQuery,
    useUpdateQuizMutation,
    useDeleteQuizMutation,
} = quizApi;
