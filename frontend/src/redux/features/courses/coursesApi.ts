"use client"

import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: (data) => ({
                url: "create-course",
                method: "POST",
                body: data,
                credentials: "include" as const,

            })
        }),

        getAllCourses: builder.query({
            query: () => ({
                url: "get-teacher-courses",
                method: "GET",
                credentials: "include" as const,
            })
        }),

        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `delete-course/${id}`,
                method: "DELETE",
                credentials: "include" as const,
            })
        }),
        editCourse: builder.mutation({
            query: ({ id, data }) => ({
                url: `edit-course/${id}`,
                method: "PUT",
                body: data,
                credentials: "include" as const,
            })
        }),
        getAllCoursesByUser: builder.query({
            query: (params) => {
                let queryStr = "";
                if (params) {
                    const searchParams = new URLSearchParams();
                    Object.keys(params).forEach((key) => {
                        if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
                            searchParams.append(key, params[key]);
                        }
                    });
                    const qs = searchParams.toString();
                    if (qs) queryStr = `?${qs}`;
                }
                return {
                    url: `get-all-course${queryStr}`,
                    method: "GET",
                    credentials: "include" as const,
                };
            }
        }),

        getCourseDetails: builder.query({
            query: (id) => ({
                url: `get-single-course/${id}`,
                method: "GET",
                credentials: "include" as const,
            })
        }),

        getCourseContents: builder.query({
            query: (id) => ({
                url: `get-course-by-user/${id}`,
                method: "GET",
                credentials: "include" as const,
            })
        }),

        addNewQuestion: builder.mutation({
            query: ({ question, courseId, contentId }) => ({
                url: `add-question`,
                method: "PUT",
                body: { question, courseId, contentId },
                credentials: "include" as const,
            })
        }),

        addAnswerToQuestion: builder.mutation({
            query: ({ answer, questionId, courseId, contentId }) => ({
                url: `add-answer`,
                method: "PUT",
                body: { answer, questionId, courseId, contentId },
                credentials: "include" as const,
            })
        }),

        addReviewInCourse: builder.mutation({
            query: ({ review, rating, courseId }) => ({
                url: `add-review/${courseId}`,
                method: "PUT",
                body: { review, rating },
                credentials: "include" as const,
            })
        }),

        addReplyInReview: builder.mutation({
            query: ({ reviewId, comment, courseId }) => ({
                url: `add-reply-to-review`,
                method: "PUT",
                body: { reviewId, comment, courseId },
                credentials: "include" as const,
            })
        }),

        uploadVideo: builder.mutation({
            query: (formData: FormData) => ({
                url: `upload-video`,
                method: "POST",
                body: formData,
                credentials: "include" as const,
            })
        }),

        uploadPdf: builder.mutation({
            query: (formData: FormData) => ({
                url: `upload-pdf`,
                method: "POST",
                body: formData,
                credentials: "include" as const,
            })
        }),
        getQuestionsByUser: builder.query({
            query: () => ({
                url: `get-questions-by-user`,
                method: "GET",
                credentials: "include" as const,
            })
        }),
        getReviewsByUser: builder.query({
            query: () => ({
                url: `get-reviews-by-user`,
                method: "GET",
                credentials: "include" as const,
            })
        }),
        editReview: builder.mutation({
            query: ({ rating, review, courseId, reviewId }) => ({
                url: `edit-review`,
                method: "PUT",
                body: { rating, review, courseId, reviewId },
                credentials: "include" as const,
            })
        }),
        editQuestion: builder.mutation({
            query: ({ question, courseId, contentId, questionId }) => ({
                url: `edit-question`,
                method: "PUT",
                body: { question, courseId, contentId, questionId },
                credentials: "include" as const,
            })
        }),
        updateCourseProgress: builder.mutation({
            query: ({ courseId, contentId }) => ({
                url: `update-course-progress`,
                method: "POST",
                body: { courseId, contentId },
                credentials: "include" as const,
            })
        }),
        logCourseView: builder.mutation({
            query: ({ courseId }) => ({
                url: `log-course-view`,
                method: "POST",
                body: { courseId },
                credentials: "include" as const,
            })
        }),
        logSearchQuery: builder.mutation({
            query: ({ keyword }) => ({
                url: `log-search-query`,
                method: "POST",
                body: { keyword },
                credentials: "include" as const,
            })
        }),
        getSuggestedCourses: builder.query({
            query: () => ({
                url: `get-suggested-courses`,
                method: "GET",
                credentials: "include" as const,
            })
        }),
    })
})

export const {
    useCreateCourseMutation,
    useGetAllCoursesQuery,
    useDeleteCourseMutation,
    useEditCourseMutation,
    useGetAllCoursesByUserQuery,
    useGetCourseDetailsQuery,
    useGetCourseContentsQuery,
    useAddNewQuestionMutation,
    useAddAnswerToQuestionMutation,
    useAddReviewInCourseMutation,
    useAddReplyInReviewMutation,
    useUploadVideoMutation,
    useUploadPdfMutation,
    useGetQuestionsByUserQuery,
    useGetReviewsByUserQuery,
    useEditReviewMutation,
    useEditQuestionMutation,
    useUpdateCourseProgressMutation,
    useLogCourseViewMutation,
    useLogSearchQueryMutation,
    useGetSuggestedCoursesQuery,
} = courseApi;
