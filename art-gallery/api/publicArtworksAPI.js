import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const publicArtworksApi = createApi({
    reducerPath: "publicArtworksApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080",
    }),
    endpoints: (builder) => ({
        getAllArtworks: builder.query({
            query: () => "/api/v1/artworks/all",
        }),
        getArtworkById: builder.query({
            query: (id) => `/api/v1/artworks/${id}`,
        }),
        searchArtworksByName: builder.query({
            query: (name) => `/api/v1/artworks/search?name=${encodeURIComponent(name)}`,
        }),
    }),
});

export const {
    useGetAllArtworksQuery,
    useGetArtworkByIdQuery,
    useLazySearchArtworksByNameQuery,
} = publicArtworksApi;
