import { apiSlice } from "../api/apiSlice";

export const layoutApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getHeroData: builder.query({
            query: (type) => ({
                url: `get-layout/${type}`,
                method: "GET",
                credentials: "include" as const,
            })
        }),
        editLayout: builder.mutation({
            query: ({image, type, title, subTitle, faqs, categories}) => ({
                url: `edit-layout`,
                method: "PUT",
                credentials: "include" as const,
                body: {image, type, title, subTitle, faqs, categories}
            })
        }),

    })
});

export const { 
    useGetHeroDataQuery,
    useEditLayoutMutation,
} = layoutApi;