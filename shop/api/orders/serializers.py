from rest_framework import serializers
from shop.models import Order, OrderItem, Product, Discount

class ProductInOrderSerializer(serializers.ModelSerializer):
    """Serializer for Product in Order"""
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image']
    
    def get_image(self, obj):
        # Return full image URL
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            else:
                return f'/media/{obj.image.name}'
        return None

class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for Order Items"""
    product = ProductInOrderSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_id', 'quantity', 'price']
    
    def validate_product_id(self, value):
        try:
            Product.objects.get(id=value)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product does not exist")
        return value

class DiscountSerializer(serializers.ModelSerializer):
    """Serializer for Discount"""
    discount_display = serializers.SerializerMethodField()
    remaining_uses = serializers.SerializerMethodField()
    is_valid = serializers.SerializerMethodField()
    
    class Meta:
        model = Discount
        fields = [
            'id', 'code', 'value', 'is_percentage', 'is_active',
            'valid_from', 'valid_to', 'usage_limit', 'usage_count',
            'discount_display', 'remaining_uses', 'is_valid'
        ]
    
    def get_discount_display(self, obj):
        """Hiển thị loại giảm: % hoặc số tiền"""
        try:
            value = float(obj.value)
            if obj.is_percentage:
                return f"{value:.0f}% OFF"
            else:
                return f"Giảm {value:,.0f}đ"
        except (ValueError, TypeError):
            return f"Lỗi giá trị: {obj.value}"
    
    def get_remaining_uses(self, obj):
        """Số lần còn được dùng"""
        return max(0, obj.usage_limit - obj.usage_count)
    
    def get_is_valid(self, obj):
        """Kiểm tra mã giảm có hợp lệ không"""
        return obj.is_valid()

class OrderListSerializer(serializers.ModelSerializer):
    """Serializer for Order List (with items for modal display)"""
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'items', 'total_amount', 'status', 'shipping_address', 'payment_method', 'created_at']

class OrderDetailSerializer(serializers.ModelSerializer):
    """Serializer for Order Detail (full info)"""
    items = OrderItemSerializer(many=True, read_only=True)
    discount = DiscountSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'items', 'total_amount', 'status', 
            'shipping_address', 'payment_method', 'discount',
            'created_at'
        ]

class OrderCreateSerializer(serializers.Serializer):
    """Serializer for creating Order from Cart"""
    shipping_address = serializers.CharField(max_length=500)
    payment_method = serializers.CharField(max_length=50)
    discount_code = serializers.CharField(
        max_length=20, 
        required=False, 
        allow_blank=True,
        default=''
    )
    
    def validate_payment_method(self, value):
        # Accept various payment method formats
        allowed_methods = ['cash', 'COD', 'transfer', 'Online', 'card', 'bank_transfer']
        if value.lower() not in [m.lower() for m in allowed_methods]:
            raise serializers.ValidationError(
                f"Invalid payment method. Allowed: {', '.join(allowed_methods)}"
            )
        return value
    
    def validate_discount_code(self, value):
        """Validate discount code format"""
        # Remove whitespace and convert to uppercase for consistency
        if value:
            value = value.strip()
        return value

class OrderStatusUpdateSerializer(serializers.Serializer):
    """Serializer for updating Order Status"""
    status = serializers.ChoiceField(
        choices=['pending', 'processing', 'shipping', 'completed', 'cancelled']
    )
