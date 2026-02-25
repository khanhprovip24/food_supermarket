import { useMemo } from "react";
import { useAdmin } from "../../context/AdminContext";

export default function AdminStats() {
  const admin = useAdmin();
  const orders = admin?.orders ?? [];

  const stats = useMemo(() => {
    const completed = orders.filter((o) => o.status === "Hoàn thành");
    const totalRevenue = completed.reduce((s, o) => s + (Number(o.total) || 0), 0);
    const byMonth = {};
    const byCategory = {};
    const productCount = {};

    completed.forEach((o) => {
      const date = o.createdAt ? o.createdAt.slice(0, 7) : "";
      byMonth[date] = (byMonth[date] || 0) + (Number(o.total) || 0);
      (o.items || []).forEach((item) => {
        productCount[item.name] = (productCount[item.name] || 0) + item.quantity;
      });
    });

    orders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const cat = item.category || "Khác";
        byCategory[cat] = (byCategory[cat] || 0) + item.quantity * (item.price || 0);
      });
    });

    const topProducts = Object.entries(productCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      totalOrders: orders.length,
      completedOrders: completed.length,
      totalRevenue,
      byMonth: Object.entries(byMonth).sort((a, b) => a[0].localeCompare(b[0])).slice(-12),
      byCategory: Object.entries(byCategory),
      topProducts,
    };
  }, [orders]);

  if (!admin) return <p>Không có quyền truy cập.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Thống kê & Báo cáo</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Tổng đơn hàng</p>
          <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Đơn hoàn thành</p>
          <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Tổng doanh thu (đơn hoàn thành)</p>
          <p className="text-3xl font-bold text-green-600">{stats.totalRevenue.toLocaleString()} đ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-lg mb-4">Doanh thu theo tháng</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Tháng</th>
                  <th className="text-right p-2">Doanh thu (đ)</th>
                </tr>
              </thead>
              <tbody>
                {stats.byMonth.map(([month, value]) => (
                  <tr key={month} className="border-b">
                    <td className="p-2">{month}</td>
                    <td className="p-2 text-right font-medium">{Number(value).toLocaleString()}</td>
                  </tr>
                ))}
                {stats.byMonth.length === 0 && (
                  <tr><td colSpan={2} className="p-4 text-gray-500 text-center">Chưa có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-lg mb-4">Sản phẩm bán chạy</h2>
          <ul className="space-y-2">
            {stats.topProducts.map(([name, qty], i) => (
              <li key={name} className="flex justify-between">
                <span>{i + 1}. {name}</span>
                <span className="font-medium">{qty} đơn vị</span>
              </li>
            ))}
            {stats.topProducts.length === 0 && (
              <li className="text-gray-500">Chưa có dữ liệu</li>
            )}
          </ul>
        </div>
      </div>

      {stats.byCategory.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-lg mb-4">Doanh thu theo danh mục</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Danh mục</th>
                <th className="text-right p-2">Doanh thu (đ)</th>
              </tr>
            </thead>
            <tbody>
              {stats.byCategory.map(([cat, value]) => (
                <tr key={cat} className="border-b">
                  <td className="p-2">{cat}</td>
                  <td className="p-2 text-right font-medium">{Number(value).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
