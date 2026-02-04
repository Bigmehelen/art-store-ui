import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authApi = createApi({
  reducerPath: "authApi",
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
    register: builder.mutation({
      query: (userData) => ({
        url: "/api/auth/register",
        method: "POST",
        body: userData,
        headers: {
          "Content-Type": "application/json"
        },
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
        headers: {
          "Content-Type": "application/json"
        },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
    }),
    getUser: builder.query({
      query: () => "/api/auth/me",
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation, useGetUserQuery } = authApi;
