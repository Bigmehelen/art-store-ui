import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const publicArtworksApi = createApi({
    reducerPath: "publicArtworksApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:2000",
    }),
    endpoints: (builder) => ({
        getAllArtworks: builder.query({
            query: () => "/api/v1/artwork/find-all",
        }),
        getArtworkById: builder.query({
            query: (id) => `/api/artworks/${id}`,
        }),
    }),
});

export const { useGetAllArtworksQuery, useGetArtworkByIdQuery } = publicArtworksApi;

export const useArtworks = () => {
    const { data: artworks = [], isLoading: artworksLoading, error: artworksError } = useGetAllArtworksQuery();

    return {
        artworks,
        loading: artworksLoading,
        error: artworksError,
        refetch: useGetAllArtworksQuery
    };
};

export const useArtwork = (id) => {
    const { data: artwork, isLoading, error } = useGetArtworkByIdQuery(id);

    return {
        artwork,
        loading: isLoading,
        error
    };
};
