import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice } from "../utils/formatters";

export default function Wishlist() {
  const { user, isAuthenticated } = useAuth();
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto py-12 text-center">
          <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem danh sách yêu thích.</p>
          <Link
            to="/login"
            className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium"
          >
            Đăng nhập
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">❤️ Danh sách yêu thích của tôi</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Đang tải danh sách...</p>
          </div>
        ) : !wishlistItems || wishlistItems.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <p className="text-gray-600 mb-6 text-lg">Danh sách yêu thích của bạn trống.</p>
            <Link
              to="/products"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 font-medium transition"
            >
              🛍️ Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                {/* Product Image */}
                <Link
                  to={`/products/${item.product?.id}`}
                  className="block aspect-square overflow-hidden bg-gray-100"
                >
                  <img
                    src={item.product?.image || "/placeholder.jpg"}
                    alt={item.product?.name}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link
                    to={`/products/${item.product?.id}`}
                    className="block mb-2"
                  >
                    <h3 className="font-semibold text-gray-800 hover:text-green-600 transition line-clamp-2">
                      {item.product?.name}
                    </h3>
                  </Link>

                  <p className="text-green-600 font-bold text-lg mb-2">
                    {formatPrice(item.product?.price || 0)}
                  </p>

                  <p className={`text-sm mb-4 ${
                    item.product?.stock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.product?.stock > 0 ? `Còn ${item.product?.stock} sản phẩm` : 'Hết hàng'}
                  </p>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate(`/products/${item.product?.id}`)}
                      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium transition"
                    >
                      👁️ Xem chi tiết
                    </button>

                    <button
                      onClick={() => removeFromWishlist(item.product?.id)}
                      className="w-full bg-red-50 text-red-600 py-2 rounded hover:bg-red-100 font-medium transition"
                    >
                      ❌ Xóa khỏi yêu thích
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
