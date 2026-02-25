// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/common/Navbar';
// import ChatWidget from './components/chat/ChatWidget';
// import HomePage from './pages/Home';
// import { CartProvider } from './context/CartContext';

// // Placeholder components (to be created)
// const ProductsPage = () => <div className="min-h-screen pt-32 px-4"><h1 className="text-3xl font-bold">Products Page</h1></div>;
// const ProductDetailPage = () => <div className="min-h-screen pt-32 px-4"><h1 className="text-3xl font-bold">Product Detail Page</h1></div>;
// const CartPage = () => <div className="min-h-screen pt-32 px-4"><h1 className="text-3xl font-bold">Cart Page</h1></div>;
// const CheckoutPage = () => <div className="min-h-screen pt-32 px-4"><h1 className="text-3xl font-bold">Checkout Page</h1></div>;
// const LoginPage = () => <div className="min-h-screen pt-32 px-4"><h1 className="text-3xl font-bold">Login Page</h1></div>;
// const RegisterPage = () => <div className="min-h-screen pt-32 px-4"><h1 className="text-3xl font-bold">Register Page</h1></div>;
// const StaffDashboard = () => <div className="min-h-screen pt-32 px-4"><h1 className="text-3xl font-bold">Staff Dashboard</h1></div>;
// const ManagerDashboard = () => <div className="min-h-screen pt-32 px-4"><h1 className="text-3xl font-bold">Manager Dashboard</h1></div>;

// function App() {
//   return (
//     <CartProvider>
//       <Router>
//         <div className="min-h-screen bg-fresh-50">
//           <Navbar />
          
//           {/* Main Content */}
//           <main className="pt-24">
//             <Routes>
//               <Route path="/" element={<HomePage />} />
//               <Route path="/products" element={<ProductsPage />} />
//               <Route path="/products/:slug" element={<ProductDetailPage />} />
//               <Route path="/cart" element={<CartPage />} />
//               <Route path="/checkout" element={<CheckoutPage />} />
//               <Route path="/login" element={<LoginPage />} />
//               <Route path="/register" element={<RegisterPage />} />
//               <Route path="/admin/staff" element={<StaffDashboard />} />
//               <Route path="/admin/manager" element={<ManagerDashboard />} />
//             </Routes>
//           </main>

//           {/* AI Chat Widget */}
//           <ChatWidget />

//           {/* Footer */}
//           <footer className="bg-earth-900 text-white py-12 mt-20">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//                 <div>
//                   <h3 className="font-display font-bold text-xl mb-4 text-fresh-400">
//                     Fresh Market
//                   </h3>
//                   <p className="text-earth-300 text-sm">
//                     Thực phẩm tươi sạch, giao hàng tận nhà. 
//                     Chất lượng đảm bảo cho sức khỏe gia đình.
//                   </p>
//                 </div>
                
//                 <div>
//                   <h4 className="font-semibold mb-4">Sản phẩm</h4>
//                   <ul className="space-y-2 text-sm text-earth-300">
//                     <li><a href="/products?category=vegetables" className="hover:text-fresh-400">Rau củ</a></li>
//                     <li><a href="/products?category=meat" className="hover:text-fresh-400">Thịt tươi</a></li>
//                     <li><a href="/products?category=fruits" className="hover:text-fresh-400">Trái cây</a></li>
//                     <li><a href="/products?category=seafood" className="hover:text-fresh-400">Hải sản</a></li>
//                   </ul>
//                 </div>
                
//                 <div>
//                   <h4 className="font-semibold mb-4">Hỗ trợ</h4>
//                   <ul className="space-y-2 text-sm text-earth-300">
//                     <li><a href="/contact" className="hover:text-fresh-400">Liên hệ</a></li>
//                     <li><a href="/faq" className="hover:text-fresh-400">Câu hỏi thường gặp</a></li>
//                     <li><a href="/shipping" className="hover:text-fresh-400">Chính sách giao hàng</a></li>
//                     <li><a href="/returns" className="hover:text-fresh-400">Đổi trả hàng</a></li>
//                   </ul>
//                 </div>
                
//                 <div>
//                   <h4 className="font-semibold mb-4">Theo dõi chúng tôi</h4>
//                   <div className="flex gap-3">
//                     <a href="#" className="w-10 h-10 bg-earth-800 rounded-full flex items-center justify-center hover:bg-fresh-600 transition-colors">
//                       FB
//                     </a>
//                     <a href="#" className="w-10 h-10 bg-earth-800 rounded-full flex items-center justify-center hover:bg-fresh-600 transition-colors">
//                       IG
//                     </a>
//                     <a href="#" className="w-10 h-10 bg-earth-800 rounded-full flex items-center justify-center hover:bg-fresh-600 transition-colors">
//                       YT
//                     </a>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="border-t border-earth-800 mt-8 pt-8 text-center text-sm text-earth-400">
//                 © 2024 Fresh Market. All rights reserved.
//               </div>
//             </div>
//           </footer>
//         </div>
//       </Router>
//     </CartProvider>
//   );
// }

// export default App;
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import ChatWidget from "./components/chat/ChatWidget";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<MyOrders />} />
      </Routes>

      {/* Chat AI nổi toàn trang */}
      <ChatWidget />
    </>
  );
}

export default App;

