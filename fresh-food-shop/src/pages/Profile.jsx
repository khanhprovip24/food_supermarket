import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-md mx-auto py-12 text-center">
          <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem trang cá nhân.</p>
          <Link
            to="/login"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Đăng nhập
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-md mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Tài khoản</h1>
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-500">Họ tên</label>
            <p className="font-medium">{user.name || "—"}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium">{user.email || "—"}</p>
          </div>
          <Link
            to="/orders"
            className="inline-block mt-4 text-green-600 font-medium hover:underline"
          >
            → Xem đơn hàng của tôi
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
