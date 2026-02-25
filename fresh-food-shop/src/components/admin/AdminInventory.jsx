import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { LOW_STOCK_THRESHOLD } from "../../data/adminStorage";

export default function AdminInventory() {
  const admin = useAdmin();
  const [editingId, setEditingId] = useState(null);
  const [stockValue, setStockValue] = useState("");
  const products = admin?.allProducts ?? [];

  const openEdit = (p) => {
    setEditingId(p.id);
    setStockValue(String(p.stock ?? 0));
  };

  const saveStock = () => {
    if (editingId == null) return;
    admin.updateProduct(editingId, { stock: Number(stockValue) || 0 });
    setEditingId(null);
  };

  const lowStock = products.filter((p) => (p.stock ?? 0) < LOW_STOCK_THRESHOLD);

  if (!admin) return <p>Không có quyền truy cập.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý tồn kho</h1>

      {lowStock.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="font-medium text-amber-800">
            Cảnh báo: {lowStock.length} sản phẩm có tồn kho dưới {LOW_STOCK_THRESHOLD}.
          </p>
          <ul className="mt-2 text-sm text-amber-700">
            {lowStock.map((p) => (
              <li key={p.id}>{p.name} — Tồn: {p.stock ?? 0}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Sản phẩm</th>
              <th className="p-3">Đơn vị</th>
              <th className="p-3">Số lượng tồn</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{p.unit ?? "—"}</td>
                <td className="p-3">
                  {editingId === p.id ? (
                    <input
                      type="number"
                      min="0"
                      value={stockValue}
                      onChange={(e) => setStockValue(e.target.value)}
                      className="w-24 border rounded px-2 py-1"
                    />
                  ) : (
                    <span className={(p.stock ?? 0) < LOW_STOCK_THRESHOLD ? "text-amber-600 font-medium" : ""}>
                      {p.stock ?? 0}
                    </span>
                  )}
                </td>
                <td className="p-3">
                  {editingId === p.id ? (
                    <button onClick={saveStock} className="text-green-600 hover:underline text-sm">Lưu</button>
                  ) : (
                    <button onClick={() => openEdit(p)} className="text-blue-600 hover:underline text-sm">Cập nhật</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
