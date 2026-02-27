import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const productService = {
  /**
   * Lấy danh sách danh mục sản phẩm
   * @returns {Promise}
   */
  getCategories: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CATEGORIES.LIST);
      return {
        success: true,
        data: response.data.results || response.data,
        count: response.data.count || response.data.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
        data: [],
      };
    }
  },

  /**
   * Lấy chi tiết một danh mục
   * @param {number} categoryId
   * @returns {Promise}
   */
  getCategory: async (categoryId) => {
    try {
      const response = await api.get(API_ENDPOINTS.CATEGORIES.DETAIL(categoryId));
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Lấy danh sách sản phẩm với filter
   * @param {Object} filters - {category, search, status, page, ordering}
   * @returns {Promise}
   */
  getProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.status !== undefined) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page);
      if (filters.ordering) params.append('ordering', filters.ordering);

      const response = await api.get(
        `${API_ENDPOINTS.PRODUCTS.LIST}?${params.toString()}`
      );

      return {
        success: true,
        data: response.data.results || response.data,
        count: response.data.count || response.data.length,
        next: response.data.next,
        previous: response.data.previous,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
        data: [],
      };
    }
  },

  /**
   * Lấy chi tiết một sản phẩm
   * @param {number} productId
   * @returns {Promise}
   */
  getProductDetail: async (productId) => {
    try {
      console.log(`Fetching product detail for ID: ${productId}`);
      const response = await api.get(API_ENDPOINTS.PRODUCTS.DETAIL(productId));
      console.log(`Product detail loaded:`, response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(`Error fetching product detail:`, error.response?.status, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Tìm kiếm sản phẩm
   * @param {string} query - Từ khóa tìm kiếm
   * @returns {Promise}
   */
  searchProducts: async (query) => {
    try {
      const response = await api.get(
        `${API_ENDPOINTS.PRODUCTS.LIST}?search=${encodeURIComponent(query)}`
      );
      return {
        success: true,
        data: response.data.results || response.data,
        count: response.data.count || response.data.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
        data: [],
      };
    }
  },

  /**
   * Lấy danh sách đánh giá của sản phẩm
   * @param {number} productId
   * @returns {Promise}
   */
  getReviews: async (productId) => {
    try {
      console.log(`Fetching reviews for product ID: ${productId}`);
      const response = await api.get(API_ENDPOINTS.PRODUCTS.REVIEWS(productId));
      console.log(`Reviews loaded:`, response.data);
      return {
        success: true,
        data: response.data.reviews || [],
        count: response.data.count || 0,
      };
    } catch (error) {
      console.error(`Error fetching reviews:`, error.response?.status, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
        data: [],
      };
    }
  },

  /**
   * Thêm đánh giá cho sản phẩm
   * @param {number} productId
   * @param {Object} reviewData - {rating, comment}
   * @returns {Promise}
   */
  addReview: async (productId, reviewData) => {
    try {
      console.log(`Submitting review for product ${productId}:`, reviewData);
      const response = await api.post(
        API_ENDPOINTS.PRODUCTS.ADD_REVIEW(productId),
        reviewData
      );
      console.log(`Review submitted successfully:`, response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(`Error submitting review:`, error.response?.status, error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  },

  /**
   * Format image URL - xử lí null images
   * @param {string} imagePath - Path từ database
   * @returns {string} Full image URL hoặc placeholder SVG
   */
  getImageUrl: (imagePath) => {
    // If no image, return SVG placeholder
    if (!imagePath) {
      console.warn('No image path provided');
      return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23e5e7eb" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="18" font-family="Arial"%3ENo Image%3C/text%3E%3C/svg%3E';
    }
    
    // If already a full URL, return as-is
    if (imagePath.startsWith('http')) {
      console.log('Image is already full URL:', imagePath);
      return imagePath;
    }
    
    // Convert to full backend media URL
    // Handle various path formats:
    // - products/image.jpg (Django upload_to format)
    // - categories/image.jpg (Django upload_to format)
    // - Thịt/image.jpg (Custom folder structure)
    // - just filename.jpg
    const mediaUrl = `http://localhost:8000/media/${imagePath}`;
    console.log('Generated image URL:', mediaUrl, 'From original path:', imagePath);
    return mediaUrl;
  },
};

export default productService;
