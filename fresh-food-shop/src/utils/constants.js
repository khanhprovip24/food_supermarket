// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register/',
    LOGIN: '/auth/login/',
    LOGOUT: '/auth/logout/',
    ME: '/auth/me/',
    PROFILE: '/auth/profile/',
  },

  // Products
  PRODUCTS: {
    LIST: '/products/',
    DETAIL: (id) => `/products/${id}/`,
    REVIEWS: (id) => `/products/${id}/reviews/`,
    ADD_REVIEW: (id) => `/products/${id}/add_review/`,
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories/',
    DETAIL: (id) => `/categories/${id}/`,
  },

  // Cart
  CART: {
    LIST: '/cart/',
    ADD: '/cart/add/',
    REMOVE: '/cart/remove/',
    UPDATE: '/cart/update/',
    CLEAR: '/cart/clear/',
  },

  // Orders
  ORDERS: {
    LIST: '/orders/',
    CREATE: '/orders/create/',
    CREATE_FROM_CART: '/orders/create_from_cart/',
    DETAIL: (id) => `/orders/${id}/`,
    UPDATE: (id) => `/orders/${id}/`,
    CANCEL: (id) => `/orders/${id}/cancel/`,
  },

  // Wishlist
  WISHLIST: {
    LIST: '/wishlist/',
    ADD: '/wishlist/add/',
    REMOVE: '/wishlist/remove/',
  },

  // Admin
  ADMIN: {
    STATS: '/admin/stats/',
    PRODUCTS: '/admin/products/',
    ORDERS: '/admin/orders/',
    USERS: '/admin/users/',
  },
};

// Categories list (for filter)
export const CATEGORIES = [
  { id: 1, name: 'Thịt', slug: 'meat' },
  { id: 2, name: 'Rau Củ', slug: 'vegetables' },
  { id: 3, name: 'Hải Sản', slug: 'seafood' },
  { id: 4, name: 'Trái Cây', slug: 'fruits' },
  { id: 5, name: 'Sữa & Trứng', slug: 'dairy' },
  { id: 6, name: 'Bánh & Thực Phẩm Khô', slug: 'bakery' },
];

// Product status
export const PRODUCT_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
};

// Pagination
export const PAGINATION = {
  PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
};

// Sort options
export const SORT_OPTIONS = [
  { value: 'name', label: 'Tên (A-Z)' },
  { value: '-name', label: 'Tên (Z-A)' },
  { value: 'price', label: 'Giá (Thấp - Cao)' },
  { value: '-price', label: 'Giá (Cao - Thấp)' },
  { value: '-created_at', label: 'Mới nhất' },
];

// Image placeholder
export const IMAGE_PLACEHOLDER = '/images/placeholder-product.jpg';

// Base URL for media
export const MEDIA_BASE_URL = 'http://localhost:8000';
