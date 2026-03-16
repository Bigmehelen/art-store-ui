import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const publicArtworksApi = createApi({
    reducerPath: "publicArtworksApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://helenartstore.onrender.com/api/v1/artworks",
    }),
    endpoints: (builder) => ({
        getAllArtworks: builder.query({
            query: () => "/all",
            method: "POST",
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
