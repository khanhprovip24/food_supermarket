import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import wishlistService from "../services/wishlistService";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load wishlist from server when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated, user]);

  const loadWishlist = async () => {
    setLoading(true);
    const result = await wishlistService.getWishlist();
    if (result.success) {
      console.log('Wishlist loaded:', result.data);
      setWishlistItems(result.data || []);
      setError(null);
    } else {
      console.error("Failed to load wishlist:", result.error);
      setError(result.error);
    }
    setLoading(false);
  };

  const addToWishlist = async (productId) => {
    try {
      if (!isAuthenticated) {
        setError('Bạn cần đăng nhập để thêm vào danh sách yêu thích');
        return { success: false, error: 'Not authenticated' };
      }

      const result = await wishlistService.addToWishlist(productId);
      if (result.success) {
        // Reload wishlist to get latest data
        await loadWishlist();
        setError(null);
        return { success: true };
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      console.error('Error in addToWishlist:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const result = await wishlistService.removeFromWishlist(productId);
      if (result.success) {
        // Reload wishlist to get latest data
        await loadWishlist();
        setError(null);
        return { success: true };
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      console.error('Error in removeFromWishlist:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const isInWishlist = (productId) => {
    return wishlistService.isInWishlist(productId, wishlistItems);
  };

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return removeFromWishlist(productId);
    } else {
      return addToWishlist(productId);
    }
  };

  const value = {
    wishlistItems,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    loadWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export default WishlistContext;
