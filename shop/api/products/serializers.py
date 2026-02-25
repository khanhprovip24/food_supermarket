from rest_framework import serializers
from shop.models import Category, Product, Review


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for product categories"""
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'image', 'product_count']

    def get_product_count(self, obj):
        return obj.product_set.count()


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for product reviews"""
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user_id', 'user_username', 'product', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at', 'user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for product list view"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    review_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'category', 'category_name', 'name', 'price', 'stock', 'image', 'status', 'review_count', 'average_rating']

    def get_review_count(self, obj):
        return obj.review_set.count()

    def get_average_rating(self, obj):
        reviews = obj.review_set.all()
        if reviews.exists():
            total = sum([r.rating for r in reviews])
            return round(total / reviews.count(), 1)
        return 0


class ProductDetailSerializer(ProductListSerializer):
    """Serializer for product detail view"""
    reviews = ReviewSerializer(source='review_set', many=True, read_only=True)
    description = serializers.CharField()

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + ['description', 'reviews', 'created_at']
