import { useCart } from "../context/CartContext";
import { useAdmin } from "../context/AdminContext";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const SHIPPING_STORAGE_KEY = "freshFoodShippingInfoHistory";

const getSavedShippingList = () => {
  try {
    const raw = localStorage.getItem(SHIPPING_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveShippingToHistory = (info) => {
  const list = getSavedShippingList();
  const newItem = {
    ...info,
    savedAt: new Date().toISOString(),
    id: Date.now(),
  };
  const updated = [newItem, ...list].slice(0, 10);
  localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

const Checkout = () => {
  const { cartItems, clearCart, removeItems } = useCart();
  const admin = useAdmin();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedIds = location.state?.selectedIds;

  const orderItems =
    selectedIds?.length > 0
      ? cartItems.filter((item) => selectedIds.includes(item.id))
      : cartItems;
  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [savedList, setSavedList] = useState([]);

  useEffect(() => {
    setSavedList(getSavedShippingList());
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveInfo = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      alert("Vui lòng điền đầy đủ tên, SĐT và địa chỉ trước khi lưu.");
      return;
    }
    const updated = saveShippingToHistory(form);
    setSavedList(updated);
    alert("Đã lưu thông tin. Lần sau bạn có thể chọn từ danh sách.");
  };

  const applySavedInfo = (item) => {
    setForm({
      name: item.name || "",
      phone: item.phone || "",
      address: item.address || "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      alert("Không có sản phẩm nào để đặt. Vui lòng chọn sản phẩm từ giỏ hàng.");
      return;
    }
    const methodLabel = paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản / QR";
    if (admin) {
      admin.addOrder({
        customerName: form.name,
        customerPhone: form.phone,
        address: form.address,
        customerEmail: user?.email || null,
        items: orderItems.map((i) => ({
          productId: i.id,
          name: i.name,
          image: i.image,
          category: i.category,
          quantity: i.quantity,
          unit: i.unit || "sản phẩm",
          price: i.price,
        })),
        total: totalPrice,
        paymentMethod: methodLabel,
      });
    }
    alert(`Đặt hàng thành công 🎉\nPhương thức thanh toán: ${methodLabel}`);
    if (selectedIds?.length > 0) {
      removeItems(selectedIds);
    } else {
      clearCart();
    }
    navigate("/");
  };

  if (orderItems.length === 0) {
    return (
      <MainLayout>
        <h2 className="text-3xl font-bold mb-8">Thanh toán</h2>
        <p className="text-gray-600 mb-4">
          {cartItems.length === 0
            ? "Bạn chưa có sản phẩm nào trong giỏ."
            : "Vui lòng chọn sản phẩm từ giỏ hàng rồi nhấn Đặt hàng."}
        </p>
        <button
          onClick={() => navigate("/cart")}
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          Về giỏ hàng
        </button>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h2 className="text-3xl font-bold mb-8">Thanh toán</h2>

      <div className="grid md:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          {savedList.length > 0 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sử dụng thông tin đã lưu
              </label>
              <select
                className="w-full border p-2 rounded"
                onChange={(e) => {
                  const id = Number(e.target.value);
                  if (!id) return;
                  const item = savedList.find((s) => s.id === id);
                  if (item) applySavedInfo(item);
                }}
              >
                <option value="">-- Chọn thông tin đã lưu --</option>
                {savedList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} - {item.phone}
                  </option>
                ))}
              </select>
            </div>
          )}

          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded"
          />

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSaveInfo}
              className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
            >
              Lưu thông tin đặt hàng
            </button>
          </div>

          <div className="pt-4 border-t">
            <p className="font-medium text-gray-700 mb-2">Phương thức thanh toán</p>
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              Tiền mặt
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="qr"
                checked={paymentMethod === "qr"}
                onChange={() => setPaymentMethod("qr")}
              />
              Chuyển khoản / QR
            </label>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border space-y-4">
            <p className="font-medium text-gray-700">Chi tiết hóa đơn</p>
            {paymentMethod === "qr" && (
              <>
                <p className="text-sm text-gray-600">Quét mã QR để thanh toán</p>
                <div className="flex justify-center bg-white p-4 rounded-lg inline-block">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      `FreshFoodShop|${totalPrice}|${form.name}|${form.phone}`
                    )}`}
                    alt="Mã QR thanh toán"
                    className="w-48 h-48 object-contain"
                  />
                </div>
              </>
            )}
            <div className="text-sm text-gray-600 border-t pt-3 mt-3">
              <p className="font-medium text-gray-800 mb-2">Thông tin hóa đơn</p>
              <p><span className="text-gray-500">Khách hàng:</span> {form.name || "—"}</p>
              <p><span className="text-gray-500">SĐT:</span> {form.phone || "—"}</p>
              <p><span className="text-gray-500">Địa chỉ:</span> {form.address || "—"}</p>
              <p className="mt-2 font-medium">Sản phẩm:</p>
              <ul className="list-disc list-inside text-gray-600">
                {orderItems.map((item) => (
                  <li key={item.id}>
                    {item.name} — {item.quantity} {item.unit || "sản phẩm"} × {item.price.toLocaleString()} đ = {(item.price * item.quantity).toLocaleString()} đ
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-semibold text-gray-800">
                Tổng thanh toán: {totalPrice.toLocaleString()} đ
              </p>
              <p className="text-gray-500">
                Hình thức thanh toán: {paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản / QR"}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 w-full mt-4"
          >
            Xác nhận đặt hàng
          </button>
        </form>

        <div className="border p-6 rounded h-fit space-y-4">
          <h3 className="text-xl font-bold">Đơn hàng của bạn</h3>

          <ul className="space-y-3 divide-y">
            {orderItems.map((item) => (
              <li key={item.id} className="flex gap-3 pt-3 first:pt-0">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} {item.unit || "sản phẩm"} × {item.price.toLocaleString()} đ
                  </p>
                </div>
                <p className="font-medium flex-shrink-0">
                  {(item.price * item.quantity).toLocaleString()} đ
                </p>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t">
            <h3 className="text-xl font-bold mb-2">Tổng thanh toán</h3>
            <p className="text-2xl text-green-600 font-bold">
              {totalPrice.toLocaleString()} đ
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
