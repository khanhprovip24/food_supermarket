import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { ORDER_STATUSES } from "../../data/adminStorage";
import OrderDetailContent from "../orders/OrderDetailContent";

export default function AdminOrders() {
  const admin = useAdmin();
  const [detailId, setDetailId] = useState(null);
  const orders = admin?.orders ?? [];
  const order = detailId ? orders.find((o) => o.id === detailId) : null;
  const isCancelRequested = order?.status === "Yêu cầu hủy";

  const handleStatusChange = (orderId, newStatus) => {
    admin?.updateOrderStatus(orderId, newStatus);
    if (newStatus === "Đã hủy") setDetailId(null);
  };

  const handleConfirmCancel = () => {
    if (!order) return;
    if (!window.confirm("Xác nhận hủy đơn hàng này? Số lượng tồn kho sẽ được hoàn lại.")) return;
    admin?.updateOrderStatus(order.id, "Đã hủy");
    setDetailId(null);
  };

  if (!admin) return <p>Không có quyền truy cập.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý đơn hàng</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Mã đơn</th>
              <th className="p-3">Người mua</th>
              <th className="p-3">Tổng tiền</th>
              <th className="p-3">Thanh toán</th>
              <th className="p-3">Thời gian</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3 font-mono">{o.code}</td>
                <td className="p-3">{o.customerName}</td>
                <td className="p-3">{Number(o.total).toLocaleString()} đ</td>
                <td className="p-3">{o.paymentMethod || "—"}</td>
                <td className="p-3 text-sm text-gray-600">
                  {o.createdAt ? new Date(o.createdAt).toLocaleString("vi-VN") : "—"}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${o.status === "Yêu cầu hủy" ? "bg-amber-100 text-amber-800" : "bg-gray-100"}`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => setDetailId(o.id)}
                    className="text-green-600 hover:underline text-sm"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-6 text-gray-500 text-center">Chưa có đơn hàng nào.</p>
        )}
      </div>

      {order && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <OrderDetailContent order={order} products={admin?.allProducts ?? []} />

            {isCancelRequested && (
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Xác nhận hủy đơn
              </button>
            )}

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cập nhật trạng thái</label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setDetailId(null)}
              className="mt-4 w-full bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
