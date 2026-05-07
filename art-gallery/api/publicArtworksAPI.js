import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const publicArtworksApi = createApi({
    reducerPath: "publicArtworksApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/artworks`,
    }),
    endpoints: (builder) => ({
        getAllArtworks: builder.query({
            query: () => "/all",
        }),
        getArtworkById: builder.query({
            query: (id) => `/${id}`,
        }),
        searchArtworksByName: builder.query({
            query: (name) => `/search?name=${encodeURIComponent(name)}`,
        }),
    }),
});

export const {
    useGetAllArtworksQuery,
    useGetArtworkByIdQuery,
    useLazySearchArtworksByNameQuery,
} = publicArtworksApi;
