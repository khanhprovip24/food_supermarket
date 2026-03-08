import PropTypes from "prop-types";

/**
 * ProductSuggestionCard component to display product information in chat
 * @param {Object} props
 * @param {Object} props.product - Product object
 */
const ProductSuggestionCard = ({ product }) => {
  const { name, price, category, available } = product;

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-green-100 hover:border-green-300 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-gray-900">{name}</h4>
          
          {category && (
            <p className="text-xs text-gray-500 mt-0.5">{category}</p>
          )}
          
          {price && (
            <p className="text-green-600 font-bold text-sm mt-1">{price}</p>
          )}
        </div>

        {/* Availability Badge */}
        {available !== undefined && (
          <div className="ml-3">
            {available ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✓ Còn hàng
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Hết hàng
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

ProductSuggestionCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.string,
    category: PropTypes.string,
    available: PropTypes.bool,
  }).isRequired,
};

export default ProductSuggestionCard;
