import { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  getProducts,
  saveProducts,
  getOrders,
  addOrder as storageAddOrder,
  updateOrderStatus as storageUpdateOrderStatus,
  getCategories,
  saveCategories,
  getUsers,
  saveUsers,
  getActiveProducts,
} from "../data/adminStorage";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [products, setProductsState] = useState(getProducts);
  const [orders, setOrdersState] = useState(getOrders);
  const [categories, setCategoriesState] = useState(getCategories);
  const [users, setUsersState] = useState(getUsers);

  const refresh = useCallback(() => {
    setProductsState(getProducts());
    setOrdersState(getOrders());
    setCategoriesState(getCategories());
    setUsersState(getUsers());
  }, []);

  const activeProducts = products.filter((p) => p.status !== "inactive");

  const addProduct = useCallback((product) => {
    const list = getProducts();
    const slug = product.slug || product.name.toLowerCase().replace(/\s+/g, "-");
    const newProduct = {
      ...product,
      id: Date.now(),
      slug: slug,
      stock: product.stock ?? 50,
      status: product.status ?? "active",
    };
    list.push(newProduct);
    saveProducts(list);
    refresh();
    return newProduct;
  }, [refresh]);

  const updateProduct = useCallback((id, updates) => {
    const list = getProducts().map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveProducts(list);
    refresh();
  }, [refresh]);

  const deleteProduct = useCallback((id) => {
    const list = getProducts().filter((p) => p.id !== id);
    saveProducts(list);
    refresh();
  }, [refresh]);

  const setProductStatus = useCallback((id, status) => {
    updateProduct(id, { status });
  }, [updateProduct]);

  const addOrder = useCallback((order) => {
    const created = storageAddOrder(order);
    refresh();
    return created;
  }, [refresh]);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    storageUpdateOrderStatus(orderId, newStatus);
    refresh();
  }, [refresh]);

  const setCategories = useCallback((list) => {
    saveCategories(list);
    refresh();
  }, [refresh]);

  const setUsers = useCallback((list) => {
    saveUsers(list);
    refresh();
  }, [refresh]);

  const updateUser = useCallback((id, updates) => {
    const list = getUsers().map((u) => (u.id === id ? { ...u, ...updates } : u));
    saveUsers(list);
    refresh();
  }, [refresh]);

  const value = {
    products: activeProducts,
    allProducts: products,
    setProducts: (list) => { saveProducts(list); refresh(); },
    addProduct,
    updateProduct,
    deleteProduct,
    setProductStatus,
    orders,
    addOrder,
    updateOrderStatus,
    categories,
    setCategories,
    users,
    setUsers,
    updateUser,
    refresh,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) return null;
  return ctx;
}

export function useProducts() {
  const ctx = useContext(AdminContext);
  return ctx ? ctx.products : [];
}

export function fetchProductBySlugFromStore(slug) {
  return getActiveProducts().find((p) => p.slug === slug);
}
