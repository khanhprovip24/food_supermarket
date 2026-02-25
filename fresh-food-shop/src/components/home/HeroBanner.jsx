import { Link } from "react-router-dom";

const HeroBanner = () => {
  return (
    <section className="section bg-gradient-to-r from-green-100 to-emerald-50">
      <div className="container-custom grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Thực phẩm sạch <br />
            <span className="text-green-600">Tươi mỗi ngày</span>
          </h1>

          <p className="text-lg mb-8 text-gray-600">
            Mang thiên nhiên đến bàn ăn của bạn. Rau củ hữu cơ, trái cây tươi,
            giao hàng nhanh chóng trong ngày.
          </p>

          <div className="flex gap-4">
            <Link to="/products" className="btn-fresh">
              Mua ngay
            </Link>

            <Link to="/products" className="btn-outline">
              Xem sản phẩm
            </Link>
          </div>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e"
            alt="Fresh food"
            className="rounded-3xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
