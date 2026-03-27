import { apiSlice } from "../api/apiSlice";

export const resultApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createResult: builder.mutation({
            query: (data) => ({
                url: "create-result",
                method: "POST",
                body: data,
                credentials: "include" as const,
            }),
            invalidatesTags: ["Results"],
        }),
        getResults: builder.query({
            query: (courseId) => ({
                url: `get-results?courseId=${courseId}`,
                method: "GET",
                credentials: "include" as const,
            }),
            providesTags: ["Results"],
        }),
        getAllResults: builder.query({
            query: () => ({
                url: "get-all-results",
                method: "GET",
                credentials: "include" as const,
            }),
            providesTags: ["Results"],
        }),
    }),
});

export const {
    useCreateResultMutation,
    useGetResultsQuery,
    useGetAllResultsQuery,
} = resultApi;
