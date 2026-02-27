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
          console.log('Product loaded:', productRes.data.name, 'Reviews:', productRes.data.reviews?.length || 0);
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

    try {
      setSubmittingReview(true);
      const result = await productService.addReview(id, reviewForm);
      if (result.success) {
        alert("Cảm ơn bạn đã bình luận!");
        setReviewForm({ rating: 5, comment: "" });
        // Reload reviews
        const reviewsRes = await productService.getReviews(id);
        if (reviewsRes.success) {
          setReviews(reviewsRes.data);
        }
      } else {
        alert("Có lỗi khi gửi bình luận: " + result.error);
      }
    } catch (err) {
      alert("Có lỗi: " + err.message);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div>
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full rounded-lg shadow-lg object-cover h-96"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-gray-600">({reviews.length} bình luận)</span>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="mb-8">
              <p className="text-3xl font-bold text-green-600">
                {product.price?.toLocaleString?.() || 0}đ
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Tồn kho: {product.stock} sản phẩm
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.stock}
                  className="w-16 text-center border-none focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
              >
                <ShoppingCart size={20} />
                Thêm vào giỏ hàng
              </button>

              <button
                onClick={handleToggleWishlist}
                className="p-3 rounded-lg hover:bg-gray-100 transition"
                title={isInWishlist(product.id) ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
              >
                <Heart
                  size={24}
                  className={`transition-all ${
                    isInWishlist(product.id)
                      ? 'fill-red-600 text-red-600'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                />
              </button>
            </div>

            {product.stock === 0 && (
              <p className="text-red-600 font-semibold">Hiện tại hết hàng</p>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg p-8 mb-12 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Bình luận & Đánh giá
          </h2>

          {/* Add Review Form */}
          {isAuthenticated ? (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Viết bình luận của bạn</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đánh giá
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bình luận
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows="4"
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
              >
                {submittingReview ? "Đang gửi..." : "Gửi bình luận"}
              </button>
            </form>
          ) : (
            <p className="text-gray-600 mb-8 p-4 bg-blue-50 rounded-lg">
              Vui lòng <a href="/login" className="text-blue-600 hover:underline">đăng nhập</a> để bình luận
            </p>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="pb-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {review.user_username || "Ẩn danh"}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(review.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">Chưa có bình luận nào</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
