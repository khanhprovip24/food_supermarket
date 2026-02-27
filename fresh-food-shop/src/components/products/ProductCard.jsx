// import React, { useState } from 'react';
// import { ShoppingCart, Heart, Star, Eye, TrendingUp } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const ProductCard = ({ product, onAddToCart, onToggleWishlist }) => {
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [imageLoaded, setImageLoaded] = useState(false);

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND',
//     }).format(price);
//   };

//   const calculateDiscountPercent = () => {
//     if (product.originalPrice && product.price < product.originalPrice) {
//       return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
//     }
//     return 0;
//   };

//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     onAddToCart?.(product);
    
//     // Add animation feedback
//     e.currentTarget.classList.add('scale-90');
//     setTimeout(() => {
//       e.currentTarget.classList.remove('scale-90');
//     }, 200);
//   };

//   const handleToggleWishlist = (e) => {
//     e.preventDefault();
//     setIsWishlisted(!isWishlisted);
//     onToggleWishlist?.(product);
//   };

//   const discountPercent = calculateDiscountPercent();

//   return (
//     <Link 
//       to={`/products/${product.slug}`}
//       className="group product-card card-organic overflow-hidden block"
//     >
//       {/* Image Container */}
//       <div className="relative overflow-hidden rounded-t-3xl bg-earth-100 aspect-square">
//         {/* Image */}
//         <img
//           src={product.image}
//           alt={product.name}
//           onLoad={() => setImageLoaded(true)}
//           className={`product-card-image w-full h-full object-cover transition-opacity duration-300 ${
//             imageLoaded ? 'opacity-100' : 'opacity-0'
//           }`}
//         />
        
//         {/* Loading Skeleton */}
//         {!imageLoaded && (
//           <div className="absolute inset-0 bg-gradient-to-r from-earth-200 via-earth-100 to-earth-200 animate-pulse" />
//         )}

//         {/* Badges */}
//         <div className="absolute top-3 left-3 flex flex-col gap-2">
//           {product.isNew && (
//             <span className="badge bg-tangerine text-white font-semibold px-3 py-1">
//               Mới
//             </span>
//           )}
//           {discountPercent > 0 && (
//             <span className="badge bg-red-500 text-white font-semibold px-3 py-1">
//               -{discountPercent}%
//             </span>
//           )}
//           {product.stock < 10 && product.stock > 0 && (
//             <span className="badge bg-yellow-500 text-white font-semibold px-3 py-1">
//               Sắp hết
//             </span>
//           )}
//           {product.stock === 0 && (
//             <span className="badge bg-earth-500 text-white font-semibold px-3 py-1">
//               Hết hàng
//             </span>
//           )}
//         </div>

//         {/* Wishlist Button */}
//         <button
//           onClick={handleToggleWishlist}
//           className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full 
//                    flex items-center justify-center shadow-md hover:scale-110 transition-transform
//                    opacity-0 group-hover:opacity-100"
//         >
//           <Heart
//             size={20}
//             className={`transition-all ${
//               isWishlisted ? 'fill-red-500 text-red-500' : 'text-earth-600'
//             }`}
//           />
//         </button>

//         {/* Quick View Button */}
//         <button
//           onClick={(e) => {
//             e.preventDefault();
//             console.log('Quick view:', product.name);
//           }}
//           className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full 
//                    flex items-center justify-center shadow-md hover:scale-110 transition-transform
//                    opacity-0 group-hover:opacity-100"
//         >
//           <Eye size={20} className="text-earth-600" />
//         </button>

//         {/* Overlay on hover */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//       </div>

//       {/* Content */}
//       <div className="p-4">
//         {/* Category & Rating */}
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-xs text-earth-500 uppercase tracking-wide font-medium">
//             {product.category}
//           </span>
//           <div className="flex items-center gap-1">
//             <Star size={14} className="fill-sunshine text-sunshine" />
//             <span className="text-sm font-semibold text-earth-700">{product.rating}</span>
//             <span className="text-xs text-earth-400">({product.reviewCount})</span>
//           </div>
//         </div>

//         {/* Product Name */}
//         <h3 className="font-display font-semibold text-lg text-earth-900 mb-2 line-clamp-2 group-hover:text-fresh-600 transition-colors">
//           {product.name}
//         </h3>

//         {/* Tags */}
//         {product.tags && product.tags.length > 0 && (
//           <div className="flex flex-wrap gap-1 mb-3">
//             {product.tags.slice(0, 2).map((tag, index) => (
//               <span
//                 key={index}
//                 className="text-xs px-2 py-1 bg-fresh-50 text-fresh-700 rounded-full"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>
//         )}

//         {/* Price & Stock */}
//         <div className="flex items-center justify-between mb-3">
//           <div>
//             <div className="flex items-baseline gap-2">
//               <span className="font-display font-bold text-xl text-fresh-600">
//                 {formatPrice(product.price)}
//               </span>
//               {product.originalPrice && (
//                 <span className="text-sm text-earth-400 line-through">
//                   {formatPrice(product.originalPrice)}
//                 </span>
//               )}
//             </div>
//             <span className="text-xs text-earth-500">/{product.unit}</span>
//           </div>
          
//           {/* Stock Badge */}
//           <div className="text-right">
//             {product.stock > 0 ? (
//               <div className="flex items-center gap-1 text-xs text-earth-500">
//                 <TrendingUp size={14} className="text-fresh-500" />
//                 <span>Còn {product.stock}</span>
//               </div>
//             ) : (
//               <span className="text-xs text-red-500 font-medium">Hết hàng</span>
//             )}
//           </div>
//         </div>

//         {/* Add to Cart Button */}
//         <button
//           onClick={handleAddToCart}
//           disabled={product.stock === 0}
//           className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 
//                     transition-all duration-200 ${
//             product.stock > 0
//               ? 'bg-fresh-600 text-white hover:bg-fresh-700 active:scale-95'
//               : 'bg-earth-200 text-earth-400 cursor-not-allowed'
//           }`}
//         >
//           <ShoppingCart size={18} />
//           <span>{product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}</span>
//         </button>
//       </div>

//       {/* Featured Indicator */}
//       {product.isFeatured && (
//         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fresh-400 via-sunshine to-fresh-400" />
//       )}
//     </Link>
//   );
// };

// export default ProductCard;

import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import productService from "../../services/productService";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) return;

    addToCart(product);
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);

    e.currentTarget.classList.add('scale-90');
    setTimeout(() => {
      e.currentTarget.classList.remove('scale-90');
    }, 200);
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      return;
    }

    await toggleWishlist(product.id);
  };

  const imageUrl = productService.getImageUrl(product.image);
  const inWishlist = isInWishlist(product.id);

  return (
    <Link
      to={`/products/${product.id}`}
      className="group overflow-hidden block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        <img
          src={imageUrl}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            console.error('Image load failed:', imageUrl, 'Product:', product);
            setImageLoaded(true);
          }}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        )}

        {/* Stock Badge */}
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-yellow-500 text-white font-semibold px-3 py-1 rounded text-xs">
              Sắp hết
            </span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white font-semibold px-3 py-1 rounded text-xs">
              Hết hàng
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full 
          flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all z-10"
          title={inWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart
            size={20}
            className={`transition-all ${
              inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          />
        </button>

        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-bold text-xl text-green-600">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="text-right">
            {product.stock > 0 ? (
              <span className="text-xs text-gray-600">
                Còn {product.stock}
              </span>
            ) : (
              <span className="text-xs text-red-600 font-medium">
                Hết hàng
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 
          transition-all duration-200 ${
            product.stock > 0
              ? 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart size={18} />
          <span>
            {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
          </span>
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
