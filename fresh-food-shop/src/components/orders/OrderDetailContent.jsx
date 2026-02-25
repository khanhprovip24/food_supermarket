/**
 * Nội dung chi tiết đơn hàng: thông tin đơn + danh sách sản phẩm (ảnh, tên, giá, thành tiền).
 * Dùng chung cho trang User (Đơn hàng của tôi) và Admin (Quản lý đơn hàng).
 */
export default function OrderDetailContent({ order, products = [] }) {
  const getImage = (item) => {
    if (item.image) return item.image;
    const p = products.find((x) => x.id === item.productId);
    return p?.image || "/images/placeholder.jpg";
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-2">Chi tiết hóa đơn</h2>
      <p className="text-sm text-gray-500 mb-4 font-mono">Mã đơn: {order.code}</p>

      <div className="space-y-2 text-sm text-gray-700">
        <p><strong>Người nhận / Người mua:</strong> {order.customerName}</p>
        <p><strong>Số điện thoại:</strong> {order.customerPhone}</p>
        <p><strong>Địa chỉ giao hàng:</strong> {order.address}</p>
        <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod || "—"}</p>
        <p><strong>Thời gian đặt hàng:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN") : "—"}</p>
        <p><strong>Trạng thái:</strong> {order.status}</p>
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="font-medium mb-3">Sản phẩm</p>
        <ul className="space-y-3">
          {(order.items || []).map((item, i) => (
            <li key={i} className="flex gap-3 items-center border-b pb-3 last:border-0">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={getImage(item)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">
                  Đơn giá: {Number(item.price).toLocaleString()} đ / {item.unit || "sp"}
                </p>
                <p className="text-sm text-gray-600">
                  Số lượng: {item.quantity} × {Number(item.price).toLocaleString()} đ = <strong>{Number(item.quantity * item.price).toLocaleString()} đ</strong>
                </p>
              </div>
              <p className="font-semibold text-green-600 flex-shrink-0">
                {Number(item.quantity * item.price).toLocaleString()} đ
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-3 font-bold text-gray-800">Tổng thanh toán: {Number(order.total).toLocaleString()} đ</p>
      </div>
    </>
  );
}
