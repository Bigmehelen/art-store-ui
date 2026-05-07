import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const artworksApi = createApi({
  reducerPath: "artworksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}`,
    prepareHeaders: async (headers) => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
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
    createArtwork: builder.mutation({
      query: (artworkData) => ({
        url: "/api/v1/artworks",
        method: "POST",
        body: artworkData,
      }),
    }),
    getMyArtworks: builder.query({
      query: () => "/api/v1/artworks/my-artworks",
    }),
    getMyOrders: builder.query({
      query: () => "/api/orders/my-orders",
    }),
  }),
});

export const { 
  usePlaceOrderMutation, 
  useCreateArtworkMutation, 
  useGetMyArtworksQuery,
  useGetMyOrdersQuery 
} = artworksApi;

export const usePlaceOrder = () => {
  const [placeOrderMutation, { isLoading }] = usePlaceOrderMutation();

  return {
    placeOrder: placeOrderMutation,
    loading: isLoading
  };
};
