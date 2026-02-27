import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
  } = useCart();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === cartItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(cartItems.map((item) => item.id)));
    }
  };

  const selectedItems = cartItems.filter((item) => selectedIds.has(item.id));
  const totalSelected =
    selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (selectedIds.size === 0) return;
    navigate("/checkout", { state: { selectedIds: Array.from(selectedIds) } });
  };

  return (
    <MainLayout>
      <h2 className="text-3xl font-bold mb-8">Giỏ hàng</h2>

      {cartItems.length === 0 ? (
        <p>Chưa có sản phẩm nào.</p>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2">
            <label htmlFor="select-all" className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
              <input
                id="select-all"
                type="checkbox"
                checked={selectedIds.size === cartItems.length && cartItems.length > 0}
                onChange={selectAll}
                className="w-4 h-4 rounded border-gray-300"
              />
              Chọn tất cả
            </label>
          </div>

          <div className="space-y-4 mb-8">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="border p-4 rounded flex justify-between items-center gap-4"
              >
                <div className="flex gap-4 flex-1 min-w-0 items-center">
                  <label htmlFor={`item-${item.id}`} className="flex items-center cursor-pointer flex-shrink-0">
                    <input
                      id={`item-${item.id}`}
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </label>
                  <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {item.name}
                    </h3>
                    {item.unit && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Đơn vị: {item.unit}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Đơn giá: {item.price.toLocaleString()} đ
                      {item.unit ? ` / ${item.unit}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="min-w-[1.5rem] text-center">{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-6 flex flex-col items-end gap-4">
            <p className="text-xl font-bold text-right">
              Tổng cộng: {totalSelected.toLocaleString()} đ
            </p>
            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="bg-gray-300 px-6 py-3 rounded hover:bg-gray-400"
              >
                Xóa toàn bộ
              </button>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={selectedIds.size === 0}
                className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Cart;
