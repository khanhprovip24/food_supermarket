# 🤖 Hướng dẫn cài đặt Chatbot AI

## 📋 Yêu cầu hệ thống

- Node.js (v16 trở lên)
- Python 3.8+
- Git
- Tài khoản n8n cloud (hoặc n8n self-hosted)

## 🚀 Bước 1: Clone repository

```bash
git clone https://github.com/khanhprovip24/food_supermarket.git
cd food_supermarket
```

## 🔀 Bước 2: Checkout nhánh chatbot

```bash
git checkout feature/chatbot
```

## 🐍 Bước 3: Cài đặt Backend (Django)

### 3.1. Tạo virtual environment

```bash
python -m venv .venv
```

### 3.2. Activate virtual environment

**Windows:**
```bash
.venv\Scripts\activate
```

**Linux/Mac:**
```bash
source .venv/bin/activate
```

### 3.3. Cài đặt dependencies

```bash
pip install Django djangorestframework django-cors-headers Pillow Faker python-decouple drf-spectacular
```

### 3.4. Tạo dữ liệu mẫu

```bash
python manage.py migrate
python manage.py populate_data --clear
```

### 3.5. Chạy Django server

```bash
python manage.py runserver
```

Server sẽ chạy tại: http://localhost:8000

## ⚛️ Bước 4: Cài đặt Frontend (React)

### 4.1. Di chuyển vào thư mục frontend

```bash
cd fresh-food-shop
```

### 4.2. Cài đặt dependencies

```bash
npm install
```

### 4.3. Tạo file .env

Tạo file `.env` trong thư mục `fresh-food-shop/`:

```env
VITE_N8N_WEBHOOK_URL=https://minhngoc123.app.n8n.cloud/webhook/food-chatbot
```

**Lưu ý:** Thay URL trên bằng URL webhook của bạn nếu khác.

### 4.4. Chạy React app

```bash
npm run dev
```

Website sẽ chạy tại: http://localhost:5173 (hoặc 3001 nếu port 5173 đang dùng)

## 🔧 Bước 5: Cấu hình n8n Workflow

### 5.1. Đăng nhập vào n8n

Truy cập: https://minhngoc123.app.n8n.cloud (hoặc n8n instance của bạn)

### 5.2. Import workflow

1. Click **"Add workflow"** → **"Import from File"**
2. Chọn file `simple-food-chatbot-workflow.json` từ thư mục gốc
3. Workflow sẽ được import với các node:
   - Webhook trigger
   - Gemini 2.5 Flash API
   - Response formatter

### 5.3. Cấu hình Gemini API Key

1. Mở node **"Gemini Chat"**
2. Nhập API Key: `AIzaSyAKFH-hNkyiaGJxlzM9D4VB1Pwt0zt8tk0`
3. Hoặc tạo API key mới tại: https://aistudio.google.com/apikey

### 5.4. Kiểm tra Webhook URL

1. Click vào node **"Webhook"**
2. Copy **Production URL**
3. Đảm bảo URL khớp với `VITE_N8N_WEBHOOK_URL` trong file `.env`

### 5.5. Activate workflow

Click nút **"Activate"** ở góc trên bên phải để bật workflow.

## ✅ Bước 6: Test Chatbot

1. Mở website: http://localhost:5173
2. Click vào icon chat 💬 ở góc dưới bên phải
3. Thử các câu hỏi:
   - "Hôm nay ăn gì?"
   - "Giá rau củ bao nhiêu?"
   - "Có thịt gà tươi không?"
   - "Cách làm canh chua?"

## 🎯 Các workflow có sẵn

### 1. simple-food-chatbot-workflow.json (Khuyên dùng)
- Workflow đơn giản nhất
- Chỉ dùng Gemini API
- Trả lời chi tiết (5-10 câu)
- Phù hợp cho demo và production

### 2. food-chatbot-workflow.json
- Workflow đầy đủ với phân loại query
- Tích hợp Django Product API
- Hiển thị sản phẩm với giá và tồn kho

### 3. hybrid-food-chatbot-workflow.json
- Kết hợp Gemini + Django API
- Chatbot biết sản phẩm trong database
- Cần expose Django API qua ngrok

## 🔍 Troubleshooting

### Lỗi: "Webhook not registered"

**Nguyên nhân:** Workflow chưa được activate trong n8n

**Giải pháp:**
1. Vào n8n cloud
2. Mở workflow
3. Click "Activate"

### Lỗi: "Network Error" hoặc timeout

**Nguyên nhân:** URL webhook sai hoặc n8n không chạy

**Giải pháp:**
1. Kiểm tra file `.env` có đúng URL không
2. Test webhook bằng PowerShell:
```powershell
curl -Method POST -Uri "https://minhngoc123.app.n8n.cloud/webhook/food-chatbot" -ContentType "application/json" -Body '{"message":"test","sessionId":"test","timestamp":1234567890}'
```

### Chatbot không hiển thị sản phẩm

**Nguyên nhân:** Đang dùng simple workflow (không có tích hợp database)

**Giải pháp:**
- Nếu muốn chatbot biết sản phẩm, dùng `hybrid-food-chatbot-workflow.json`
- Cần expose Django API qua ngrok
- Set environment variable `DJANGO_API_URL` trong n8n

### Port đã được sử dụng

**Giải pháp:**
- Django: Thay đổi port: `python manage.py runserver 8001`
- React: Vite tự động chọn port khác (3001, 3002...)

## 📚 Tài liệu bổ sung

- `FOOD_CHATBOT_README.md` - Chi tiết về chatbot
- `DEPLOYMENT_GUIDE.md` - Hướng dẫn deploy production
- `QUICK_START.md` - Hướng dẫn nhanh
- `REMOVE_CHATBOT.md` - Cách xóa chatbot

## 🆘 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra console (F12) xem có lỗi gì
2. Kiểm tra n8n workflow logs
3. Đảm bảo Django server đang chạy
4. Đảm bảo file `.env` đã được tạo

## 📝 Ghi chú

- Chatbot chỉ trả lời câu hỏi về thực phẩm
- Sử dụng Gemini 2.5 Flash (model mới nhất)
- Hỗ trợ tiếng Việt và tiếng Anh
- Có quick reply buttons để test nhanh
- Timeout 20 giây cho mỗi request
