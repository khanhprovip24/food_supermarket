# 🌱 Fresh Market - Website Thực phẩm Tươi sống tích hợp AI

Website thương mại điện tử bán thực phẩm tươi sạch với giao diện hiện đại, tích hợp AI Chatbot để hỗ trợ khách hàng.

## ✨ Tính năng chính

### Khách hàng
- 🛒 **Mua sắm trực tuyến**: Duyệt và mua sản phẩm với giao diện thân thiện
- 🔍 **Tìm kiếm thông minh**: Tìm kiếm và lọc sản phẩm theo danh mục, giá cả
- 💬 **AI Chat Assistant**: Chatbot thông minh hỗ trợ tư vấn sản phẩm và dinh dưỡng
- 🛍️ **Giỏ hàng**: Quản lý giỏ hàng với tính năng áp dụng mã giảm giá
- ⭐ **Đánh giá sản phẩm**: Xem và viết đánh giá từ khách hàng khác
- 🚚 **Theo dõi đơn hàng**: Kiểm tra trạng thái đơn hàng real-time

### Quản trị viên
- 📊 **Staff Dashboard**: Quản lý đơn hàng và cập nhật tồn kho nhanh
- 📈 **Manager Dashboard**: Thống kê doanh thu với biểu đồ và quản lý người dùng
- 📦 **Quản lý kho**: Cập nhật số lượng tồn kho với cảnh báo tự động

## 🎨 Thiết kế

### Aesthetic Direction
- **Theme**: Fresh & Organic - tươi mới và tự nhiên
- **Colors**: Xanh lá cây (fresh green) kết hợp trắng và earth tones
- **Typography**: 
  - Display: Fraunces (serif, distinctive)
  - Body: DM Sans (clean, readable)
- **Style**: Hiện đại, tối giản nhưng ấm áp, organic shapes

### Key Design Elements
- ✅ Glassmorphism effects
- ✅ Smooth animations và transitions
- ✅ Organic blob shapes
- ✅ Gradient accents
- ✅ Custom scrollbars
- ✅ Hover effects và micro-interactions

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **HTTP Client**: Axios (ready for Django backend)

### Animations
- CSS animations và keyframes
- Framer Motion (optional, included in dependencies)

## 📁 Cấu trúc dự án

```
fresh-food-shop/
├── src/
│   ├── components/
│   │   ├── common/         # Components dùng chung
│   │   │   └── Navbar.jsx
│   │   ├── products/       # Components sản phẩm
│   │   │   └── ProductCard.jsx
│   │   ├── chat/           # AI Chat widget
│   │   │   └── ChatWidget.jsx
│   │   └── admin/          # Admin components
│   │       └── InventoryTable.jsx
│   ├── pages/              # Các trang chính
│   │   └── Home.jsx
│   ├── context/            # Context API
│   │   └── CartContext.jsx
│   ├── data/               # Mock data
│   │   ├── mockProducts.js
│   │   └── mockData.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🚀 Cài đặt và Chạy

### Prerequisites
- Node.js >= 18
- npm hoặc yarn

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Chạy development server
```bash
npm run dev
```

Website sẽ chạy tại: `http://localhost:3000`

### Bước 3: Build cho production
```bash
npm run build
```

## 📦 Components đã tạo

### 1. Navbar.jsx
- Responsive navigation bar
- Search functionality
- Cart badge với số lượng
- User menu dropdown
- Category links
- Mobile menu

### 2. ProductCard.jsx
- Product image với lazy loading
- Discount badges
- Stock status
- Rating display
- Add to cart button
- Wishlist functionality
- Hover effects

### 3. ChatWidget.jsx
- Floating chat button
- Chat window với typing animation
- Product suggestions cards
- Quick action buttons
- Auto-scroll messages
- Mock AI responses (ready for API integration)

### 4. InventoryTable.jsx
- Editable stock quantities
- Status indicators (low stock warnings)
- Search và filter
- Quick stats dashboard
- Progress bars
- Bulk actions ready

### 5. Home.jsx
- Hero banner với CTA
- Category grid
- Featured products
- New arrivals
- Newsletter signup
- Trust badges

## 🔌 Kết nối Backend (Django)

### Tạo file API service

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Django backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Example API calls

```javascript
// Get products
const getProducts = async () => {
  const response = await api.get('/products/');
  return response.data;
};

// Add to cart
const addToCart = async (productId, quantity) => {
  const response = await api.post('/cart/', { 
    product_id: productId, 
    quantity 
  });
  return response.data;
};

// Chat with AI
const chatWithAI = async (message) => {
  const response = await api.post('/chat/', { message });
  return response.data;
};
```

## 🤖 Tích hợp AI Chatbot

Chatbot hiện tại sử dụng mock responses. Để tích hợp với backend Django:

1. Tạo endpoint `/api/chat/` trong Django
2. Sử dụng OpenAI/Anthropic API hoặc model tự train
3. Update `ChatWidget.jsx`:

```javascript
const handleSendMessage = async (e) => {
  e.preventDefault();
  // ... existing code ...

  try {
    const response = await api.post('/chat/', { 
      message: inputValue,
      conversation_id: conversationId 
    });
    
    const botResponse = {
      id: Date.now(),
      type: 'bot',
      text: response.data.message,
      productSuggestions: response.data.products,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, botResponse]);
  } catch (error) {
    console.error('Chat error:', error);
  }
};
```

## 🎯 Roadmap

### Phase 1 - Core Features (Completed ✅)
- [x] Project setup với Vite + React
- [x] Tailwind CSS configuration
- [x] Basic components (Navbar, ProductCard, etc.)
- [x] Mock data
- [x] Home page
- [x] Cart context
- [x] AI Chat widget

### Phase 2 - Additional Pages (Next)
- [ ] Products listing page với filters
- [ ] Product detail page
- [ ] Cart page
- [ ] Checkout page với form validation
- [ ] User authentication pages
- [ ] Order tracking page

### Phase 3 - Admin Dashboard
- [ ] Staff dashboard với order management
- [ ] Manager dashboard với analytics
- [ ] User management
- [ ] Revenue charts với Chart.js

### Phase 4 - Backend Integration
- [ ] Connect to Django REST API
- [ ] Real authentication
- [ ] Real-time inventory updates
- [ ] Payment gateway integration
- [ ] AI Chatbot với real backend

### Phase 5 - Advanced Features
- [ ] Real-time notifications
- [ ] Email notifications
- [ ] Push notifications
- [ ] Advanced search với AI
- [ ] Personalized recommendations

## 🎨 Customization

### Thay đổi màu sắc
Edit `tailwind.config.js`:
```javascript
colors: {
  fresh: {
    // Your custom green shades
  },
}
```

### Thay đổi fonts
Edit `src/index.css`:
```css
@import url('your-google-font-url');
```

## 🐛 Troubleshooting

### Issue: Styles không load
```bash
# Clear cache và rebuild
rm -rf node_modules
npm install
npm run dev
```

### Issue: Router không hoạt động
Kiểm tra BrowserRouter đã được wrap đúng trong App.jsx

## 📝 License

MIT License - feel free to use for your projects!

## 👥 Contributors

- Your Name - Frontend Developer

## 📧 Contact

Email: your-email@example.com
Website: your-website.com

---

Made with 💚 by Fresh Market Team
