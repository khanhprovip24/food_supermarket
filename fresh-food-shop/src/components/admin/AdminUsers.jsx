import { useAdmin } from "../../context/AdminContext";

export default function AdminUsers() {
  const admin = useAdmin();
  const users = admin?.users ?? [];

  const toggleLock = (u) => {
    const newStatus = u.status === "locked" ? "active" : "locked";
    admin?.updateUser(u.id, { status: newStatus });
  };

  const setRole = (u, role) => {
    admin?.updateUser(u.id, { role });
  };

  if (!admin) return <p>Không có quyền truy cập.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý người dùng</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Tên</th>
              <th className="p-3">Email</th>
              <th className="p-3">SĐT</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Vai trò</th>
              <th className="p-3">Ngày đăng ký</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.phone ?? "—"}</td>
                <td className="p-3">
                  <span className={u.status === "locked" ? "text-red-600" : "text-green-600"}>
                    {u.status === "locked" ? "Đã khóa" : "Hoạt động"}
                  </span>
                </td>
                <td className="p-3">
                  <select
                    value={u.role ?? "user"}
                    onChange={(e) => setRole(u, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-3 text-sm text-gray-600">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "—"}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleLock(u)}
                    className={`text-sm px-2 py-1 rounded ${u.status === "locked" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {u.status === "locked" ? "Mở khóa" : "Khóa"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="p-6 text-gray-500 text-center">Chưa có người dùng.</p>
        )}
      </div>
    </div>
  );
}
