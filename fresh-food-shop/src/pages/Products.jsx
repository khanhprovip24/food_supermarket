import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/AdminContext";

function Products() {
  const { addToCart } = useCart();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";

  const categories = [
    "Tất cả",
    "Trái cây",
    "Rau củ",
    "Thịt",
    "Cá",
    "Trứng",
    "Sữa",
    "Hải sản",
  ];

  const products = useProducts();
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [toast, setToast] = useState(null);

  const showToast = (productName) => {
    setToast(`Bạn đã thêm sản phẩm ${productName} vào giỏ hàng!`);
    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    showToast(product.name);
  };

  const filteredProducts = useMemo(() => {
    const removeVietnameseTones = (str) => {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    };

    if (search) {
      return products.filter((product) =>
        removeVietnameseTones(product.name).includes(
          removeVietnameseTones(search)
        )
      );
    }

    return selectedCategory === "Tất cả"
      ? products
      : products.filter(
          (product) => product.category === selectedCategory
        );
  }, [selectedCategory, search, products]);

  return (
    <div className="bg-green-50 min-h-screen flex flex-col overflow-y-scroll">
      <Navbar />

      {/* TOAST */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-8 py-3 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8">
        {/* THANH DANH MỤC - Tối ưu sticky và hiển thị */}
<div className="sticky top-[64px] z-40 bg-green-50/95 backdrop-blur-sm py-4 border-b border-green-100 shadow-sm -mx-6 px-6">
  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide focus:outline-none">
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => setSelectedCategory(category)}
        className={`px-6 py-2 rounded-full whitespace-nowrap transition-all duration-200 font-semibold border-2 ${
          selectedCategory === category
            ? "bg-green-600 text-white border-green-600 shadow-md scale-105"
            : "bg-white text-gray-600 border-transparent hover:border-green-200 hover:bg-green-50"
        }`}
      >
        {category}
      </button>
    ))}
  </div>
</div>

        {/* TIÊU ĐỀ */}
        <h1 className="text-3xl font-bold mt-8 mb-8 text-green-900">
          {search
            ? `Kết quả tìm kiếm: "${search}"`
            : selectedCategory}
        </h1>

        {filteredProducts.length === 0 && (
          <p className="text-gray-500">
            Không tìm thấy sản phẩm phù hợp.
          </p>
        )}

        {/* GRID SẢN PHẨM */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden group"
            >
              <Link to={`/products/${product.slug}`}>
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover h-full w-full group-hover:scale-105 transition duration-300"
                  />
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-lg text-gray-800 mb-1 hover:text-green-600 transition">
                    {product.name}
                  </h3>
                </Link>
                {product.unit && (
                  <p className="text-xs text-gray-500 mb-2">Đơn vị: {product.unit}</p>
                )}
                <p className="text-green-600 font-bold text-xl mb-3">
                  {product.price.toLocaleString()}đ
                </p>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold transition active:scale-95"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default Products;