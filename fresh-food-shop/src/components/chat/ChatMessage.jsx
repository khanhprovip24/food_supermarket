import PropTypes from "prop-types";
import ProductSuggestionCard from "./ProductSuggestionCard";

/**
 * ChatMessage component to display individual messages
 * @param {Object} props
 * @param {Object} props.message - Message object
 */
const ChatMessage = ({ message }) => {
  const { text, sender, timestamp, products } = message;
  const isBot = sender === "bot";

  const formatTime = (ts) => {
    return new Date(ts).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isBot) {
    return (
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm">🤖</span>
        </div>
        <div className="flex-1 max-w-[80%]">
          <div className="bg-white rounded-xl rounded-tl-none px-4 py-3 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
              {text}
            </p>
          </div>

          {/* Product Suggestions */}
          {products && products.length > 0 && (
            <div className="mt-2 space-y-2">
              {products.map((product, index) => (
                <ProductSuggestionCard key={index} product={product} />
              ))}
            </div>
          )}

          <span className="text-xs text-gray-400 mt-1 block">
            {formatTime(timestamp)}
          </span>
        </div>
      </div>
    );
  }

  // User message
  return (
    <div className="flex items-start gap-2 justify-end">
      <div className="flex-1 max-w-[80%] flex flex-col items-end">
        <div className="bg-green-600 rounded-xl rounded-tr-none px-4 py-3 shadow-sm">
          <p className="text-sm text-white leading-relaxed">{text}</p>
        </div>
        <span className="text-xs text-gray-400 mt-1 block">
          {formatTime(timestamp)}
        </span>
      </div>
      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm">👤</span>
      </div>
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    sender: PropTypes.oneOf(["user", "bot"]).isRequired,
    timestamp: PropTypes.number.isRequired,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        price: PropTypes.string,
        category: PropTypes.string,
        available: PropTypes.bool,
      })
    ),
  }).isRequired,
};

export default ChatMessage;
