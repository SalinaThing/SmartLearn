import { apiSlice } from "../api/apiSlice";

export const resultApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createResult: builder.mutation({
            query: (data) => ({
                url: "create-result",
                method: "POST",
                body: data,
            }),
        }),
        getResults: builder.query({
            query: (courseId) => ({
                url: `get-results?courseId=${courseId}`,
                method: "GET",
            }),
        }),
        getAllResults: builder.query({
            query: () => ({
                url: "get-all-results",
                method: "GET",
            }),
        }),
    }),
});

export const {
    useCreateResultMutation,
    useGetResultsQuery,
    useGetAllResultsQuery,
} = resultApi;
