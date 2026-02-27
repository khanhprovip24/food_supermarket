import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const wishlistService = {
  /**
   * Lấy danh sách yêu thích của user
   * @returns {Promise}
   */
  getWishlist: async () => {
    try {
      console.log('Fetching wishlist...');
      const response = await api.get(API_ENDPOINTS.WISHLIST.LIST);
      console.log('Wishlist loaded:', response.data);
      
      // Handle paginated response or direct array
      let items = response.data.items || [];
      if (Array.isArray(response.data)) {
        items = response.data;
      } else if (response.data && response.data.results) {
        items = response.data.results;
      }
      
      return {
        success: true,
        data: items,
      };
    } catch (error) {
      console.error('Error fetching wishlist:', error.response?.status, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
        data: null,
      };
    }
  },

  /**
   * Thêm sản phẩm vào danh sách yêu thích
   * @param {number} productId
   * @returns {Promise}
   */
  addToWishlist: async (productId) => {
    try {
      console.log('Adding to wishlist:', productId);
      const response = await api.post(API_ENDPOINTS.WISHLIST.ADD, {
        product_id: productId,
      });
      console.log('Added to wishlist:', response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error adding to wishlist:', error.response?.status, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      };
    }
  },

  /**
   * Xóa sản phẩm khỏi danh sách yêu thích
   * @param {number} productId
   * @returns {Promise}
   */
  removeFromWishlist: async (productId) => {
    try {
      console.log('Removing from wishlist:', productId);
      const response = await api.delete(API_ENDPOINTS.WISHLIST.REMOVE, {
        data: { product_id: productId },
      });
      console.log('Removed from wishlist:', response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error removing from wishlist:', error.response?.status, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        data: null,
      };
    }
  },

  /**
   * Kiểm tra sản phẩm có trong wishlist không
   * @param {number} productId
   * @param {Array} wishlistItems
   * @returns {boolean}
   */
  isInWishlist: (productId, wishlistItems) => {
    if (!wishlistItems || !Array.isArray(wishlistItems)) return false;
    return wishlistItems.some(item => item.product?.id === productId);
  },
};

export default wishlistService;
