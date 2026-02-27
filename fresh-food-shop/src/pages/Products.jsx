import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, AlertCircle } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import ProductCard from "../components/products/ProductCard";
import productService from "../services/productService";
import { CATEGORIES } from "../utils/constants";

function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    parseInt(params.get("category")) || null
  );
  const [searchQuery, setSearchQuery] = useState(params.get("search") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load categories & products
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load categories
        const categoriesRes = await productService.getCategories();
        if (categoriesRes.success) {
          setCategories(categoriesRes.data);
        }

        // Load products with filters
        const filters = {};
        if (selectedCategory) {
          filters.category = selectedCategory;
        }
        if (searchQuery) {
          filters.search = searchQuery;
        }

        const productsRes = await productService.getProducts(filters);
        if (productsRes.success) {
          setProducts(productsRes.data);
        } else {
          setError(productsRes.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCategory, searchQuery]);

  // Update URL when filters change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      navigate(`?category=${categoryId}`);
    } else {
      navigate("");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`?search=${searchQuery}`);
    }
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sản phẩm</h1>
            <p className="text-gray-600">Khám phá các sản phẩm tươi sạch của chúng tôi</p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <Search size={20} />
                Tìm
              </button>
            </div>
          </form>

          {/* Category Filter */}
          <div className="mb-8 sticky top-20 z-30 bg-white py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-gray-200">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`px-6 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                  !selectedCategory
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tất cả
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap font-semibold transition-all ${
                    selectedCategory === category.id
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} className="text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="mb-8">
                <p className="text-gray-600 text-sm">
                  Hiển thị {products.length} sản phẩm
                  {selectedCategory && ` trong danh mục`}
                  {searchQuery && ` cho "${searchQuery}"`}
                </p>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg mb-4">Không tìm thấy sản phẩm nào</p>
              <Link
                to="/products"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Products;