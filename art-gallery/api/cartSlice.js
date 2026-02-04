import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalPrice: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const artwork = action.payload;
      const existingItem = state.items.find(item => item.id === artwork.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...artwork, quantity: 1 });
      }

      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    removeFromCart: (state, action) => {
      const artworkId = action.payload;
      state.items = state.items.filter(item => item.id !== artworkId);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
        }
      }
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
