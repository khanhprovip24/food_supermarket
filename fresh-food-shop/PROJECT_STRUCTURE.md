# Cấu trúc Dự án Fresh Food Shop

```
fresh-food-shop/
│
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Button.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   │
│   │   ├── home/
│   │   │   ├── HeroBanner.jsx
│   │   │   ├── CategorySection.jsx
│   │   │   └── FeaturedProducts.jsx
│   │   │
│   │   ├── products/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductFilter.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   └── ProductDetail.jsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   ├── CartSummary.jsx
│   │   │   └── CheckoutForm.jsx
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatWidget.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   └── ProductSuggestionCard.jsx
│   │   │
│   │   └── admin/
│   │       ├── InventoryTable.jsx
│   │       ├── OrderManagement.jsx
│   │       ├── RevenueChart.jsx
│   │       └── UserManagement.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── admin/
│   │       ├── StaffDashboard.jsx
│   │       └── ManagerDashboard.jsx
│   │
│   ├── context/
│   │   ├── CartContext.jsx
│   │   ├── AuthContext.jsx
│   │   └── ChatContext.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── cartService.js
│   │   └── chatService.js
│   │
│   ├── utils/
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── constants.js
│   │
│   ├── hooks/
│   │   ├── useCart.js
│   │   ├── useAuth.js
│   │   └── useDebounce.js
│   │
│   ├── data/
│   │   ├── mockProducts.js
│   │   ├── mockCategories.js
│   │   ├── mockOrders.js
│   │   └── mockReviews.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Mô tả các thư mục chính

### `/components`
Chứa tất cả React components được phân chia theo chức năng:
- **common/**: Components dùng chung (Navbar, Footer, Button...)
- **home/**: Components cho trang chủ
- **products/**: Components liên quan đến sản phẩm
- **cart/**: Components giỏ hàng và thanh toán
- **chat/**: AI Chat widget components
- **admin/**: Components dành cho quản trị

### `/pages`
Các trang chính của ứng dụng, sử dụng React Router

### `/context`
Context API để quản lý state toàn cục (Cart, Auth, Chat)

### `/services`
Các service kết nối API backend (Axios)

### `/utils`
Các hàm tiện ích (format giá, validate form...)

### `/hooks`
Custom React hooks

### `/data`
Mock data để test UI trước khi có API thật
