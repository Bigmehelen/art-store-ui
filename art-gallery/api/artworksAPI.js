import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const artworksApi = createApi({
  reducerPath: "artworksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://helenartstore.onrender.com",
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
  }),
});

export const { usePlaceOrderMutation } = artworksApi;

export const usePlaceOrder = () => {
  const [placeOrderMutation, { isLoading }] = usePlaceOrderMutation();

  return {
    placeOrder: placeOrderMutation,
    loading: isLoading
  };
};
