import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useProducts } from "../context/AdminContext";
import { useCart } from "../context/CartContext";

const ProductDetail = () => {
  const { slug } = useParams();
  const products = useProducts();
  const { addToCart } = useCart();
  const product = products.find((p) => p.slug === slug);
  const loading = false;

  if (loading) {
    return (
      <MainLayout>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-300 mb-6"></div>
          <div className="h-6 bg-gray-300 mb-4 w-1/2"></div>
          <div className="h-4 bg-gray-300 mb-2"></div>
          <div className="h-4 bg-gray-300 mb-4 w-1/3"></div>
          <div className="h-12 bg-gray-300 w-40"></div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <h2>Sản phẩm không tồn tại</h2>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="grid md:grid-cols-2 gap-10 mt-10">
        <img src={product.image} alt={product.name} />

        <div>
          <h2 className="text-3xl font-bold mb-4">
            {product.name}
          </h2>

          <p className="mb-4">{product.description}</p>

          <p className="text-xl font-semibold text-green-600 mb-4">
            {product.price.toLocaleString()} đ
            {product.unit ? ` / ${product.unit}` : ""}
          </p>

          <button
            onClick={() => addToCart(product)}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
