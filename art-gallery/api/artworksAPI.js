import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const artworksApi = createApi({
  reducerPath: "artworksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:2000",
    prepareHeaders: async (headers) => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllArtworks: builder.query({
      query: () => "/api/artworks",
    }),
    getArtworkById: builder.query({
      query: (id) => `/api/artworks/${id}`,
    }),
    placeOrder: builder.mutation({
      query: (orderData) => ({
        url: "/api/orders",
        method: "POST",
        body: orderData,
        headers: {
          "Content-Type": "application/json"
        },
      }),
    }),
  }),
});

export const { useGetAllArtworksQuery, useGetArtworkByIdQuery, usePlaceOrderMutation } = artworksApi;
