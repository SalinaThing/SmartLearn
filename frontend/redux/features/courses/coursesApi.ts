"use client"

import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query:(data) => ({
                url: "create-course",
                method:"POST",
                body:data,
                credentials: "include" as const,

            })
        }),

        getAllCourses: builder.query({
            query:() => ({
                url: "get-teacher-courses",
                method:"GET",
                credentials: "include" as const,
            })
        }),

        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `delete-course/${id}`,
                method:"DELETE",
                credentials: "include" as const,
            })
        }),
        editCourse: builder.mutation({
            query: ({id, data}) => ({
                url: `edit-course/${id}`,
                method:"PUT",
                body:data,
                credentials: "include" as const,
            })
        }),
        getAllCoursesByUser: builder.query({
            query:() => ({
                url: "get-all-course",
                method:"GET",
                credentials: "include" as const,
            })
        }),

        getCourseDetails: builder.query({
            query:(id) => ({
                url: `get-course-by-user/${id}`,
                method:"GET",
                credentials: "include" as const,
            })
        }),

        getCourseContents: builder.query({
            query:(id) => ({
                url: `get-course-content/${id}`,
                method:"GET",
                credentials: "include" as const,
            })
        }),

        addNewQuestion: builder.mutation({
            query: ({question, courseId, contentId}) => ({
                url: `add-question`,
                method:"PUT",
                body:{question, courseId, contentId },
                credentials: "include" as const,
            })
        }),

        addAnswerToQuestion: builder.mutation({
            query: ({answer, questionId, courseId, contentId}) => ({
                url: `add-answer`,
                method:"PUT",
                body:{answer, questionId, courseId, contentId },
                credentials: "include" as const,
            })
        }),

        addReviewInCourse: builder.mutation({
            query: ({review, rating, courseId}) => ({
                url: `add-review/${courseId}`,
                method:"PUT",
                body:{review, rating },
                credentials: "include" as const,
            }) 
        }),

        addReplyInReview: builder.mutation({
            query: ({reviewId, comment, courseId}) => ({
                url: `add-reply-to-review`,
                method:"PUT",
                body:{reviewId, comment, courseId },
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
} = courseApi;