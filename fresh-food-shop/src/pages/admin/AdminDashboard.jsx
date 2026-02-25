import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import AdminProducts from "../../components/admin/AdminProducts";
import AdminOrders from "../../components/admin/AdminOrders";
import AdminInventory from "../../components/admin/AdminInventory";
import AdminUsers from "../../components/admin/AdminUsers";
import AdminCategories from "../../components/admin/AdminCategories";
import AdminStats from "../../components/admin/AdminStats";

const TABS = [
  { key: "products", label: "Quản lý sản phẩm", icon: "📦" },
  { key: "orders", label: "Quản lý đơn hàng", icon: "📋" },
  { key: "inventory", label: "Quản lý tồn kho", icon: "📊" },
  { key: "users", label: "Quản lý người dùng", icon: "👥" },
  { key: "categories", label: "Danh mục sản phẩm", icon: "🏷️" },
  { key: "stats", label: "Thống kê & Báo cáo", icon: "📈" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("products");

  return (
    <AdminLayout>
      <div className="flex gap-8">
        <aside className="w-56 flex-shrink-0 space-y-1">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Admin</h2>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 transition ${
                tab === t.key
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{t.icon}</span>
              <span className="text-sm font-medium">{t.label}</span>
            </button>
          ))}
        </aside>
        <div className="flex-1 min-w-0">
          {tab === "products" && <AdminProducts />}
          {tab === "orders" && <AdminOrders />}
          {tab === "inventory" && <AdminInventory />}
          {tab === "users" && <AdminUsers />}
          {tab === "categories" && <AdminCategories />}
          {tab === "stats" && <AdminStats />}
        </div>
      </div>
    </AdminLayout>
  );
}
