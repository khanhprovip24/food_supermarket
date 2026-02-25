import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";

const DEFAULT_PRODUCT = {
  name: "",
  category: "",
  price: "",
  stock: 50,
  unit: "kg",
  image: "",
  description: "",
  status: "active",
};

export default function AdminProducts() {
  const admin = useAdmin();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(DEFAULT_PRODUCT);
  const [showForm, setShowForm] = useState(false);

  const products = admin?.allProducts ?? [];
  const categories = admin?.categories ?? [];

  const openAdd = () => {
    setEditing(null);
    setForm(DEFAULT_PRODUCT);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock ?? 50,
      unit: p.unit ?? "kg",
      image: p.image ?? "",
      description: p.description ?? "",
      status: p.status ?? "active",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(DEFAULT_PRODUCT);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price) || 0,
      stock: Number(form.stock) ?? 50,
      unit: form.unit.trim() || "kg",
      image: form.image.trim() || "/images/placeholder.jpg",
      description: form.description.trim(),
      status: form.status,
    };
    if (editing) {
      admin.updateProduct(editing.id, payload);
    } else {
      payload.slug = payload.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
      admin.addProduct(payload);
    }
    closeForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      admin.deleteProduct(id);
    }
  };

  if (!admin) return <p>Không có quyền truy cập.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý sản phẩm</h1>
      <button
        onClick={openAdd}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Thêm sản phẩm
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">
              {editing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (đ)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                <input
                  type="text"
                  placeholder="kg, cái, bó, vỉ..."
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh (URL)</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="active">Đang bán</option>
                  <option value="inactive">Ngừng bán</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  {editing ? "Cập nhật" : "Thêm"}
                </button>
                <button type="button" onClick={closeForm} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Ảnh</th>
              <th className="p-3">Tên</th>
              <th className="p-3">Danh mục</th>
              <th className="p-3">Giá</th>
              <th className="p-3">Tồn</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  <img src={p.image} alt="" className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{Number(p.price).toLocaleString()} đ</td>
                <td className="p-3">{p.stock ?? 0}</td>
                <td className="p-3">
                  <span className={p.status === "active" ? "text-green-600" : "text-gray-500"}>
                    {p.status === "active" ? "Đang bán" : "Ngừng bán"}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => openEdit(p)} className="text-blue-600 hover:underline text-sm">Sửa</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline text-sm">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
