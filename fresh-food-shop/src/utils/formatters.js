/**
 * Format price to Vietnamese currency (VND)
 * @param {number} price - Price value
 * @returns {string} Formatted price (e.g., "31.168,19 đ")
 */
export const formatPrice = (price) => {
  if (!price && price !== 0) return "0 đ";
  
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(Math.round(price));
};

/**
 * Format currency with Intl API - Vietnamese format
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "0 đ";
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

/**
 * Format number for Vietnamese locale
 * @param {number} number - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (number, decimals = 0) => {
  if (!number && number !== 0) return "0";
  
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

/**
 * Format date to Vietnamese format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date (e.g., "01/03/2026, 10:30:45")
 */
export const formatDate = (date) => {
  if (!date) return "—";
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(dateObj);
};

/**
 * Format date only (no time)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date (e.g., "01/03/2026")
 */
export const formatDateOnly = (date) => {
  if (!date) return "—";
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
  }).format(dateObj);
};
