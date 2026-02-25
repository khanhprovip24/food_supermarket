from rest_framework import serializers
from shop.models import Order, OrderItem, Product, Discount

class ProductInOrderSerializer(serializers.ModelSerializer):
    """Serializer for Product in Order"""
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image']

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
    """Serializer for Order List (minimal info)"""
    class Meta:
        model = Order
        fields = ['id', 'total_amount', 'status', 'created_at']

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
    payment_method = serializers.ChoiceField(choices=['COD', 'Online'])
    discount_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    
    def validate_payment_method(self, value):
        if value not in ['COD', 'Online']:
            raise serializers.ValidationError("Invalid payment method")
        return value

class OrderStatusUpdateSerializer(serializers.Serializer):
    """Serializer for updating Order Status"""
    status = serializers.ChoiceField(
        choices=['pending', 'processing', 'shipping', 'completed', 'cancelled']
    )
