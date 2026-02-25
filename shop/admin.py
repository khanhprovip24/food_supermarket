from django.contrib import admin
from .models import User, Category, Product, Order, OrderItem, Discount, Review, Wishlist, Recipe, ChatHistory

# Đăng ký các bảng để Admin có thể CRUD sản phẩm và đơn hàng [cite: 38-82]
admin.site.register(User)
admin.site.register(Category)
admin.site.register(Discount)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Review)
admin.site.register(Wishlist)
admin.site.register(Recipe)
admin.site.register(ChatHistory)

# Tùy biến hiển thị cho Sản phẩm để dễ quản lý tồn kho [cite: 83-100]
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock', 'status', 'created_at')
    list_filter = ('category', 'status')
    search_fields = ('name', 'description')