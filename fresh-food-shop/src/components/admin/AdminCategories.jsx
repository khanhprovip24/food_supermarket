import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";

export default function AdminCategories() {
  const admin = useAdmin();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const categories = admin?.categories ?? [];

  const addCategory = (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const list = [...categories, { id: Date.now(), name }];
    admin?.setCategories(list);
    setNewName("");
  };

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditName(c.name);
  };

  const saveEdit = () => {
    if (editingId == null) return;
    const list = categories.map((c) =>
      c.id === editingId ? { ...c, name: editName.trim() || c.name } : c
    );
    admin?.setCategories(list);
    setEditingId(null);
  };

  const removeCategory = (id) => {
    if (!window.confirm("Xóa danh mục? Sản phẩm thuộc danh mục này có thể bị ảnh hưởng.")) return;
    const list = categories.filter((c) => c.id !== id);
    admin?.setCategories(list);
  };

  if (!admin) return <p>Không có quyền truy cập.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Danh mục sản phẩm</h1>

      <form onSubmit={addCategory} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Tên danh mục mới (VD: Thịt, Rau củ)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Thêm
        </button>
      </form>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Tên danh mục</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.id}</td>
                <td className="p-3">
                  {editingId === c.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border rounded px-2 py-1 w-48"
                    />
                  ) : (
                    <span className="font-medium">{c.name}</span>
                  )}
                </td>
                <td className="p-3 flex gap-2">
                  {editingId === c.id ? (
                    <button onClick={saveEdit} className="text-green-600 hover:underline text-sm">Lưu</button>
                  ) : (
                    <button onClick={() => startEdit(c)} className="text-blue-600 hover:underline text-sm">Sửa</button>
                  )}
                  <button onClick={() => removeCategory(c.id)} className="text-red-600 hover:underline text-sm">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <p className="p-6 text-gray-500 text-center">Chưa có danh mục. Thêm danh mục từ form phía trên.</p>
        )}
      </div>
    </div>
  );
}
