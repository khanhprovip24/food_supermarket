# 🥬 Fresh Food Shop - Hướng dẫn cho các thành viên trong nhóm

## 📋 Yêu cầu hệ thống
- **Python**: 3.8 trở lên
- **Node.js**: 14+ và npm/yarn
- **Git**: Untuk version control

## 🚀 Các bước để bắt đầu

### 1. Clone Repository
```bash
git clone https://github.com/khanhprovip24/food_supermarket.git
cd project_web
```

### 2. Cài đặt Backend (Django)
```bash
# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt

# Chạy migrations
python manage.py migrate

# (Optional) Thêm dữ liệu mẫu
python manage.py populate_data

# Chạy Django server
python manage.py runserver
```
Backend sẽ chạy tại: **http://localhost:8000**

### 3. Cài đặt Frontend (React + Vite)
```bash
cd fresh-food-shop

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```
Frontend sẽ chạy tại: **http://localhost:5173** (hoặc port khác nếu 5173 bị chiếm)

---

## 📁 Cấu trúc dự án

```
project_web/
├── core/                    # Django project config
│   ├── settings.py         # Cấu hình Django
│   ├── urls.py            # URL routing chính
│   ├── wsgi.py            # WSGI config
│   └── middleware.py      # Custom middleware
│
├── shop/                   # Django app chính
│   ├── models.py          # Database models
│   ├── views.py           # Backend views
│   ├── api/               # REST API endpoints
│   │   ├── auth/          # Authentication
│   │   ├── products/      # Products API
│   │   ├── cart/          # Shopping cart
│   │   ├── orders/        # Orders
│   │   └── wishlist/      # Wishlist
│   └── management/
│       └── commands/
│           └── populate_data.py  # Seed data
│
├── fresh-food-shop/       # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # Context API
│   │   ├── services/     # API services
│   │   ├── hooks/        # Custom hooks
│   │   ├── layouts/      # Layout components
│   │   └── utils/        # Utility functions
│   ├── package.json
│   └── vite.config.js
│
├── db.sqlite3            # Database file
├── manage.py             # Django manage script
└── requirements.txt      # Python dependencies
```

---

## 🔗 API Endpoints chính

**Base URL**: `http://localhost:8000/api/`

### Authentication
- `POST /auth/register/` - Đăng ký tài khoản
- `POST /auth/login/` - Đăng nhập
- `POST /auth/logout/` - Đăng xuất

### Products
- `GET /products/` - Lấy danh sách sản phẩm
- `GET /products/{id}/` - Chi tiết sản phẩm
- `POST /products/` - Tạo sản phẩm (admin)

### Shopping Cart
- `GET /cart/` - Lấy giỏ hàng
- `POST /cart/add/` - Thêm sản phẩm vào giỏ
- `DELETE /cart/remove/{id}/` - Xóa khỏi giỏ

### Orders
- `GET /orders/` - Lấy danh sách đơn hàng
- `POST /orders/create/` - Tạo đơn hàng

### Wishlist
- `GET /wishlist/` - Lấy danh sách yêu thích
- `POST /wishlist/add/` - Thêm vào yêu thích

---

## 📝 Quy tắc Commit

### Naming Convention
Sử dụng các prefix sau để mô tả commit:

```
feat:     Thêm feature mới
fix:      Sửa lỗi
docs:     Cập nhật documentation
style:    Fix formatting, thiếu semicolon, v.v (không thay đổi logic)
refactor: Rewrite code mà không đổi logic
perf:     Cải thiện performance
test:     Thêm tests
chore:    Update dependencies, build config, v.v
```

### Ví dụ:
```bash
git commit -m "feat: thêm tính năng filter sản phẩm theo giá"
git commit -m "fix: sửa lỗi hiển thị giỏ hàng"
git commit -m "docs: update API documentation"
```

---

## 🌳 Quy trình làm việc với Git

### 1. Tạo branch mới cho feature/fix
```bash
git checkout -b feature/tên-feature
# hoặc
git checkout -b fix/tên-fix
```

### 2. Commit changes
```bash
git add .
git commit -m "feat: mô tả chi tiết"
```

### 3. Push lên repo
```bash
git push origin feature/tên-feature
```

### 4. Tạo Pull Request trên GitHub
- Có bạn review code trước khi merge
- Merge vào `master` sau khi approved

### 5. Pull latest changes từ master
```bash
git checkout master
git pull origin master
```

---

## ⚠️ Những lưu ý quan trọng

### ❌ Không commit những file này
Những file sau **không nên** commit (đã được add vào `.gitignore`):
- `db.sqlite3` - Database file
- `__pycache__/` - Python cache
- `node_modules/` - NPM packages
- `venv/` - Virtual environment
- `.env` - Environment variables

### 🔐 Environment Variables
Nếu cần thêm sensitive data:
1. Tạo file `.env` (không commit)
2. Copy từ `.env.example`
3. Update giá trị của bạn

### 💾 Backup Database
Nếu thêm dữ liệu test quan trọng:
```bash
# Backup database
cp db.sqlite3 db.sqlite3.backup

# Reset database (nếu cần)
rm db.sqlite3
python manage.py migrate
```

---

## 🐛 Troubleshooting

### Backend lỗi "Module not found"
```bash
# Kích hoạt virtual environment và cài lại
venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend không chạy
```bash
cd fresh-food-shop
npm install
npm run dev
```

### Port đang được sử dụng
```bash
# Django (chạy trên port khác)
python manage.py runserver 8001

# Vite (tự động chạy trên port khác nếu 5173 bị chiếm)
```

### Database bị lỗi
```bash
# Reset migrations
python manage.py migrate --fake shop zero
python manage.py migrate
python manage.py populate_data
```

---

## 📚 Tài liệu thêm

- **Django**: https://docs.djangoproject.com/
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/
- **Tailwind CSS**: https://tailwindcss.com/

---

## 👥 Liên hệ

Nếu có vấn đề hoặc câu hỏi, hãy:
1. Kiểm tra issue trên GitHub
2. Tạo issue mới nếu còn chưa có
3. Liên hệ với team lead

---

**Happy Coding! 🚀**
