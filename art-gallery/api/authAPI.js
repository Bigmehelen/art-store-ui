import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearAuth, setError, clearError } from './authSlice';

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/user/auth",
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
        url: "/register",
        method: "POST",
        body: userData,
        headers: {
          "Content-Type": "application/json"
        },
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
        headers: {
          "Content-Type": "application/json"
        },
      }),
    }),
    becomeArtist: builder.mutation({
      query: () => ({
        url: "/become-artist",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    getUser: builder.query({
      query: () => "/me",
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useBecomeArtistMutation, useLogoutMutation, useGetUserQuery } = authApi;

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const [registerMutation, registerResult] = useRegisterMutation();
  const [loginMutation, loginResult] = useLoginMutation();
  const [logoutMutation, logoutResult] = useLogoutMutation();

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    token: auth.token,
    error: auth.error,
    loading: registerResult.isLoading || loginResult.isLoading || logoutResult.isLoading,
    register: async (userData) => {
      try {
        const result = await registerMutation(userData).unwrap();
        dispatch(setUser(result));
        return result;
      } catch (error) {
        dispatch(setError(error.data?.message || 'Registration failed'));
        throw error;
      }
    },
    login: async (credentials) => {
      try {
        const result = await loginMutation(credentials).unwrap();
        dispatch(setUser(result));
        return result;
      } catch (error) {
        dispatch(setError(error.data?.message || 'Login failed'));
        throw error;
      }
    },
    logout: async () => {
      try {
        await logoutMutation().unwrap();
        dispatch(clearAuth());
      } catch (error) {
        dispatch(setError(error.data?.message || 'Logout failed'));
      }
    },
    clearError: () => dispatch(clearError())
  };
};
