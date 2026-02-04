import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../api/authSlice.js';
import cartReducer from '../api/cartSlice.js';
import artworksReducer from '../api/artworksSlice.js';
import { authApi } from "../api/authAPI.js";
import { artworksApi } from '../api/artworksAPI.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    artworks: artworksReducer,
    [authApi.reducerPath]: authApi.reducer,
    [artworksApi.reducerPath]: artworksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, artworksApi.middleware),
});

setupListeners(store.dispatch);