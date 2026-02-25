import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";
import OrderDetailContent from "../components/orders/OrderDetailContent";

const CANCELABLE_STATUSES = ["Chờ xác nhận", "Đang xử lý"];

export default function MyOrders() {
  const { user } = useAuth();
  const admin = useAdmin();
  const navigate = useNavigate();
  const [detailId, setDetailId] = useState(null);

  const orders = (admin?.orders ?? []).filter(
    (o) => o.customerEmail && user?.email && o.customerEmail === user.email
  );
  const detailOrder = detailId ? orders.find((o) => o.id === detailId) : null;
  const canCancel = detailOrder && CANCELABLE_STATUSES.includes(detailOrder.status);
  const isCancelRequested = detailOrder?.status === "Yêu cầu hủy";

  const handleRequestCancel = () => {
    if (!detailOrder || !canCancel) return;
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này? Admin sẽ xem và xác nhận hủy.")) return;
    admin?.updateOrderStatus(detailOrder.id, "Yêu cầu hủy");
    setDetailId(null);
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto py-12 text-center">
          <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem đơn hàng.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Đăng nhập
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Đơn hàng của tôi</h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o.id}
                className="border rounded-xl p-4 bg-white shadow-sm hover:shadow transition cursor-pointer"
                onClick={() => setDetailId(o.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono font-semibold text-gray-800">{o.code}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {o.createdAt ? new Date(o.createdAt).toLocaleString("vi-VN") : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {Number(o.total).toLocaleString()} đ
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-sm bg-gray-100">
                      {o.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {detailOrder && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setDetailId(null)}
          >
            <div
              className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <OrderDetailContent order={detailOrder} products={admin?.allProducts ?? []} />

              {isCancelRequested && (
                <p className="mt-4 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded">
                  Đã gửi yêu cầu hủy đơn. Admin sẽ xác nhận và đơn sẽ chuyển sang trạng thái Đã hủy.
                </p>
              )}
              {canCancel && (
                <button
                  type="button"
                  onClick={handleRequestCancel}
                  className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Hủy đơn hàng
                </button>
              )}
              {detailOrder.status === "Đang giao hàng" && (
                <p className="mt-4 text-sm text-gray-500">Đơn đang giao hàng, không thể hủy.</p>
              )}
              {["Hoàn thành", "Đã hủy"].includes(detailOrder.status) && (
                <p className="mt-4 text-sm text-gray-500">Đơn này không thể hủy.</p>
              )}

              <button
                onClick={() => setDetailId(null)}
                className="mt-4 w-full bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
