/**
 * Admin data layer - localStorage cho sản phẩm, đơn hàng, danh mục, người dùng.
 * Seed từ mockProducts nếu chưa có dữ liệu.
 */

import mockProducts from "./mockProducts";

const KEY_PRODUCTS = "fresh_admin_products";
const KEY_ORDERS = "fresh_admin_orders";
const KEY_CATEGORIES = "fresh_admin_categories";
const KEY_USERS = "fresh_admin_users";

const ORDER_STATUSES = [
  "Chờ xác nhận",
  "Đang xử lý",
  "Đang giao hàng",
  "Hoàn thành",
  "Yêu cầu hủy",
  "Đã hủy",
];

const LOW_STOCK_THRESHOLD = 10;

function seedProducts() {
  const seeded = mockProducts.map((p) => ({
    ...p,
    stock: typeof p.stock === "number" ? p.stock : 50,
    status: p.status === "active" || p.status === "inactive" ? p.status : "active",
  }));
  localStorage.setItem(KEY_PRODUCTS, JSON.stringify(seeded));
  return seeded;
}

export function getProducts() {
  try {
    const raw = localStorage.getItem(KEY_PRODUCTS);
    if (!raw) return seedProducts();
    return JSON.parse(raw);
  } catch {
    return seedProducts();
  }
}

export function saveProducts(products) {
  localStorage.setItem(KEY_PRODUCTS, JSON.stringify(products));
  return products;
}

export function getOrders() {
  try {
    const raw = localStorage.getItem(KEY_ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(KEY_ORDERS, JSON.stringify(orders));
  return orders;
}

export function addOrder(order) {
  const orders = getOrders();
  const newOrder = {
    ...order,
    id: Date.now(),
    code: `DH${String(orders.length + 1).padStart(5, "0")}`,
    status: "Chờ xác nhận",
    createdAt: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  saveOrders(orders);
  // Giảm tồn kho khi tạo đơn
  decreaseStockByOrder(newOrder.items);
  return newOrder;
}

function decreaseStockByOrder(items) {
  const products = getProducts();
  let changed = false;
  const next = products.map((p) => {
    const item = items.find((i) => i.productId === p.id);
    if (!item) return p;
    const newStock = Math.max(0, (p.stock ?? 0) - item.quantity);
    changed = true;
    return { ...p, stock: newStock };
  });
  if (changed) saveProducts(next);
}

function restoreStockByOrder(items) {
  const products = getProducts();
  const next = products.map((p) => {
    const item = items.find((i) => i.productId === p.id);
    if (!item) return p;
    return { ...p, stock: (p.stock ?? 0) + item.quantity };
  });
  saveProducts(next);
}

export function updateOrderStatus(orderId, newStatus) {
  const orders = getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return null;
  const wasCancelled = order.status === "Đã hủy";
  order.status = newStatus;
  if (newStatus === "Đã hủy" && !wasCancelled) {
    restoreStockByOrder(order.items);
  }
  saveOrders(orders);
  return order;
}

export function getCategories() {
  try {
    const raw = localStorage.getItem(KEY_CATEGORIES);
    if (raw) return JSON.parse(raw);
    const fromProducts = [...new Set(getProducts().map((p) => p.category).filter(Boolean))];
    const list = fromProducts.map((name, i) => ({ id: i + 1, name }));
    localStorage.setItem(KEY_CATEGORIES, JSON.stringify(list));
    return list;
  } catch {
    return [];
  }
}

export function saveCategories(categories) {
  localStorage.setItem(KEY_CATEGORIES, JSON.stringify(categories));
  return categories;
}

export function getUsers() {
  try {
    const raw = localStorage.getItem(KEY_USERS);
    if (raw) return JSON.parse(raw);
    const defaultUsers = [
      { id: 1, name: "Admin", email: "admin@fresh.vn", phone: "0900000001", role: "admin", status: "active", createdAt: new Date().toISOString() },
      { id: 2, name: "Nguyễn Văn A", email: "user1@email.com", phone: "0900000002", role: "user", status: "active", createdAt: new Date().toISOString() },
    ];
    localStorage.setItem(KEY_USERS, JSON.stringify(defaultUsers));
    return defaultUsers;
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(KEY_USERS, JSON.stringify(users));
  return users;
}

export function getActiveProducts() {
  return getProducts().filter((p) => p.status !== "inactive");
}

export { ORDER_STATUSES, LOW_STOCK_THRESHOLD };
