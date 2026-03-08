import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader } from 'lucide-react';
import { sendChatToBotAPI } from '../../services/chatbotService';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Xin chào! 👋 Tôi là **Fresh AI** - trợ lý thông minh của bạn. Mình có thể giúp:\n\n📚 Tư vấn dinh dưỡng\n🍳 Chia sẻ công thức\n🛒 Tìm sản phẩm\n💬 Trả lời câu hỏi\n\nBạn cần hỗ trợ gì?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const botResponse = await sendChatToBotAPI(currentInput);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: botResponse,
        timestamp: new Date().toISOString(),
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        text: '❌ Lỗi kết nối. Kiểm tra n8n đang chạy chưa?',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { label: 'Dinh dưỡng', icon: '🥗', query: 'Tư vấn dinh dưỡng cho tôi' },
    { label: 'Công thức', icon: '👨‍🍳', query: 'Bạn có công thức nấu ăn nào không?' },
    { label: 'Khuyến mãi', icon: '🏷️', query: 'Sản phẩm khuyến mãi hôm nay là gì?' },
    { label: 'Hỗ trợ', icon: '💬', query: 'Cách liên hệ hỗ trợ khách hàng?' },
  ];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-110"
        >
          <MessageCircle size={32} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 w-96 h-[550px] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden z-50 border border-gray-200">
          
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle size={24} />
              <h3 className="font-semibold text-lg">Fresh AI</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 w-8 h-8 rounded flex items-center justify-center transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 1 && (
              <div className="text-center text-gray-500 text-xs mt-2">
                Xin chào! Tôi có thể giúp gì cho bạn?
              </div>
            )}
            
            {messages.map((message) => (
              <div key={message.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {message.type === 'bot' ? (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <div className="max-w-xs bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="max-w-xs bg-blue-600 text-white rounded-lg p-3 shadow-sm">
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Loader size={16} className="text-white animate-spin" />
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Gõ tin nhắn..."
                disabled={isTyping}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;

