import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Star, AlertCircle, ShoppingCart, Heart } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import productService from "../services/productService";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load product detail (which includes reviews)
        const productRes = await productService.getProductDetail(id);
        if (productRes.success) {
          setProduct(productRes.data);
          // Use reviews from product detail response
          setReviews(productRes.data.reviews || []);
          console.log('Product loaded:', productRes.data.name);
          console.log('Total reviews:', productRes.data.reviews?.length || 0);
          console.log('All reviews:', productRes.data.reviews);
        } else {
          setError(productRes.error);
          console.error('Product detail error:', productRes.error);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProductData();
    }
  }, [id]);

  const loadReviews = async () => {
    // Load full product detail to get all reviews (not just the /reviews endpoint)
    // This ensures we get all reviews since ProductDetailSerializer includes all of them
    setLoadingReviews(true);
    setReviewError(null);
    try {
      const productRes = await productService.getProductDetail(id);
      if (productRes.success) {
        setReviews(productRes.data.reviews || []);
        console.log('Reviews reloaded. Total:', productRes.data.reviews?.length || 0);
      } else {
        setReviewError(productRes.error);
      }
    } catch (err) {
      setReviewError("Có lỗi xảy ra khi tải bình luận.");
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadReviews();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setQuantity(1); // Reset quantity
      alert(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      return;
    }

    await toggleWishlist(product.id);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để bình luận");
      return;
    }

    if (!id) {
      alert("Không tìm thấy sản phẩm để bình luận.");
      return;
    }

    try {
      setSubmittingReview(true);
      const result = await productService.addReview(id, reviewForm);
      if (result.success) {
        setReviewForm({ rating: 5, comment: "" });
        loadReviews(); // Reload reviews after successful submission
      } else {
        setReviewError(result.error);
      }
    } catch (err) {
      setReviewError("Có lỗi xảy ra khi gửi bình luận.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300 rounded-lg"></div>
              <div>
                <div className="h-8 bg-gray-300 mb-4 w-3/4"></div>
                <div className="h-6 bg-gray-300 mb-4 w-1/2"></div>
                <div className="h-4 bg-gray-300 mb-2"></div>
                <div className="h-12 bg-gray-300 mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertCircle size={20} />
            <span>{error || "Sản phẩm không tồn tại"}</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  const imageUrl = productService.getImageUrl(product.image);
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <a href="/" className="hover:text-green-600">Trang chủ</a>
          <span>/</span>
          <a href="/products" className="hover:text-green-600">Sản phẩm</a>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        {/* Product Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Image - Enhanced */}
          <div className="flex flex-col gap-4">
            <div className="bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            {/* Stock Status */}
            <div className="flex items-center gap-3">
              {product.stock > 0 ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Còn hàng ({product.stock} sản phẩm)</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Hết hàng</span>
                </>
              )}
            </div>
          </div>

          {/* Product Info - Enhanced */}
          <div>
            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase">
                {product.category_name || 'Thực phẩm tươi'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-lg font-bold text-gray-900">{avgRating}</span>
              </div>
              <span className="text-sm text-gray-600">({reviews.length} đánh giá)</span>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6 leading-relaxed text-base">
              {product.description}
            </p>

            {/* Price Section */}
            <div className="mb-8 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Giá bán</p>
              <p className="text-4xl font-bold text-green-600 mb-2">
                {Math.round(product.price)?.toLocaleString?.() || 0}đ
              </p>
              <p className="text-xs text-gray-600">
                ✓ Giá đã bao gồm VAT | ✓ Hàng chính hãng 100%
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col md:flex-row gap-3 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 font-semibold text-lg"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.stock}
                  className="w-20 text-center border-none focus:outline-none font-semibold"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-100 font-semibold text-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
              >
                <ShoppingCart size={22} />
                {product.stock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
              </button>

              <button
                onClick={handleToggleWishlist}
                className="px-6 py-3 rounded-lg hover:bg-gray-100 transition border border-gray-300 font-semibold flex items-center justify-center gap-2"
                title={isInWishlist(product.id) ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
              >
                <Heart
                  size={22}
                  className={`transition-all ${
                    isInWishlist(product.id)
                      ? 'fill-red-600 text-red-600'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                />
                <span className="hidden sm:inline">
                  {isInWishlist(product.id) ? 'Thích' : 'Thêm yêu thích'}
                </span>
              </button>
            </div>

            {product.stock === 0 && (
              <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-semibold">⚠️ Sản phẩm hiện tại không còn hàng</p>
                <p className="text-sm text-red-600 mt-1">Vui lòng quay lại sau hoặc liên hệ chúng tôi để được cập nhật</p>
              </div>
            )}
          </div>
        </div>

        {/* Product Information Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Details */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Thông tin sản phẩm</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Danh mục</span>
                <span className="font-semibold text-gray-900">{product.category_name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Tồn kho</span>
                <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} sản phẩm` : 'Hết hàng'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Đánh giá</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900">{avgRating}/5</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Số bình luận</span>
                <span className="font-semibold text-gray-900">{reviews.length}</span>
              </div>
            </div>
          </div>

          {/* Benefits/Features */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">✨ Đặc điểm nổi bật</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-lg">✓</span>
                <span className="text-gray-700">Hàng tươi sống, bảo quản lạnh tối ưu</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-lg">✓</span>
                <span className="text-gray-700">Được chọn lọc kỹ, chất lượng cao</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-lg">✓</span>
                <span className="text-gray-700">Giao hàng nhanh, an toàn</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-lg">✓</span>
                <span className="text-gray-700">Hỗ trợ khách hàng 24/7</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-lg">✓</span>
                <span className="text-gray-700">Giá cạnh tranh, uy tín</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg p-6 mb-12 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Bình luận & Đánh giá
          </h2>

          {/* Overall Rating Summary - Compact */}
          {reviews.length > 0 && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Rating Display */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                  </div>
                  <div className="flex justify-center gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    {reviews.length} đánh giá
                  </p>
                </div>

                {/* Rating Breakdown - Compact */}
                <div className="md:col-span-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviews.filter((r) => r.rating === rating).length;
                    const percentage = (count / reviews.length) * 100;
                    return (
                      <div key={rating} className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-600 w-6">{rating}⭐</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-yellow-400 h-1.5 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-6 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {loadingReviews ? (
            <p className="text-gray-600 text-center py-4 text-sm">Đang tải bình luận...</p>
          ) : reviewError ? (
            <p className="text-red-600 text-center py-4 text-sm">{reviewError}</p>
          ) : (
            <>
              {/* Add Review Form - Compact */}
              {isAuthenticated ? (
                <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">✍️ Viết bình luận</h3>

                  <div className="mb-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Đánh giá
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="focus:outline-none transform hover:scale-110 transition-transform"
                          title={`${star} sao`}
                        >
                          <Star
                            size={20}
                            className={`${
                              star <= reviewForm.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-300'
                            } transition-all`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      rows="2"
                      placeholder="Chia sẻ trải nghiệm của bạn..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview || !reviewForm.comment.trim()}
                    className="w-full px-4 py-2 text-sm bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? '⏳ Đang gửi...' : '📤 Gửi bình luận'}
                  </button>
                </form>
              ) : (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center text-sm">
                  <p className="text-gray-700 mb-2">
                    Vui lòng <a href="/login" className="text-blue-600 font-semibold hover:underline">đăng nhập</a> để viết bình luận
                  </p>
                </div>
              )}

              {/* Reviews List - Compact */}
              {reviews.length > 0 ? (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">
                    💬 Bình luận khách hàng ({reviews.length})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-3 bg-gray-50 rounded hover:bg-gray-100 transition text-sm">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-0.5">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={12}
                                    className={`${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-semibold text-gray-700">
                                {review.rating}⭐
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-gray-900 truncate">
                              {review.user_username || "Ẩn danh"}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 whitespace-nowrap">
                            {new Date(review.created_at).toLocaleDateString('vi-VN', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <p className="text-gray-700 line-clamp-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4 text-sm">
                  😶 Chưa có bình luận nào
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
