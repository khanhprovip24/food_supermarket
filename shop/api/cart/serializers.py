from rest_framework import serializers
from shop.models import Cart, CartItem, Product

class ProductInCartSerializer(serializers.ModelSerializer):
    """Serializer for Product in Cart view"""
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image', 'stock']

class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for Cart Items"""
    product = ProductInCartSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'subtotal']
    
    def get_subtotal(self, obj):
        return obj.quantity * obj.product.price

class CartSerializer(serializers.ModelSerializer):
    """Serializer for Shopping Cart"""
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'total_price', 'created_at', 'updated_at']
    
    def get_total_items(self, obj):
        return obj.items.aggregate(total=serializers.Sum('quantity'))['total'] or 0
    
    def get_total_price(self, obj):
        total = 0
        for item in obj.items.all():
            total += item.quantity * item.product.price
        return total
