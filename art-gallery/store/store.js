import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../api/authSlice.js';
import cartReducer from '../api/cartSlice.js';
import artworksReducer from '../api/artworksSlice.js';
import { authApi } from "../api/authAPI.js";
import { artworksApi } from '../api/artworksAPI.js';
import { publicArtworksApi } from '../api/publicArtworksAPI.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    artworks: artworksReducer,
    [authApi.reducerPath]: authApi.reducer,
    [artworksApi.reducerPath]: artworksApi.reducer,
    [publicArtworksApi.reducerPath]: publicArtworksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, artworksApi.middleware, publicArtworksApi.middleware),
});

setupListeners(store.dispatch);