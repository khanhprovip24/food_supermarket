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
        discount_code: discountCode || '',  // Always include, even if empty
      };

      console.log('Order payload:', payload);
      const response = await api.post(API_ENDPOINTS.ORDERS.CREATE_FROM_CART, payload);
      console.log('Order created:', response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error creating order:', error.response?.status, error.response?.data || error.message);
      
      // Better error message handling
      let errorMessage = 'Có lỗi xảy ra khi tạo đơn hàng';
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.errors) {
          errorMessage = JSON.stringify(error.response.data.errors);
        }
      }
      
      return {
        success: false,
        error: errorMessage,
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
      const response = await api.post(`${API_ENDPOINTS.ORDERS.LIST}${orderId}/cancel/`);
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

  /**
   * Xác thực mã giảm giá
   * @param {string} discountCode - Mã giảm giá
   * @param {number} totalAmount - Tổng tiền (để tính toán số tiền giảm)
   * @returns {Promise}
   */
  validateDiscount: async (discountCode, totalAmount = 0) => {
    try {
      if (!discountCode.trim()) {
        return {
          success: false,
          message: 'Vui lòng nhập mã giảm giá',
          discount: null,
        };
      }

      console.log('Validating discount code:', discountCode);
      const payload = {
        discount_code: discountCode.trim(),
        total_amount: totalAmount,
      };

      const response = await api.post(API_ENDPOINTS.ORDERS.VALIDATE_DISCOUNT, payload);
      console.log('Discount validation result:', response.data);
      
      return {
        success: response.data.success,
        message: response.data.message,
        discount: response.data.discount || null,
      };
    } catch (error) {
      console.error('Error validating discount:', error.response?.status, error.response?.data || error.message);
      
      // Better error message handling
      let errorMessage = 'Lỗi kiểm tra mã giảm giá';
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        }
      }
      
      return {
        success: false,
        message: errorMessage,
        discount: null,
      };
    }
  },
};

export default orderService;

