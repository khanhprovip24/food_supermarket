# 🥗 Fresh Food Shop - E-commerce Platform

Nền tảng thương mại điện tử bán thực phẩm tươi sống với đầy đủ tính năng quản lý kho, đơn hàng, giảm giá và thống kê doanh thu.

## 📋 Mục Lục
- [Tính Năng](#-tính-năng)
- [Công Nghệ](#-công-nghệ)
- [Cài Đặt](#-cài-đặt)
- [Sử Dụng](#-sử-dụng)
- [API Documentation](#-api-documentation)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)

## ✨ Tính Năng

### 👥 Người Dùng
- ✅ Đăng kí/Đăng nhập với JWT authentication
- ✅ Quản lý thông tin cá nhân
- ✅ Lịch sử đơn hàng
- ✅ Danh sách yêu thích (Wishlist)
- ✅ Hỗ trợ trực tuyến (Live Chat)

### 🛍️ Cửa Hàng
- ✅ Duyệt sản phẩm theo danh mục (6 loại)
- ✅ Tìm kiếm & lọc nâng cao
- ✅ Xem chi tiết sản phẩm (kho hàng, giá, đánh giá)
- ✅ Giỏ hàng persistent
- ✅ Thanh toán (COD, Card, Transfer)

### 🎁 Khuyến Mãi
- ✅ Mã giảm giá theo phần trăm hoặc tiền cố định
- ✅ Kiểm tra mã thời gian thực (real-time validation)
- ✅ Giới hạn lượt sử dụng mã
- ✅ Tự động tính giảm giá trong checkout

### 📊 Quản Trị
- ✅ Dashboard với thống kê doanh thu theo ngày/tháng/năm
- ✅ Quản lý sản phẩm, danh mục, kho hàng
- ✅ Quản lý đơn hàng và trạng thái
- ✅ Quản lý mã khuyến mãi
- ✅ Quản lý người dùng
- ✅ Giao diện Rizzman theme sang trọng

## 🏗️ Công Nghệ

**Backend:**
- Django 6.0.1
- Django Rest Framework 3.16.1
- SQLite Database
- JWT Authentication

**Frontend:**
- React 18+
- Vite (Build tool)
- Tailwind CSS (Styling)
- Axios (HTTP Client)

**Admin UI:**
- django-admin-interface 0.32.0 (Rizzman Theme)

## 🚀 Cài Đặt

### Yêu Cầu
- Python 3.13+
- Node.js 16+
- pip, npm

### Backend Setup

```bash
# 1. Tạo virtual environment
python -m venv venv
.\venv\Scripts\activate

# 2. Cài đặt dependencies
pip install -r requirements.txt

# 3. Database migrations
python manage.py migrate

# 4. Tạo superuser (admin)
python manage.py createsuperuser
# Nhập: admin / admin123

# 5. Load demo data (tùy chọn)
python manage.py populate_data --clear

# 6. Chạy server
python manage.py runserver
# Server chạy tại: http://localhost:8000
```

### Frontend Setup

```bash
# 1. Vào folder frontend
cd fresh-food-shop

# 2. Cài đặt dependencies
npm install

# 3. Chạy dev server
npm run dev
# Client chạy tại: http://localhost:5173

# 4. Build production
npm run build
```

## 📖 Sử Dụng

### Test Accounts (Demo Data)
```
Username: user0, user1, user2, ... user9
Password: user123
```

### Admin Panel
```
URL: http://localhost:8000/admin
Username: admin
Password: admin123
```

### Discount Codes (Mẫu)
```
FRESH10  → Giảm 25%
SAVE20   → Giảm 10%
SUMMER15 → Giảm 15%
NEWUSER25 → Giảm 200,000đ (cố định)
```

## 🔗 API Documentation

API đầy đủ tại: `http://localhost:8000/api/docs/`

### Endpoints Chính

| Endpoint | Phương Thức | Mô Tả |
|----------|------------|--------|
| `/api/auth/register` | POST | Đăng kí tài khoản |
| `/api/auth/login` | POST | Đăng nhập |
| `/api/auth/refresh` | POST | Làm mới token |
| `/api/products/` | GET | Danh sách sản phẩm |
| `/api/products/{id}` | GET | Chi tiết sản phẩm |
| `/api/orders/` | GET/POST | Danh sách/tạo đơn hàng |
| `/api/orders/validate_discount/` | POST | Kiểm tra mã giảm giá |
| `/api/cart/` | GET/POST | Giỏ hàng |
| `/api/wishlist/` | GET/POST | Danh sách yêu thích |

## 📁 Cấu Trúc Dự Án

```
project_web/
├── backend/
│   ├── core/                 # Django settings
│   │   ├── settings.py       # Configuration, INSTALLED_APPS
│   │   ├── urls.py          # URL routing
│   │   └── middleware.py     # Custom middleware
│   │
│   ├── shop/                # Main app
│   │   ├── models.py        # User, Product, Order, Discount, etc.
│   │   ├── admin.py         # Admin customization + dashboard
│   │   ├── views.py         # (Legacy, use API instead)
│   │   │
│   │   └── api/
│   │       ├── auth/        # Login, register, refresh token
│   │       ├── products/    # Product listing & details
│   │       ├── cart/        # Shopping cart
│   │       ├── orders/      # Orders + validate_discount endpoint
│   │       └── wishlist/    # Wishlist management
│   │
│   ├── templates/
│   │   └── admin/
│   │       └── index.html   # Custom admin dashboard
│   │
│   ├── db.sqlite3           # Database
│   ├── manage.py            # Django CLI
│   └── requirements.txt      # Python dependencies
│
└── frontend/
    └── fresh-food-shop/
        ├── src/
        │   ├── pages/       # 11 pages (Home, Products, Checkout, etc.)
        │   ├── components/  # Reusable components
        │   ├── context/     # Auth, Cart, Chat, Wishlist contexts
        │   ├── services/    # API services (authService, cartService, etc.)
        │   └── utils/       # Formatters, validators, constants
        │
        ├── package.json     # NPM dependencies
        ├── vite.config.js   # Vite configuration
        └── tailwind.config.js # Tailwind CSS config
```

## 🎯 Tính Năng Được Xác Nhận

- ✅ **Discount System**: Real-time validation, automatic calculation
- ✅ **Order Management**: Create, track, update status
- ✅ **Admin Dashboard**: Revenue by date/month, order tracking
- ✅ **Type Safety**: Decimal arithmetic for currency
- ✅ **Admin UI**: Modern Rizzman theme

## 🤝 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra logs: `python manage.py runserver` hoặc browser console
2. Đảm bảo migrations: `python manage.py migrate`
3. Kiểm tra port: 8000 (Django) và 5173 (React) available
4. Xóa cache: `Ctrl+Shift+Del` hoặc `Clear All Caches`

---

**Dự án được hoàn thành vào: 08/03/2026** ✨
