// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowRight, Sparkles, TrendingUp, Shield, Truck } from 'lucide-react';
// import ProductCard from '../components/products/ProductCard';
// import { products, categories } from '../data/mockProducts';

// const HomePage = () => {
//   const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 6);
//   const newProducts = products.filter((p) => p.isNew).slice(0, 4);

//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-br from-fresh-50 via-white to-fresh-100 overflow-hidden">
//         {/* Background Pattern */}
//         <div className="absolute inset-0 bg-organic-pattern opacity-30" />
        
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             {/* Left Content */}
//             <div className="space-y-8 animate-fade-in">
//               <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-card">
//                 <Sparkles size={18} className="text-sunshine" />
//                 <span className="text-sm font-semibold text-fresh-600">
//                   Giảm 25% cho đơn hàng đầu tiên
//                 </span>
//               </div>

//               <h1 className="font-display text-5xl lg:text-6xl font-bold text-earth-900 leading-tight">
//                 Thực phẩm{' '}
//                 <span className="text-gradient">tươi sạch</span>
//                 <br />
//                 giao tận nhà
//               </h1>

//               <p className="text-xl text-earth-600 leading-relaxed">
//                 Rau củ, thịt cá, trái cây tươi ngon mỗi ngày. Nguồn gốc rõ ràng, 
//                 chất lượng đảm bảo cho sức khỏe gia đình bạn.
//               </p>

//               <div className="flex flex-wrap gap-4">
//                 <Link
//                   to="/products"
//                   className="btn-primary inline-flex items-center gap-2 text-lg"
//                 >
//                   <span>Mua sắm ngay</span>
//                   <ArrowRight size={20} />
//                 </Link>
//                 <Link
//                   to="/about"
//                   className="btn-secondary inline-flex items-center gap-2 text-lg"
//                 >
//                   <span>Tìm hiểu thêm</span>
//                 </Link>
//               </div>

//               {/* Trust Badges */}
//               <div className="flex flex-wrap gap-6 pt-4">
//                 <div className="flex items-center gap-2">
//                   <div className="w-10 h-10 bg-fresh-100 rounded-full flex items-center justify-center">
//                     <Shield size={20} className="text-fresh-600" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-sm text-earth-900">100% Organic</p>
//                     <p className="text-xs text-earth-600">Chứng nhận VietGAP</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-10 h-10 bg-fresh-100 rounded-full flex items-center justify-center">
//                     <Truck size={20} className="text-fresh-600" />
//                   </div>
//                   <div>
//                     <p className="font-semibold text-sm text-earth-900">Giao hàng nhanh</p>
//                     <p className="text-xs text-earth-600">Trong vòng 2 giờ</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Image */}
//             <div className="relative animate-float">
//               <div className="relative z-10">
//                 <img
//                   src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800"
//                   alt="Fresh vegetables"
//                   className="rounded-3xl shadow-lift w-full"
//                 />
//               </div>
              
//               {/* Floating Elements */}
//               <div className="absolute -top-6 -right-6 w-32 h-32 bg-sunshine rounded-full opacity-20 blur-2xl" />
//               <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-fresh-400 rounded-full opacity-20 blur-2xl" />
              
//               {/* Stats Card */}
//               <div className="absolute bottom-8 left-8 glass rounded-2xl p-4 shadow-lift animate-slide-up" style={{ animationDelay: '0.3s' }}>
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 bg-fresh-600 rounded-full flex items-center justify-center">
//                     <TrendingUp size={24} className="text-white" />
//                   </div>
//                   <div>
//                     <p className="font-bold text-2xl text-earth-900">1000+</p>
//                     <p className="text-sm text-earth-600">Khách hàng hài lòng</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Categories Section */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="font-display text-4xl font-bold text-earth-900 mb-4">
//               Danh mục sản phẩm
//             </h2>
//             <p className="text-earth-600 text-lg">
//               Khám phá đa dạng thực phẩm tươi sạch cho bữa ăn gia đình
//             </p>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             {categories.map((category, index) => (
//               <Link
//                 key={category.id}
//                 to={`/products?category=${category.slug}`}
//                 className="card-organic p-6 text-center group hover:scale-105 transition-transform animate-slide-up"
//                 style={{ animationDelay: `${index * 0.1}s` }}
//               >
//                 <div className={`w-20 h-20 ${category.color} rounded-full mx-auto mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform`}>
//                   {category.icon}
//                 </div>
//                 <h3 className="font-display font-semibold text-lg text-earth-900 mb-2">
//                   {category.name}
//                 </h3>
//                 <p className="text-sm text-earth-600">{category.description}</p>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Featured Products */}
//       <section className="py-16 bg-gradient-to-b from-white to-fresh-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between mb-12">
//             <div>
//               <h2 className="font-display text-4xl font-bold text-earth-900 mb-2">
//                 Sản phẩm nổi bật
//               </h2>
//               <p className="text-earth-600 text-lg">
//                 Những món ăn được yêu thích nhất
//               </p>
//             </div>
//             <Link
//               to="/products"
//               className="btn-ghost inline-flex items-center gap-2"
//             >
//               <span>Xem tất cả</span>
//               <ArrowRight size={18} />
//             </Link>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {featuredProducts.map((product, index) => (
//               <div
//                 key={product.id}
//                 className="animate-slide-up"
//                 style={{ animationDelay: `${index * 0.1}s` }}
//               >
//                 <ProductCard product={product} />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* New Arrivals */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <div className="inline-flex items-center gap-2 px-4 py-2 bg-tangerine/10 rounded-full mb-4">
//               <Sparkles size={18} className="text-tangerine" />
//               <span className="text-sm font-semibold text-tangerine">Hàng mới về</span>
//             </div>
//             <h2 className="font-display text-4xl font-bold text-earth-900 mb-4">
//               Sản phẩm mới nhất
//             </h2>
//             <p className="text-earth-600 text-lg">
//               Cập nhật hàng ngày với những sản phẩm tươi ngon
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {newProducts.map((product) => (
//               <ProductCard key={product.id} product={product} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Newsletter */}
//       <section className="py-16 bg-gradient-to-br from-fresh-600 to-fresh-700">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="font-display text-4xl font-bold text-white mb-4">
//             Nhận ưu đãi đặc biệt
//           </h2>
//           <p className="text-fresh-100 text-lg mb-8">
//             Đăng ký email để nhận thông tin khuyến mãi và sản phẩm mới
//           </p>
//           <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
//             <input
//               type="email"
//               placeholder="Nhập email của bạn"
//               className="flex-1 px-6 py-4 rounded-full focus:outline-none focus:ring-4 focus:ring-white/30"
//             />
//             <button type="submit" className="px-8 py-4 bg-white text-fresh-600 rounded-full font-bold hover:bg-fresh-50 transition-colors">
//               Đăng ký
//             </button>
//           </form>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default HomePage;
import MainLayout from "../layouts/MainLayout";
import HeroBanner from "../components/home/HeroBanner";
import FeaturedProducts from "../components/home/FeaturedProducts";

const Home = () => {
  return (
    <MainLayout>
      <HeroBanner />
      <FeaturedProducts />

      <section className="section bg-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">
            Vì sao chọn chúng tôi?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-10">
            <div className="fresh-card p-8">
              <h3 className="text-xl font-semibold mb-3">
                100% Hữu cơ
              </h3>
              <p className="text-gray-600">
                Sản phẩm được tuyển chọn từ nông trại đạt chuẩn.
              </p>
            </div>

            <div className="fresh-card p-8">
              <h3 className="text-xl font-semibold mb-3">
                Giao nhanh 2h
              </h3>
              <p className="text-gray-600">
                Đảm bảo tươi ngon khi đến tay khách hàng.
              </p>
            </div>

            <div className="fresh-card p-8">
              <h3 className="text-xl font-semibold mb-3">
                Hoàn tiền 100%
              </h3>
              <p className="text-gray-600">
                Nếu sản phẩm không đạt chất lượng cam kết.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;


