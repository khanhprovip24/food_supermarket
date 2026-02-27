import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import orderService from "../services/orderService";

export default function OrderDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    loadOrder();
  }, [id, isAuthenticated]);

  const loadOrder = async () => {
    setLoading(true);
    const result = await orderService.getOrderDetail(id);
    
    if (result.success) {
      setOrder(result.data);
      setError(null);
    } else {
      setError(result.error || "Không thể tải chi tiết đơn hàng");
      console.error("Error loading order:", result.error);
    }
    setLoading(false);
  };

  const getStatusBadgeColor = (status) => {
    const statusMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      'pending': 'Chờ xác nhận',
      'confirmed': 'Đã xác nhận',
      'shipped': 'Đang giao',
      'delivered': 'Đã giao',
      'cancelled': 'Đã hủy',
    };
    return statusLabels[status] || status;
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto py-12 text-center">
          <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem chi tiết đơn hàng.</p>
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
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            <button
              onClick={() => navigate("/orders")}
              className="ml-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Quay lại danh sách
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Đang tải chi tiết đơn hàng...</p>
          </div>
        ) : order ? (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Đơn hàng #{order.id}</h1>
                <p className="text-gray-600 mt-2">
                  {order.created_at && new Date(order.created_at).toLocaleString("vi-VN")}
                </p>
              </div>
              <span className={`px-4 py-2 rounded text-sm font-medium ${getStatusBadgeColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Sản phẩm</h2>
              <div className="space-y-3 border-t border-b py-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.product_name}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x {(item.price || 0).toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                      <p className="font-medium">
                        {((item.quantity || 1) * (item.price || 0)).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">Không có sản phẩm</p>
                )}
              </div>
            </div>

            {/* Shipping Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Địa chỉ giao hàng</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {order.shipping_address || "—"}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Phương thức thanh toán</h3>
                <p className="text-gray-700 mb-4">
                  {order.payment_method === 'cash' && 'Thanh toán khi nhận hàng'}
                  {order.payment_method === 'transfer' && 'Chuyển khoản ngân hàng'}
                  {order.payment_method === 'card' && 'Thẻ tín dụng'}
                  {!order.payment_method && '—'}
                </p>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">Trạng thái thanh toán</p>
                  <p className="font-medium text-gray-800 mt-1">
                    {order.is_paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Tạm tính:</span>
                  <span>{(order.subtotal || 0).toLocaleString('vi-VN')}đ</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Giảm giá:</span>
                    <span className="text-green-600">-{(order.discount_amount || 0).toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700 pt-3 border-t">
                  <span className="font-bold">Tổng cộng:</span>
                  <span className="font-bold text-lg text-green-600">
                    {(order.total_price || 0).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/orders")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition"
              >
                Quay lại danh sách đơn hàng
              </button>
              <button
                onClick={() => navigate("/products")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Không tìm thấy đơn hàng</p>
            <button
              onClick={() => navigate("/orders")}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Quay lại
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
