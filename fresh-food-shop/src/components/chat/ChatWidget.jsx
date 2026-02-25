// import React, { useState, useRef, useEffect } from 'react';
// import { MessageCircle, X, Send, Bot, User, Sparkles, ShoppingBag } from 'lucide-react';

// const ChatWidget = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       type: 'bot',
//       text: 'Xin chào! Tôi là trợ lý AI của Fresh Market. Tôi có thể giúp bạn tìm kiếm sản phẩm, tư vấn dinh dưỡng, hoặc giải đáp thắc mắc. Bạn cần hỗ trợ gì hôm nay? 🌱',
//       timestamp: new Date().toISOString(),
//     },
//   ]);
//   const [inputValue, setInputValue] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Focus input when chat opens
//   useEffect(() => {
//     if (isOpen) {
//       inputRef.current?.focus();
//     }
//   }, [isOpen]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!inputValue.trim()) return;

//     // Add user message
//     const userMessage = {
//       id: Date.now(),
//       type: 'user',
//       text: inputValue,
//       timestamp: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputValue('');
//     setIsTyping(true);

//     // Simulate AI response (replace with actual API call)
//     setTimeout(() => {
//       const botResponse = generateBotResponse(inputValue);
//       setMessages((prev) => [...prev, botResponse]);
//       setIsTyping(false);
//     }, 1500);
//   };

//   // Mock AI response generator
//   const generateBotResponse = (userInput) => {
//     const input = userInput.toLowerCase();
    
//     let responseText = '';
//     let productSuggestions = null;

//     if (input.includes('rau') || input.includes('củ')) {
//       responseText = 'Chúng tôi có nhiều loại rau củ tươi ngon! Tôi gợi ý cho bạn những sản phẩm phổ biến nhất:';
//       productSuggestions = [
//         { id: 1, name: 'Cải Xanh Hữu Cơ', price: 15000, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200' },
//         { id: 2, name: 'Cà Chua Bi Cherry', price: 35000, image: 'https://images.unsplash.com/photo-1546470427-227e9e3c1b48?w=200' },
//       ];
//     } else if (input.includes('thịt')) {
//       responseText = 'Thịt tươi sạch của chúng tôi đều từ nguồn VietGAP. Đây là những lựa chọn tốt:';
//       productSuggestions = [
//         { id: 4, name: 'Thịt Ba Chỉ Heo', price: 120000, image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=200' },
//         { id: 5, name: 'Ức Gà Không Xương', price: 95000, image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=200' },
//       ];
//     } else if (input.includes('giá') || input.includes('rẻ')) {
//       responseText = 'Chúng tôi có nhiều sản phẩm đang khuyến mãi với giá tốt. Để xem tất cả, bạn có thể vào mục "Khuyến mãi" nhé!';
//     } else if (input.includes('dinh dưỡng') || input.includes('vitamin')) {
//       responseText = 'Tôi khuyên bạn nên ăn đa dạng các loại rau củ, trái cây để đảm bảo cung cấp đủ vitamin và khoáng chất. Rau xanh giàu vitamin K, C, còn cam quýt giàu vitamin C. Bạn muốn tìm hiểu về loại thực phẩm nào cụ thể?';
//     } else {
//       responseText = 'Cảm ơn bạn đã liên hệ! Tôi có thể giúp bạn:\n\n✅ Tìm kiếm sản phẩm theo nhu cầu\n✅ Tư vấn dinh dưỡng\n✅ Kiểm tra đơn hàng\n✅ Hướng dẫn đặt hàng\n\nBạn cần hỗ trợ gì nhé?';
//     }

//     return {
//       id: Date.now(),
//       type: 'bot',
//       text: responseText,
//       productSuggestions,
//       timestamp: new Date().toISOString(),
//     };
//   };

//   const quickActions = [
//     { label: 'Sản phẩm khuyến mãi', icon: '🏷️' },
//     { label: 'Rau củ hữu cơ', icon: '🥬' },
//     { label: 'Thịt tươi sạch', icon: '🥩' },
//     { label: 'Kiểm tra đơn hàng', icon: '📦' },
//   ];

//   return (
//     <>
//       {/* Floating Chat Button */}
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-fresh-500 to-fresh-600 
//                    rounded-full shadow-lift hover:shadow-xl hover:scale-110 transition-all duration-300
//                    flex items-center justify-center text-white z-50 group"
//         >
//           <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
          
//           {/* Notification Pulse */}
//           <span className="absolute -top-1 -right-1 w-4 h-4 bg-tangerine rounded-full animate-pulse" />
          
//           {/* Floating Sparkles */}
//           <Sparkles 
//             size={16} 
//             className="absolute -top-2 -left-2 text-sunshine animate-pulse" 
//           />
//         </button>
//       )}

//       {/* Chat Window */}
//       {isOpen && (
//         <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-3xl shadow-2xl 
//                       flex flex-col overflow-hidden z-50 animate-slide-up border border-fresh-100">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-fresh-500 to-fresh-600 p-4 flex items-center justify-between text-white">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
//                 <Bot size={24} />
//               </div>
//               <div>
//                 <h3 className="font-display font-bold">Fresh AI Assistant</h3>
//                 <div className="flex items-center gap-1 text-xs text-white/80">
//                   <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
//                   <span>Online - sẵn sàng hỗ trợ</span>
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={() => setIsOpen(false)}
//               className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           {/* Quick Actions */}
//           <div className="p-3 border-b border-earth-100 bg-fresh-50/50">
//             <div className="flex gap-2 overflow-x-auto scrollbar-hide">
//               {quickActions.map((action, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setInputValue(action.label)}
//                   className="flex-shrink-0 px-3 py-2 bg-white rounded-full text-sm font-medium
//                            hover:bg-fresh-100 transition-colors flex items-center gap-2 border border-fresh-200"
//                 >
//                   <span>{action.icon}</span>
//                   <span className="whitespace-nowrap">{action.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Messages Container */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-custom bg-gradient-to-b from-fresh-50/30 to-white">
//             {messages.map((message) => (
//               <div key={message.id} className="chat-message-enter">
//                 {message.type === 'bot' ? (
//                   <div className="flex gap-2">
//                     <div className="w-8 h-8 bg-gradient-to-br from-fresh-400 to-fresh-600 rounded-full flex items-center justify-center flex-shrink-0">
//                       <Bot size={18} className="text-white" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-earth-100">
//                         <p className="text-sm text-earth-800 whitespace-pre-line leading-relaxed">
//                           {message.text}
//                         </p>
//                       </div>
                      
//                       {/* Product Suggestions */}
//                       {message.productSuggestions && (
//                         <div className="mt-2 space-y-2">
//                           {message.productSuggestions.map((product) => (
//                             <div key={product.id} className="bg-white rounded-xl p-3 shadow-sm border border-fresh-100 flex items-center gap-3 hover:border-fresh-300 transition-colors cursor-pointer">
//                               <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover" />
//                               <div className="flex-1">
//                                 <h4 className="font-semibold text-sm text-earth-900">{product.name}</h4>
//                                 <p className="text-fresh-600 font-bold text-sm">
//                                   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
//                                 </p>
//                               </div>
//                               <ShoppingBag size={18} className="text-fresh-600" />
//                             </div>
//                           ))}
//                         </div>
//                       )}
                      
//                       <span className="text-xs text-earth-400 mt-1 block">
//                         {new Date(message.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
//                       </span>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex gap-2 justify-end">
//                     <div className="flex-1 max-w-[80%]">
//                       <div className="bg-gradient-to-br from-fresh-500 to-fresh-600 rounded-2xl rounded-tr-none p-3 shadow-sm">
//                         <p className="text-sm text-white leading-relaxed">{message.text}</p>
//                       </div>
//                       <span className="text-xs text-earth-400 mt-1 block text-right">
//                         {new Date(message.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
//                       </span>
//                     </div>
//                     <div className="w-8 h-8 bg-gradient-to-br from-earth-300 to-earth-400 rounded-full flex items-center justify-center flex-shrink-0">
//                       <User size={18} className="text-white" />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {/* Typing Indicator */}
//             {isTyping && (
//               <div className="flex gap-2">
//                 <div className="w-8 h-8 bg-gradient-to-br from-fresh-400 to-fresh-600 rounded-full flex items-center justify-center">
//                   <Bot size={18} className="text-white" />
//                 </div>
//                 <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-earth-100">
//                   <div className="typing-indicator">
//                     <span></span>
//                     <span></span>
//                     <span></span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Form */}
//           <form onSubmit={handleSendMessage} className="p-4 border-t border-earth-200 bg-white">
//             <div className="flex gap-2">
//               <input
//                 ref={inputRef}
//                 type="text"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 placeholder="Nhập câu hỏi của bạn..."
//                 className="flex-1 px-4 py-3 border-2 border-earth-200 rounded-full 
//                          focus:border-fresh-400 focus:outline-none focus:ring-2 focus:ring-fresh-200
//                          transition-all"
//               />
//               <button
//                 type="submit"
//                 disabled={!inputValue.trim()}
//                 className="w-12 h-12 bg-gradient-to-br from-fresh-500 to-fresh-600 rounded-full 
//                          flex items-center justify-center text-white hover:scale-110 transition-transform
//                          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//               >
//                 <Send size={20} />
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </>
//   );
// };

// export default ChatWidget;

import { useState } from "react";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Xin chào 👋 Tôi là trợ lý AI của cửa hàng. Bạn cần tìm thực phẩm gì hôm nay?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Thêm tin nhắn người dùng
    const newMessages = [
      ...messages,
      { from: "user", text: input },
      {
        from: "ai",
        text: "Cảm ơn bạn! (Chatbot AI sẽ được tích hợp ở đây 🚀)",
      },
    ];

    setMessages(newMessages);
    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl z-50 transition"
      >
        💬
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">
          
          {/* Header */}
          <div className="bg-green-600 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold">AI Trợ lý Fresh Market</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-xl max-w-[70%] ${
                    msg.from === "user"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t p-3 flex gap-2">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSend}
              className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-xl"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;

