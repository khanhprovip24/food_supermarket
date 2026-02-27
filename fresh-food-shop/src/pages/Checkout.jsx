import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import MainLayout from '../layouts/MainLayout';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart, removeItems } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Get selected item IDs from navigation state
  const selectedIds = location.state?.selectedIds || [];

  const [formData, setFormData] = useState({
    shippingAddress: '',
    paymentMethod: 'cash',
    discountCode: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Filter cart items to only include selected ones
  const orderItems = selectedIds.length > 0
    ? cartItems.filter((item) => selectedIds.includes(item.id))
    : cartItems;

  const totalPrice = orderItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Redirect to cart if no items
  useEffect(() => {
    if (!loading && !success && orderItems.length === 0) {
      navigate('/cart');
    }
  }, [loading, success, orderItems.length, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    if (!formData.shippingAddress.trim()) {
      setError('Vui lòng nhập địa chỉ giao hàng');
      setLoading(false);
      return;
    }

    try {
      const result = await orderService.createOrder(
        formData.shippingAddress,
        formData.paymentMethod,
        formData.discountCode || null
      );

      if (result.success) {
        setSuccess(true);
        setOrderId(result.data.id);
        
        // Remove ordered items from cart
        if (selectedIds.length > 0) {
          await removeItems(selectedIds);
        } else {
          await clearCart();
        }

        // Redirect to order detail after 2 seconds
        setTimeout(() => {
          navigate(`/orders/${result.data.id}`);
        }, 2000);
      } else {
        setError(result.error || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Có lỗi xảy ra khi xử lý đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <MainLayout>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 my-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h2>
            <p className="text-gray-600 mb-4">Mã đơn hàng: <span className="font-bold">{orderId}</span></p>
            <p className="text-gray-500 text-sm mb-6">Đang chuyển hướng đến chi tiết đơn hàng...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h2 className="text-3xl font-bold mb-8">Thanh toán</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Shipping Address */}
              <div>
                <label htmlFor="shipping" className="block text-gray-700 font-medium mb-2">
                  Địa chỉ giao hàng *
                </label>
                <textarea
                  id="shipping"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ giao hàng đầy đủ"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                  required
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phương thức thanh toán
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'cash', label: 'Thanh toán khi nhận hàng' },
                    { value: 'transfer', label: 'Chuyển khoản ngân hàng' },
                    { value: 'card', label: 'Thẻ tín dụng' },
                  ].map(method => (
                    <label key={method.value} className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="ml-2 text-gray-700">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Discount Code */}
              <div>
                <label htmlFor="discount" className="block text-gray-700 font-medium mb-2">
                  Mã giảm giá (tùy chọn)
                </label>
                <input
                  id="discount"
                  type="text"
                  name="discountCode"
                  value={formData.discountCode}
                  onChange={handleInputChange}
                  placeholder="Nhập mã giảm giá nếu có"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Order Buttons */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
              >
                {loading ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-200"
              >
                Quay lại giỏ hàng
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Tóm tắt đơn hàng</h3>

            {/* Cart Items */}
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              {orderItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    {((item.price || 0) * (item.quantity || 0)).toLocaleString('vi-VN')}đ
                  </p>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span>{totalPrice > 200000 ? '0đ' : '30.000đ'}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t">
                <span>Tổng cộng:</span>
                <span>
                  {(totalPrice + (totalPrice > 200000 ? 0 : 30000)).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="mt-6 pt-4 border-t text-sm text-gray-600">
              <p><strong>Ghi chú:</strong></p>
              <p>Đơn hàng sẽ được giao đến:</p>
              <p className="font-medium text-gray-800 mt-1">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
