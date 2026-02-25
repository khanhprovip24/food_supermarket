from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.db.models import Q

from shop.models import Category, Product, Review
from shop.api.products.serializers import CategorySerializer, ProductListSerializer, ProductDetailSerializer, ReviewSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing product categories
    
    GET /api/products/categories/       - List all categories
    GET /api/products/categories/<id>/  - Get category details
    POST /api/products/categories/      - Create category (admin only)
    PUT /api/products/categories/<id>/  - Update category (admin only)
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [IsAdminUser()]
        return [AllowAny()]


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing products
    
    GET /api/products/               - List products with filters & search
    GET /api/products/<id>/          - Get product details
    POST /api/products/              - Create product (admin only)
    PUT /api/products/<id>/          - Update product (admin only)
    DELETE /api/products/<id>/       - Delete product (admin only)
    
    Query Parameters:
    - ?category=<id>      Filter by category ID
    - ?search=<text>      Search in name and description
    - ?status=true/false  Filter by status
    """
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Product.objects.all()
        
        # Filter by category
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # Search by name or description
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        
        # Filter by status
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param.lower() == 'true')
        
        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            return [IsAdminUser()]
        return [AllowAny()]

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def reviews(self, request, pk=None):
        """
        Get all reviews for a product
        GET /api/products/<id>/reviews/
        """
        product = self.get_object()
        reviews = product.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response({
            'success': True,
            'count': reviews.count(),
            'reviews': serializer.data
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_review(self, request, pk=None):
        """
        Add a review to a product
        POST /api/products/<id>/add_review/
        {
            "rating": 5,
            "comment": "Great product!"
        }
        """
        product = self.get_object()
        
        # Check if user already reviewed this product
        existing_review = Review.objects.filter(product=product, user=request.user).first()
        
        serializer = ReviewSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            if existing_review:
                # Update existing review
                existing_review.rating = serializer.validated_data.get('rating', existing_review.rating)
                existing_review.comment = serializer.validated_data.get('comment', existing_review.comment)
                existing_review.save()
                return Response({
                    'success': True,
                    'message': 'Review updated!',
                    'review': ReviewSerializer(existing_review).data
                }, status=status.HTTP_200_OK)
            else:
                # Create new review
                serializer.save(product=product, user=request.user)
                return Response({
                    'success': True,
                    'message': 'Review added!',
                    'review': serializer.data
                }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing reviews
    
    GET /api/reviews/          - List all reviews
    GET /api/reviews/<id>/     - Get review details  
    PUT /api/reviews/<id>/     - Update review (owner only)
    DELETE /api/reviews/<id>/  - Delete review (owner only)
    """
    serializer_class = ReviewSerializer

    def get_queryset(self):
        return Review.objects.all()

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        if instance.user == self.request.user or self.request.user.is_staff:
            instance.delete()
        else:
            return Response({
                'success': False,
                'error': 'You can only delete your own reviews'
            }, status=status.HTTP_403_FORBIDDEN)
