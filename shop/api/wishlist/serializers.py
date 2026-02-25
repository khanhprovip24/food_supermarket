from rest_framework import serializers
from shop.models import Wishlist, Product

class ProductInWishlistSerializer(serializers.ModelSerializer):
    """Serializer for Product in Wishlist"""
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image', 'stock', 'category']

class WishlistItemSerializer(serializers.ModelSerializer):
    """Serializer for Wishlist Item"""
    product = ProductInWishlistSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_id']

class WishlistSerializer(serializers.ModelSerializer):
    """Serializer for full Wishlist"""
    items = WishlistItemSerializer(source='wishlist_set', many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = ['items']
