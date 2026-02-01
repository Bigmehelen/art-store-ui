import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const AllArtworkApi = createApi({
  reducerPath: "allArtworkApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    allArtworksApi: builder.query({
      query: () => "",
    }),
  }),
});
export const {useAllArtworksApiQuery} = AllArtworkApi;