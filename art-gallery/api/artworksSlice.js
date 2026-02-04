import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedArtwork: null,
  order: null,
  error: null
};

const artworksSlice = createSlice({
  name: 'artworks',
  initialState,
  reducers: {
    setSelectedArtwork: (state, action) => {
      state.selectedArtwork = action.payload;
    },
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setSelectedArtwork, setOrder, clearError, setError } = artworksSlice.actions;
export default artworksSlice.reducer;
