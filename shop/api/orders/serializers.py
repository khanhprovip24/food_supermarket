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
    class Meta:
        model = Discount
        fields = ['id', 'code', 'value', 'is_percentage']

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
    discount_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    
    def validate_payment_method(self, value):
        # Accept various payment method formats
        allowed_methods = ['cash', 'COD', 'transfer', 'Online', 'card', 'bank_transfer']
        if value.lower() not in [m.lower() for m in allowed_methods]:
            raise serializers.ValidationError(
                f"Invalid payment method. Allowed: {', '.join(allowed_methods)}"
            )
        return value

class OrderStatusUpdateSerializer(serializers.Serializer):
    """Serializer for updating Order Status"""
    status = serializers.ChoiceField(
        choices=['pending', 'processing', 'shipping', 'completed', 'cancelled']
    )
