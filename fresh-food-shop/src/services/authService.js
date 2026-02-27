import api from './api';

const authService = {
  /**
   * Đăng ký tài khoản mới
   * @param {Object} userData - {username, email, password, password2, first_name, last_name, phone, address}
   * @returns {Promise} - Trả về user data nếu thành công
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData);
      if (response.data.success && response.data.user) {
        // Lưu user info vào localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        errors: error.response?.data?.errors || { detail: error.message }
      };
    }
  },

  /**
   * Đăng nhập
   * @param {Object} credentials - {username, password}
   * @returns {Promise} - Trả về user data nếu thành công
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login/', credentials);
      if (response.data.success) {
        // Lưu user info vào localStorage
        const userData = response.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        // Session được tự động lưu trong cookies (withCredentials: true)
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        errors: error.response?.data?.errors || { detail: error.message }
      };
    }
  },

  /**
   * Đăng xuất
   * @returns {Promise}
   */
  logout: async () => {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Xóa thông tin user từ localStorage
      localStorage.removeItem('user');
      // Session cookie sẽ được xóa bởi server
    }
  },

  /**
   * Lấy thông tin profile người dùng hiện tại
   * @returns {Promise}
   */
  getProfile: async () => {
    try {
      const response = await api.get('/auth/me/');
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        errors: error.response?.data?.errors || { detail: error.message }
      };
    }
  },

  /**
   * Cập nhật profille người dùng
   * @param {Object} userData - Dữ liệu cần cập nhật
   * @returns {Promise}
   */
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile/', userData);
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      return {
        success: false,
        errors: error.response?.data?.errors || { detail: error.message }
      };
    }
  },

  /**
   * Kiểm tra xem người dùng đã đăng nhập chưa
   * @returns {Boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  },

  /**
   * Lấy user hiện tại từ localStorage
   * @returns {Object|null}
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;
