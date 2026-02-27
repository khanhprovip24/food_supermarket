import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import orderService from "../services/orderService";

export default function MyOrders() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    loadOrders();
  }, [isAuthenticated]);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    console.log('Starting loadOrders...');
    
    const result = await orderService.getOrders();
    console.log('loadOrders result:', result);
    
    if (result.success) {
      console.log('Raw orders data:', result.data);
      const ordersData = Array.isArray(result.data) ? result.data : result.data?.results || [];
      console.log('Processed ordersData:', ordersData);
      setOrders(ordersData);
      setError(null);
    } else {
      const errorMsg = result.error || "Không thể tải danh sách đơn hàng";
      console.error("Error loading orders:", errorMsg);
      setError(errorMsg);
    }
    setLoading(false);
  };

  const handleOrderClick = async (order) => {
    console.log('handleOrderClick - Opening order:', order.id);
    // Fetch full order details when clicking on an order
    const result = await orderService.getOrderDetail(order.id);
    console.log('handleOrderClick - getOrderDetail result:', result);
    
    if (result.success) {
      console.log('handleOrderClick - Setting selectedOrder:', result.data);
      setSelectedOrder(result.data);
    } else {
      const errorMsg = result.error || "Không thể tải chi tiết đơn hàng";
      console.error("Error loading order detail:", errorMsg);
      setError(errorMsg);
    }
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

  const getPaymentMethodLabel = (method) => {
    const methodsMap = {
      'cash': 'Thanh toán khi nhận hàng',
      'transfer': 'Chuyển khoản ngân hàng',
      'card': 'Thẻ tín dụng',
      'cod': 'Thanh toán khi nhận hàng',
      'online': 'Thanh toán online',
      'bank_transfer': 'Chuyển khoản ngân hàng',
    };
    
    if (!method) return '—';
    return methodsMap[method.toLowerCase()] || method;
  };

  if (!isAuthenticated) {
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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Lỗi:</p>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">Bạn chưa có đơn hàng nào.</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => handleOrderClick(order)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono font-semibold text-gray-800">#{order.id}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.created_at ? new Date(order.created_at).toLocaleString("vi-VN") : "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {(order.total_amount || order.total_price || 0).toLocaleString('vi-VN')}đ
                    </p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded text-sm font-medium ${getStatusBadgeColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Đơn hàng #{selectedOrder.id}</h2>
                  <p className="text-gray-600 mt-1">
                    {selectedOrder.created_at && new Date(selectedOrder.created_at).toLocaleString("vi-VN")}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusBadgeColor(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>

              <div className="space-y-6">
                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm</h3>
                  <div className="space-y-3 border-t border-b py-4">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <div>
                            <p className="font-medium text-gray-800">{item.product?.name || item.product_name || 'Sản phẩm'}</p>
                            <p className="text-sm text-gray-600">{item.quantity} x {(item.price || 0).toLocaleString('vi-VN')}đ</p>
                          </div>
                          <p className="font-medium">{((item.quantity || 1) * (item.price || 0)).toLocaleString('vi-VN')}đ</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">Không có sản phẩm</p>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Địa chỉ giao hàng</h3>
                  <p className="text-gray-700">{selectedOrder.shipping_address || "—"}</p>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Phương thức thanh toán</h3>
                  <p className="text-gray-700">
                    {getPaymentMethodLabel(selectedOrder.payment_method)}
                  </p>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-gray-700 mb-2">
                    <span>Tạm tính:</span>
                    <span>{selectedOrder.subtotal ? (selectedOrder.subtotal).toLocaleString('vi-VN') : (selectedOrder.total_amount || 0).toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tổng cộng:</span>
                    <span className="font-bold text-lg text-green-600">{(selectedOrder.total_amount || 0).toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
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
