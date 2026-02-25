import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/AdminContext";
import { Link } from "react-router-dom";

const FeaturedProducts = () => {
  const all = useProducts();
  const products = all.slice(0, 8);
  const { addToCart } = useCart();

  return (
    <section className="section">
      <div className="container-custom">
        <h2 className="text-4xl font-bold mb-12 text-center">
          Sản phẩm nổi bật
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div key={index} className="fresh-card p-5">
              <Link to={`/products/${product.slug}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="rounded-xl mb-4 w-full h-48 object-cover"
                />
                <h3 className="font-semibold text-lg mb-1">
                  {product.name}
                </h3>
              </Link>
              {product.unit && (
                <p className="text-xs text-gray-500 mb-2">Đơn vị: {product.unit}</p>
              )}
              <p className="text-green-600 font-bold mb-4">
                {product.price.toLocaleString()} đ
              </p>

              <button
                onClick={() => addToCart(product)}
                className="btn-fresh w-full"
              >
                Thêm vào giỏ
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
