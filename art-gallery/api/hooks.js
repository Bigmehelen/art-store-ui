import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation, useLoginMutation, useLogoutMutation, useGetUserQuery } from './authAPI';
import { useGetAllArtworksQuery, useGetArtworkByIdQuery, usePlaceOrderMutation } from './artworksAPI';
import { addToCart, removeFromCart, updateQuantity, clearCart } from './cartSlice';
import { setUser, clearAuth, setError, clearError } from './authSlice';

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

export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);

  return {
    ...cart,
    addToCart: (artwork) => dispatch(addToCart(artwork)),
    removeFromCart: (artworkId) => dispatch(removeFromCart(artworkId)),
    updateQuantity: (id, quantity) => dispatch(updateQuantity({ id, quantity })),
    clearCart: () => dispatch(clearCart())
  };
};

export const useArtworks = () => {
  const { data: artworks = [], isLoading: artworksLoading, error: artworksError } = useGetAllArtworksQuery();
  
  return {
    artworks,
    loading: artworksLoading,
    error: artworksError,
    refetch: useGetAllArtworksQuery
  };
};

export const useArtwork = (id) => {
  const { data: artwork, isLoading, error } = useGetArtworkByIdQuery(id);
  
  return {
    artwork,
    loading: isLoading,
    error
  };
};

export const usePlaceOrder = () => {
  const [placeOrderMutation, { isLoading }] = usePlaceOrderMutation();
  
  return {
    placeOrder: placeOrderMutation,
    loading: isLoading
  };
};
