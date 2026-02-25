# 🚀 Quick Setup Guide

## Bước 1: Cài đặt Node.js
Đảm bảo bạn đã cài Node.js >= 18. Kiểm tra version:
```bash
node --version
npm --version
```

## Bước 2: Clone/Copy dự án
```bash
cd fresh-food-shop
```

## Bước 3: Cài đặt dependencies
```bash
npm install
```

Quá trình này sẽ cài đặt:
- React 18.2.0
- React Router DOM 6.21.0
- Tailwind CSS 3.4.0
- Lucide React (icons)
- Axios (API calls)
- Chart.js (for analytics)
- Framer Motion (animations)

## Bước 4: Chạy development server
```bash
npm run dev
```

Server sẽ tự động mở tại: http://localhost:3000

## Bước 5: Khám phá giao diện

### Trang chủ (/)
- Hero banner với call-to-action
- Category grid
- Featured products
- New arrivals section

### Components có sẵn
1. **Navbar**: Navigation bar với search, cart, user menu
2. **ProductCard**: Card hiển thị sản phẩm với đầy đủ thông tin
3. **ChatWidget**: AI chat assistant (floating widget)
4. **InventoryTable**: Quản lý tồn kho (admin)
5. **StaffDashboard**: Dashboard quản lý đơn hàng

### Tính năng nổi bật
✅ Responsive design (mobile, tablet, desktop)
✅ Dark/Light mode ready
✅ Smooth animations
✅ Cart management với Context API
✅ Mock data sẵn sàng
✅ Ready for Django backend integration

## Bước 6: Test các tính năng

### Test Cart
1. Vào trang chủ
2. Click "Thêm vào giỏ" trên bất kỳ product card nào
3. Icon cart trên navbar sẽ hiển thị số lượng

### Test Chat Widget
1. Click icon chat ở góc phải màn hình
2. Gửi tin nhắn như "rau củ" hoặc "thịt"
3. AI sẽ trả lời với product suggestions

### Test Admin Dashboard
1. Navigate đến `/admin/staff`
2. Xem danh sách đơn hàng
3. Click "Xem chi tiết" để xem order details
4. Switch sang tab "Tồn kho" để quản lý inventory
5. Click edit để cập nhật stock

## Bước 7: Tùy chỉnh

### Thay đổi màu sắc
Edit `tailwind.config.js`:
```javascript
colors: {
  fresh: {
    500: '#your-color', // Primary green
  }
}
```

### Thay đổi fonts
Edit `src/index.css` - thêm Google Fonts URL

### Thêm sản phẩm mới
Edit `src/data/mockProducts.js`:
```javascript
{
  id: 11,
  name: 'Tên sản phẩm',
  price: 50000,
  // ... other fields
}
```

## Bước 8: Build cho Production
```bash
npm run build
```

Output sẽ nằm trong thư mục `dist/`

## Bước 9: Kết nối Backend (Optional)

### Setup API Service
```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const getProducts = () => api.get('/products/');
export const addToCart = (data) => api.post('/cart/', data);
```

### Update Components
Thay thế mock data bằng API calls:
```javascript
import { getProducts } from '../services/api';

useEffect(() => {
  const fetchProducts = async () => {
    const response = await getProducts();
    setProducts(response.data);
  };
  fetchProducts();
}, []);
```

## Troubleshooting

### Port đã được sử dụng
```bash
# Thay đổi port trong vite.config.js
server: { port: 3001 }
```

### Tailwind không hoạt động
```bash
# Xóa cache
rm -rf node_modules/.vite
npm run dev
```

### Images không hiển thị
- Đảm bảo URL images đúng
- Hoặc đặt images trong `public/images/`

## Các lệnh hữu ích

```bash
npm run dev       # Chạy development server
npm run build     # Build production
npm run preview   # Preview production build
npm run lint      # Check code quality
```

## Next Steps

1. ✅ Tạo các trang còn thiếu (Products, Cart, Checkout)
2. ✅ Implement authentication
3. ✅ Kết nối với Django backend
4. ✅ Tích hợp payment gateway
5. ✅ Deploy lên hosting

## Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra console trong browser (F12)
2. Đọc error messages
3. Check README.md để biết thêm chi tiết

---

Happy coding! 🌱💚
