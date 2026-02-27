# 🥬 Fresh Food Shop - Hướng dẫn nhanh

## 📋 Yêu cầu
- Python 3.8+
- Node.js 14+

## 🚀 Bắt đầu (5 phút)

### 1. Clone repo
```bash
git clone https://github.com/khanhprovip24/food_supermarket.git
cd project_web
```

### 2. Tạo .env (⭐ BƯỚC QUAN TRỌNG)
```bash
# Windows:
copy .env.example .env

# Linux/Mac:
cp .env.example .env
```
⚠️ **Không commit `.env` lên GitHub!**

### 3. Chạy Backend
```bash
python -m venv venv
venv\Scripts\activate    # Windows
# source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
python manage.py migrate
python manage.py populate_data
python manage.py runserver
```
→ http://localhost:8000

### 4. Chạy Frontend (terminal mới)
```bash
cd fresh-food-shop
npm install
npm run dev
```
→ http://localhost:5173

---

## 📁 Cấu trúc

```
├── core/               Django config
├── shop/               Django app + API
├── fresh-food-shop/    React frontend
├── .env.example        Template (commit này)
├── .env                Local (không commit)
└── requirements.txt
```

---

## 📡 API chính

**Base:** `http://localhost:8000/api/`

- `POST /auth/register/` - Đăng ký
- `POST /auth/login/` - Đăng nhập
- `GET /products/` - Danh sách sản phẩm
- `GET /cart/` - Giỏ hàng
- `POST /orders/create/` - Tạo đơn

---

## Git Workflow

**Tạo branch:**
```bash
git checkout -b feature/tên-feature
```

**Commit:**
```bash
git commit -m "feat: mô tả"     # Feature
git commit -m "fix: mô tả"      # Fix bug
git commit -m "docs: mô tả"     # Doc
```

**Push & tạo PR:**
```bash
git push origin feature/tên-feature
# → Tạo Pull Request trên GitHub
```

---

## ⚠️ Lưu ý

### KHÔNG commit
- `.env` (chứa SECRET_KEY)
- `db.sqlite3`
- `venv/`
- `node_modules/`
- `__pycache__/`

Tất cả đã trong `.gitignore` ✓

### Về .env
- `.env.example` = template (commit)
- `.env` = local (KHÔNG commit)
- Thêm var mới? Update cả 2 file

---

## 🔧 Lỗi thường gặp

| Lỗi | Giải pháp |
|-----|----------|
| Module not found | `pip install -r requirements.txt` |
| npm error | `npm install` (trong fresh-food-shop/) |
| Port bị chiếm | `python manage.py runserver 8001` |
| Database error | `python manage.py migrate` |

---

**Happy Coding! 🚀**
