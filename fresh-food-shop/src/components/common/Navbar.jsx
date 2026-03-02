// import React, { useState, useEffect } from 'react';
// import { 
//   Search, ShoppingCart, User, Menu, X, 
//   Heart, MapPin, Phone, LogOut, Settings, Package 
// } from 'lucide-react';
// import { Link } from 'react-router-dom';


// const Navbar = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // Mock data - replace with actual context
//   const cartItemsCount = 3;
//   const isLoggedIn = true;
//   const userName = 'Nguyễn Văn A';

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     console.log('Search:', searchQuery);
//     // Implement search logic
//   };

//   return (
//     <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//       isScrolled ? 'glass shadow-lg py-2' : 'bg-white py-4'
//     }`}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Top Bar - Contact Info */}
//         <div className={`flex items-center justify-between text-sm text-earth-600 pb-3 border-b border-earth-200 transition-all ${
//           isScrolled ? 'hidden' : 'flex'
//         }`}>
//           <div className="flex items-center gap-6">
//             <div className="flex items-center gap-2">
//               <MapPin size={16} />
//               <span>Hà Tĩnh, Việt Nam</span>
//             </div>
//             <div className="hidden md:flex items-center gap-2">
//               <Phone size={16} />
//               <span>1900-xxxx</span>
//             </div>
//           </div>
//           <div className="text-fresh-600 font-medium">
//             🎉 Miễn phí vận chuyển cho đơn hàng từ 200.000đ
//           </div>
//         </div>

//         {/* Main Navbar */}
//         <div className="flex items-center justify-between pt-3">
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-3 group">
//             <div className="relative">
//               <div className="w-12 h-12 bg-gradient-to-br from-fresh-400 to-fresh-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
//                 <span className="text-2xl">🌱</span>
//               </div>
//               <div className="absolute -top-1 -right-1 w-3 h-3 bg-sunshine rounded-full animate-pulse"></div>
//             </div>
//             <div>
//               <h1 className="font-display font-bold text-xl text-gradient">Fresh Market</h1>
//               <p className="text-xs text-earth-500">Thực phẩm tươi sạch</p>
//             </div>
//           </Link>

//           {/* Search Bar - Desktop */}
//           <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
//             <div className="relative w-full group">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400 group-focus-within:text-fresh-600 transition-colors" size={20} />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Tìm kiếm sản phẩm tươi ngon..."
//                 className="w-full pl-12 pr-4 py-3 bg-earth-50 border-2 border-transparent rounded-full 
//                          focus:bg-white focus:border-fresh-400 focus:outline-none focus:ring-2 focus:ring-fresh-200
//                          transition-all duration-200"
//               />
//               {searchQuery && (
//                 <button
//                   type="button"
//                   onClick={() => setSearchQuery('')}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600"
//                 >
//                   <X size={18} />
//                 </button>
//               )}
//             </div>
//           </form>

//           {/* Action Buttons */}
//           <div className="flex items-center gap-2">
//             {/* Wishlist - Desktop */}
//             <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full hover:bg-earth-100 transition-colors group">
//               <Heart className="group-hover:fill-fresh-500 group-hover:text-fresh-500 transition-all" size={20} />
//               <span className="text-sm font-medium">Yêu thích</span>
//             </button>

//             {/* Cart */}
//             <Link to="/cart" className="relative px-4 py-2 rounded-full hover:bg-earth-100 transition-colors group">
//               <ShoppingCart className="group-hover:text-fresh-600 transition-colors" size={20} />
//               {cartItemsCount > 0 && (
//                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-tangerine text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
//                   {cartItemsCount}
//                 </span>
//               )}
//             </Link>

//             {/* User Menu */}
//             <div className="relative">
//               <button
//                 onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
//                 className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-earth-100 transition-colors"
//               >
//                 <div className="w-8 h-8 bg-gradient-to-br from-fresh-400 to-fresh-600 rounded-full flex items-center justify-center text-white font-semibold">
//                   {isLoggedIn ? userName.charAt(0).toUpperCase() : <User size={18} />}
//                 </div>
//                 <span className="hidden lg:block text-sm font-medium">{isLoggedIn ? userName : 'Đăng nhập'}</span>
//               </button>

//               {/* User Dropdown */}
//               {isUserMenuOpen && (
//                 <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lift border border-earth-100 py-2 animate-slide-up">
//                   {isLoggedIn ? (
//                     <>
//                       <div className="px-4 py-3 border-b border-earth-100">
//                         <p className="font-semibold text-earth-900">{userName}</p>
//                         <p className="text-sm text-earth-500">user@email.com</p>
//                       </div>
//                       <Link to="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-earth-50 transition-colors">
//                         <User size={18} className="text-earth-600" />
//                         <span>Tài khoản của tôi</span>
//                       </Link>
//                       <Link to="/orders" className="flex items-center gap-3 px-4 py-2 hover:bg-earth-50 transition-colors">
//                         <Package size={18} className="text-earth-600" />
//                         <span>Đơn hàng</span>
//                       </Link>
//                       <Link to="/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-earth-50 transition-colors">
//                         <Settings size={18} className="text-earth-600" />
//                         <span>Cài đặt</span>
//                       </Link>
//                       <button className="flex items-center gap-3 px-4 py-2 hover:bg-earth-50 transition-colors w-full text-red-600">
//                         <LogOut size={18} />
//                         <span>Đăng xuất</span>
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <Link to="/login" className="block px-4 py-2 hover:bg-earth-50 transition-colors">
//                         Đăng nhập
//                       </Link>
//                       <Link to="/register" className="block px-4 py-2 hover:bg-earth-50 transition-colors">
//                         Đăng ký
//                       </Link>
//                     </>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Mobile Menu Toggle */}
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="md:hidden p-2 rounded-lg hover:bg-earth-100"
//             >
//               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* Categories - Desktop */}
//         <div className="hidden md:flex items-center justify-center gap-6 pt-4 border-t border-earth-200 mt-4">
//           <Link to="/products?category=vegetables" className="text-sm font-medium text-earth-700 hover:text-fresh-600 transition-colors">
//             🥬 Rau Củ
//           </Link>
//           <Link to="/products?category=meat" className="text-sm font-medium text-earth-700 hover:text-fresh-600 transition-colors">
//             🥩 Thịt Tươi
//           </Link>
//           <Link to="/products?category=fruits" className="text-sm font-medium text-earth-700 hover:text-fresh-600 transition-colors">
//             🍎 Trái Cây
//           </Link>
//           <Link to="/products?category=seafood" className="text-sm font-medium text-earth-700 hover:text-fresh-600 transition-colors">
//             🦐 Hải Sản
//           </Link>
//           <Link to="/products?category=dairy" className="text-sm font-medium text-earth-700 hover:text-fresh-600 transition-colors">
//             🥚 Trứng & Sữa
//           </Link>
//           <Link to="/products?category=spices" className="text-sm font-medium text-earth-700 hover:text-fresh-600 transition-colors">
//             🌶️ Gia Vị
//           </Link>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden bg-white border-t border-earth-200 animate-slide-up">
//           {/* Mobile Search */}
//           <div className="px-4 py-4">
//             <form onSubmit={handleSearch}>
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" size={20} />
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Tìm kiếm..."
//                   className="w-full pl-12 pr-4 py-3 bg-earth-50 rounded-full focus:outline-none focus:ring-2 focus:ring-fresh-400"
//                 />
//               </div>
//             </form>
//           </div>

//           {/* Mobile Categories */}
//           <div className="px-4 pb-4 space-y-2">
//             <Link to="/products?category=vegetables" className="block py-2 text-earth-700 hover:text-fresh-600">
//               🥬 Rau Củ
//             </Link>
//             <Link to="/products?category=meat" className="block py-2 text-earth-700 hover:text-fresh-600">
//               🥩 Thịt Tươi
//             </Link>
//             <Link to="/products?category=fruits" className="block py-2 text-earth-700 hover:text-fresh-600">
//               🍎 Trái Cây
//             </Link>
//             <Link to="/products?category=seafood" className="block py-2 text-earth-700 hover:text-fresh-600">
//               🦐 Hải Sản
//             </Link>
//             <Link to="/products?category=dairy" className="block py-2 text-earth-700 hover:text-fresh-600">
//               🥚 Trứng & Sữa
//             </Link>
//             <Link to="/products?category=spices" className="block py-2 text-earth-700 hover:text-fresh-600">
//               🌶️ Gia Vị
//             </Link>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container-custom py-4 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold text-primary whitespace-nowrap">
          🌱Fresh Market
        </Link>

        {/* Search Button */}
        <button
          onClick={() => navigate("/products?search=")}
          className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium whitespace-nowrap ml-4"
        >
          🔍 Tìm kiếm sản phẩm
        </button>


        {/* Navigation */}
        <nav className="flex items-center gap-8 whitespace-nowrap ml-auto">

          <Link to="/products" className="hover:text-primary transition font-medium">
            Sản phẩm
          </Link>

          <Link to="/cart" className="relative hover:text-primary transition font-medium">
            Giỏ hàng
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Tài khoản"
              >
                <span className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm">
                  {(user.name || user.email || "U").charAt(0).toUpperCase()}
                </span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-800 truncate">{user.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    Tài khoản
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    Đơn hàng của tôi
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    ❤️ Danh sách yêu thích ({wishlistItems.length})
                  </Link>
                  <button
                    type="button"
                    onClick={() => { logout(); setProfileOpen(false); navigate("/"); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-outline">
              Đăng nhập
            </Link>
          )}

        </nav>
      </div>
    </header>
  );
};

export default Navbar;





