from django.db import models
from django.contrib.auth.models import AbstractUser

# 1. QUẢN LÝ NGƯỜI DÙNG (User & Profile) [cite: 101-120, 184-188, 323-353]
class User(AbstractUser):
    phone = models.CharField(max_length=15, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    is_admin = models.BooleanField(default=False) # Phân quyền [cite: 109]

# 2. QUẢN LÝ SẢN PHẨM & KHO (Product & Inventory) [cite: 38-57, 121-139]
class Category(models.Model):
    name = models.CharField(max_length=100) # Thịt, Rau củ, Hải sản... [cite: 129-135]
    image = models.ImageField(upload_to='categories/', null=True, blank=True)
    
    def __str__(self): return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0) # Tồn kho [cite: 51, 83-100]
    image = models.ImageField(upload_to='products/')
    status = models.BooleanField(default=True) # Đang bán/Ngừng bán [cite: 54]
    created_at = models.DateTimeField(auto_now_add=True)

# 3. QUẢN LÝ KHUYẾN MÃI (Discounts) [cite: 157-174]
class Discount(models.Model):
    code = models.CharField(max_length=20, unique=True) # Mã giảm giá [cite: 166]
    value = models.FloatField() # Phần trăm hoặc số tiền giảm [cite: 167]
    is_percentage = models.BooleanField(default=True)
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField() # Thời gian áp dụng [cite: 168]
    usage_limit = models.IntegerField(default=100) # Số lượt sử dụng [cite: 170]

# 4. QUẢN LÝ ĐƠN HÀNG (Orders) [cite: 58-82, 238-255]
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Chờ xác nhận'), ('processing', 'Đang xử lý'),
        ('shipping', 'Đang giao hàng'), ('completed', 'Hoàn thành'), ('cancelled', 'Đã hủy'),
    ] # Các trạng thái theo báo cáo [cite: 67-71]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    discount = models.ForeignKey(Discount, on_delete=models.SET_NULL, null=True, blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    shipping_address = models.TextField()
    payment_method = models.CharField(max_length=50) # COD hoặc Online [cite: 261-262]
    created_at = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2) # Giá tại thời điểm mua

# 4.5 GIỎ HÀNG (Shopping Cart)
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# 5. TƯƠNG TÁC NGƯỜI DÙNG (Engagement) [cite: 227-237, 311-322]
class Wishlist(models.Model): # Danh sách yêu thích [cite: 227]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

class Review(models.Model): # Đánh giá & Bình luận [cite: 311]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    rating = models.IntegerField(default=5) # 1-5 sao [cite: 316]
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

# 6. HỆ THỐNG AI & THÔNG BÁO (AI & Notifications) [cite: 283-310, 369]
class Recipe(models.Model): # Database món ăn để AI gợi ý 
    name = models.CharField(max_length=255) # Tên món: Canh chua, Bò kho...
    ingredients = models.ManyToManyField(Product) # Nguyên liệu liên quan trong kho
    instructions = models.TextField() # Cách nấu

class ChatHistory(models.Model): # Lịch sử Chatbot [cite: 34, 283-295]
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model): # Thông báo hệ thống [cite: 298-310]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)