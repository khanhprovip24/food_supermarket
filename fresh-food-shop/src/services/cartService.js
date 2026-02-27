import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const cartService = {
  getCart: async () => {
    try {
      console.log('Fetching cart...');
      const response = await api.get(API_ENDPOINTS.CART.LIST);
      console.log('Cart loaded:', response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching cart:');
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Message:', error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || error.message,
        data: null,
      };
    }
  },

  /**
   * Thêm sản phẩm vào giỏ hàng
   * @param {number} productId
   * @param {number} quantity
   * @returns {Promise}
   */
  addToCart: async (productId, quantity = 1) => {
    try {
      console.log(`Adding product ${productId} quantity ${quantity} to cart`);
      const payload = {
        product_id: productId,
        quantity: quantity,
      };
      console.log('Request payload:', JSON.stringify(payload));
      const response = await api.post(API_ENDPOINTS.CART.ADD, payload);
      console.log('Product added to cart:', response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error adding to cart:');
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Full Error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || error.message,
      };
    }
  },

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   * @param {number} productId
   * @returns {Promise}
   */
  removeFromCart: async (productId) => {
    try {
      console.log(`Removing product ${productId} from cart`);
      const response = await api.post(API_ENDPOINTS.CART.REMOVE, {
        product_id: productId,
      });
      console.log('Product removed from cart:', response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error removing from cart:', error.response?.status, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Xóa toàn bộ giỏ hàng
   * @returns {Promise}
   */
  clearCart: async () => {
    try {
      console.log('Clearing cart...');
      const response = await api.post(API_ENDPOINTS.CART.CLEAR);
      console.log('Cart cleared:', response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error clearing cart:', error.response?.status, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },
};

export default cartService;
