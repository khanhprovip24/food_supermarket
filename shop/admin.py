from django.contrib import admin
from django.db.models import Sum
from django.utils.html import format_html, mark_safe
from django.utils import timezone
from django.db.models.functions import TruncDate, TruncMonth
from django.db.models import Q
from datetime import timedelta
from .models import User, Category, Product, Order, OrderItem, Discount, Review, Wishlist, Recipe, ChatHistory


# Customize admin site
admin.site.site_header = "🛒 Fresh Food Shop - Quản Lý Siêu Thị"
admin.site.site_title = "Admin Fresh Food Shop"
admin.site.index_title = "Dashboard Thống Kê"


# Override admin index view
original_index = admin.AdminSite.index

def custom_index(self, request, extra_context=None):
    """Custom dashboard with statistics and date filtering"""
    from datetime import datetime
    
    # Get filter parameters
    filter_type = request.GET.get('filter_type', 'overview')
    start_date_str = request.GET.get('start_date', '')
    end_date_str = request.GET.get('end_date', '')
    
    # Set date range based on filter
    now = timezone.now()
    today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    
    if filter_type == 'today':
        orders_qs = Order.objects.filter(
            created_at__gte=today,
            created_at__lt=today + timedelta(days=1)
        )
        period_label = f"Hôm nay ({today.strftime('%d/%m/%Y')})"
    elif filter_type == 'month':
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        orders_qs = Order.objects.filter(created_at__gte=month_start)
        period_label = f"Tháng {now.month}/{now.year}"
    elif filter_type == 'custom' and start_date_str and end_date_str:
        try:
            start = datetime.strptime(start_date_str, '%Y-%m-%d')
            end = datetime.strptime(end_date_str, '%Y-%m-%d')
            end = end.replace(hour=23, minute=59, second=59)
            orders_qs = Order.objects.filter(created_at__gte=start, created_at__lte=end)
            period_label = f"Từ {start.strftime('%d/%m/%Y')} đến {end.strftime('%d/%m/%Y')}"
        except:
            orders_qs = Order.objects.all()
            period_label = "Toàn bộ (Format date sai)"
    else:
        orders_qs = Order.objects.all()
        period_label = "Toàn bộ"
    
    # Basic statistics
    total_users = User.objects.count()
    total_products = Product.objects.count()
    total_orders = orders_qs.count()
    total_revenue = orders_qs.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
    low_stock_products = Product.objects.filter(stock__lt=5).count()
    pending_orders = Order.objects.filter(status='pending').count()
    
    # Revenue by day/hour
    revenue_by_day = {}
    if filter_type == 'today':
        # Show by hour for today
        for order in orders_qs:
            hour = order.created_at.strftime('%H:00')
            revenue_by_day[hour] = revenue_by_day.get(hour, 0) + float(order.total_amount or 0)
    else:
        # Show by day for other periods
        daily_stats = orders_qs.annotate(
            day=TruncDate('created_at')
        ).values('day').annotate(
            total=Sum('total_amount')
        ).order_by('day')
        
        for stat in daily_stats:
            if stat['day']:
                day_str = stat['day'].strftime('%d/%m/%Y')
                revenue_by_day[day_str] = float(stat['total'] or 0)
    
    # Revenue by month
    revenue_by_month = {}
    monthly_stats = Order.objects.annotate(
        month=TruncMonth('created_at')
    ).values('month').annotate(
        total=Sum('total_amount')
    ).order_by('month')
    
    for stat in monthly_stats:
        if stat['month']:
            month_str = stat['month'].strftime('%m/%Y')
            revenue_by_month[month_str] = float(stat['total'] or 0)
    
    # Build revenue table HTML
    revenue_table_html = ''
    if revenue_by_day:
        revenue_table_html += '<div style="margin-top: 20px; background: white; padding: 20px; border-radius: 5px;">'
        revenue_table_html += '<h3 style="margin-top: 0;">Doanh Thu ' + period_label + '</h3>'
        revenue_table_html += '<table style="width: 100%; border-collapse: collapse; background: white;">'
        revenue_table_html += '<tr style="background-color: #f0f0f0;"><th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Ngày/Giờ</th>'
        revenue_table_html += '<th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Doanh Thu (đ)</th></tr>'
        
        for day, amount in sorted(revenue_by_day.items(), reverse=True):
            revenue_table_html += f'<tr style="border-bottom: 1px solid #eee;"><td style="border: 1px solid #ddd; padding: 10px;">{day}</td>'
            revenue_table_html += f'<td style="border: 1px solid #ddd; padding: 10px; text-align: right; font-weight: bold; color: #28a745;">{amount:,.0f}</td></tr>'
        
        revenue_table_html += '</table></div>'
    
    # Build filter form
    filter_form_html = f'''
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #ddd;">
        <h3 style="margin-top: 0; color: #333;">🔍 Lọc Theo Khoảng Thời Gian</h3>
        <form method="get" style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
            <button type="submit" name="filter_type" value="overview" style="padding: 10px 20px; border: none; border-radius: 3px; background-color: {'#28a745' if filter_type == 'overview' else '#6c757d'}; color: white; cursor: pointer; font-weight: bold;">📊 Toàn Bộ</button>
            <button type="submit" name="filter_type" value="today" style="padding: 10px 20px; border: none; border-radius: 3px; background-color: {'#28a745' if filter_type == 'today' else '#6c757d'}; color: white; cursor: pointer; font-weight: bold;">📅 Hôm Nay</button>
            <button type="submit" name="filter_type" value="month" style="padding: 10px 20px; border: none; border-radius: 3px; background-color: {'#28a745' if filter_type == 'month' else '#6c757d'}; color: white; cursor: pointer; font-weight: bold;">📆 Tháng Này</button>
            <button type="submit" name="filter_type" value="custom" style="padding: 10px 20px; border: none; border-radius: 3px; background-color: {'#28a745' if filter_type == 'custom' else '#6c757d'}; color: white; cursor: pointer; font-weight: bold;">📍 Tùy Chỉnh</button>
            
            <span style="margin-left: auto; display: flex; gap: 10px;">
                <input type="date" name="start_date" value="{start_date_str}" style="padding: 8px; border: 1px solid #ddd; border-radius: 3px;">
                <input type="date" name="end_date" value="{end_date_str}" style="padding: 8px; border: 1px solid #ddd; border-radius: 3px;">
                <button type="submit" style="padding: 8px 15px; border: none; border-radius: 3px; background-color: #007bff; color: white; cursor: pointer; font-weight: bold;">🔎 Tìm</button>
            </span>
        </form>
    </div>
    '''
    
    extra_context = extra_context or {}
    extra_context.update({
        'total_users': total_users,
        'total_products': total_products,
        'total_orders': total_orders,
        'total_revenue': f"{total_revenue:,.0f}",
        'low_stock_products': low_stock_products,
        'pending_orders': pending_orders,
        'period_label': period_label,
        'filter_type': filter_type,
        'filter_form_html': mark_safe(filter_form_html),
        'revenue_table_html': mark_safe(revenue_table_html),
    })
    
    return original_index(self, request, extra_context)

admin.AdminSite.index = custom_index


# Register models
admin.site.register(Category)
admin.site.register(Review)
admin.site.register(Wishlist)
admin.site.register(Recipe)
admin.site.register(ChatHistory)
admin.site.register(OrderItem)


# Customize Discount Admin
@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_display', 'valid_period', 'usage_progress', 'status_badge')
    list_filter = ('is_active', 'is_percentage')
    search_fields = ('code',)
    readonly_fields = ('usage_count', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Thông Tin Cơ Bản', {
            'fields': ('code', 'is_active')
        }),
        ('Loại Giảm Giá', {
            'fields': ('is_percentage', 'value'),
            'description': 'Chọn loại giảm: phần trăm (%) hoặc số tiền cụ thể'
        }),
        ('Thời Gian Áp Dụng', {
            'fields': ('valid_from', 'valid_to')
        }),
        ('Giới Hạn Sử Dụng', {
            'fields': ('usage_limit', 'usage_count')
        }),
        ('Thời Gian Tạo/Cập Nhật', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def discount_display(self, obj):
        """Hiển thị loại giảm: % hoặc số tiền"""
        try:
            value = float(obj.value)
            if obj.is_percentage:
                display_text = f"{value:.0f}% OFF"
                return format_html('<span style="color: blue;">📊 {}</span>', display_text)
            else:
                display_text = f"Giảm {value:,.0f}đ"
                return format_html('<span style="color: green;">💰 {}</span>', display_text)
        except (ValueError, TypeError):
            return format_html('<span style="color: gray;">⚠️ Lỗi giá trị</span>')
    discount_display.short_description = 'Loại Giảm'
    
    def valid_period(self, obj):
        """Hiển thị khoảng thời gian hợp lệ"""
        from django.utils import timezone
        now = timezone.now()
        
        if now < obj.valid_from:
            status = "⏳ Chưa bắt đầu"
        elif now > obj.valid_to:
            status = "❌ Đã hết hạn"
        else:
            status = "✅ Đang hoạt động"
        
        return format_html(
            '<span>{}</span><br/>{} → {}',
            status,
            obj.valid_from.strftime('%d/%m/%Y'),
            obj.valid_to.strftime('%d/%m/%Y')
        )
    valid_period.short_description = 'Thời Gian Áp Dụng'
    
    def usage_progress(self, obj):
        """Hiển thị tiến độ sử dụng"""
        percent = (obj.usage_count / obj.usage_limit * 100) if obj.usage_limit > 0 else 0
        
        if obj.usage_count >= obj.usage_limit:
            color = 'red'
            status = '❌ HẾT'
        elif percent >= 80:
            color = 'orange'
            status = '⚠️'
        else:
            color = 'green'
            status = '✅'
        
        return format_html(
            '<span style="color: {};">{} {}/{}</span>',
            color, status, obj.usage_count, obj.usage_limit
        )
    usage_progress.short_description = 'Tiến Độ Sử Dụng'
    
    def status_badge(self, obj):
        """Hiển thị trạng thái kích hoạt"""
        if obj.is_active:
            return mark_safe('<span style="color: green;">🟢 Kích hoạt</span>')
        else:
            return mark_safe('<span style="color: red;">🔴 Tắt</span>')
    status_badge.short_description = 'Trạng Thái'


# Customize Product Admin
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock', 'stock_status', 'status')
    list_filter = ('category', 'status')
    search_fields = ('name', 'description')
    
    def stock_status(self, obj):
        """Hiển thị trạng thái tồn kho"""
        if obj.stock < 5:
            return format_html('<span style="color: red;">⚠️ Hết hàng ({} cái)</span>', obj.stock)
        elif obj.stock < 20:
            return format_html('<span style="color: orange;">⚡ Sắp hết ({} cái)</span>', obj.stock)
        return format_html('<span style="color: green;">✓ Còn hàng ({} cái)</span>', obj.stock)
    stock_status.short_description = 'Trạng Thái Kho'


# Customize Order Admin
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amount', 'status_badge', 'payment_method')
    list_filter = ('status', 'payment_method')
    readonly_fields = ('user',)
    
    def status_badge(self, obj):
        """Hiển thị status dưới dạng badge"""
        colors = {
            'pending': 'orange',
            'confirmed': 'blue',
            'shipping': 'purple',
            'delivered': 'green',
            'cancelled': 'red'
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 3px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Trạng Thái'


# Customize User Admin
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'phone', 'user_role')
    list_filter = ('is_staff', 'is_admin')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    
    def user_role(self, obj):
        """Hiển thị vai trò người dùng"""
        if obj.is_admin:
            return mark_safe('<span style="color: red;">👑 Admin</span>')
        elif obj.is_staff:
            return mark_safe('<span style="color: blue;">👨‍💼 Staff</span>')
        return mark_safe('<span style="color: green;">👤 User</span>')
    user_role.short_description = 'Vai Trò'