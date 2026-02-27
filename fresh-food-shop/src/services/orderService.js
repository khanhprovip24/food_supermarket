import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const orderService = {
  /**
   * Lấy danh sách đơn hàng của user
   * @returns {Promise}
   */
  getOrders: async () => {
    try {
      console.log('Fetching orders...');
      const response = await api.get(API_ENDPOINTS.ORDERS.LIST);
      console.log('Raw API response:', response);
      console.log('Orders loaded:', response.data);
      
      // Handle paginated response or direct array
      let ordersData = response.data;
      if (response.data && response.data.results) {
        ordersData = response.data.results;
      } else if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        // If it's a single object but not a list, wrap it
        console.warn('Response is not a list, wrapping in array:', response.data);
        ordersData = [response.data];
      }
      
      console.log('Processed orders data:', ordersData);
      
      return {
        success: true,
        data: ordersData,
      };
    } catch (error) {
      console.error('Error fetching orders:', error.response?.status, error.response?.data || error.message);
      console.error('Full error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
        data: null,
      };
    }
  },

  /**
   * Lấy chi tiết một đơn hàng
   * @param {number} orderId
   * @returns {Promise}
   */
  getOrderDetail: async (orderId) => {
    try {
      console.log(`Fetching order ${orderId}...`);
      const response = await api.get(`${API_ENDPOINTS.ORDERS.LIST}${orderId}/`);
      console.log('Order detail loaded:', response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error fetching order:', error.response?.status, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
        data: null,
      };
    }
  },

  /**
   * Tạo đơn hàng từ giỏ hàng
   * @param {string} shippingAddress - Địa chỉ giao hàng
   * @param {string} paymentMethod - Phương thức thanh toán
   * @param {string} discountCode - Mã giảm giá (tùy chọn)
   * @returns {Promise}
   */
  createOrder: async (shippingAddress, paymentMethod, discountCode = null) => {
    try {
      console.log('Creating order from cart...');
      const payload = {
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
      };

      // Thêm discount code nếu có
      if (discountCode) {
        payload.discount_code = discountCode;
      }

      const response = await api.post(API_ENDPOINTS.ORDERS.CREATE_FROM_CART, payload);
      console.log('Order created:', response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating order:', error.response?.status, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
        data: null,
      };
    }
  },

  /**
   * Hủy đơn hàng
   * @param {number} orderId
   * @returns {Promise}
   */
  cancelOrder: async (orderId) => {
    try {
      console.log(`Cancelling order ${orderId}...`);
      const response = await api.patch(`${API_ENDPOINTS.ORDERS.LIST}${orderId}/`, {
        status: 'cancelled',
      });
      console.log('Order cancelled:', response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error cancelling order:', error.response?.status, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },
};

export default orderService;
