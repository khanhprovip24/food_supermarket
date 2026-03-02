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
        # Special handling for add_review action
        if self.action == 'add_review':
            return [IsAuthenticated()]
        
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

    @action(detail=True, methods=['post'])
    def add_review(self, request, pk=None):
        """
        Add a new review for a product
        POST /api/products/<id>/add_review/
        
        Requires authentication via session or token
        
        Request Body:
        {
            "rating": 1-5,
            "comment": "Your review text"
        }
        
        Response:
        {
            "success": true,
            "message": "Review added!",
            "review": {...}
        }
        """
        # Check if user is authenticated
        if not request.user or not request.user.is_authenticated:
            return Response({
                'success': False,
                'message': 'Authentication required. Please login first.',
                'error_code': 'NOT_AUTHENTICATED'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        product = self.get_object()

        # Always create a new review (allow multiple reviews per user per product)
        serializer = ReviewSerializer(
            data=request.data,
            context={'request': request, 'product': product}
        )
        
        if serializer.is_valid():
            review = serializer.save(product=product, user=request.user)
            
            return Response({
                'success': True,
                'message': 'Review added!',
                'review': ReviewSerializer(review).data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Invalid review data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing reviews
    
    GET /api/reviews/           - List all reviews
    GET /api/reviews/<id>/      - Get review details
    POST /api/reviews/          - Create review (authenticated)
    PUT /api/reviews/<id>/      - Update own review (authenticated)
    PATCH /api/reviews/<id>/    - Partial update of own review (authenticated)
    DELETE /api/reviews/<id>/   - Delete own review (authenticated)
    """
    serializer_class = ReviewSerializer

    def get_queryset(self):
        return Review.objects.all().select_related('user', 'product')

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        """Create a new review (allow multiple reviews per user per product)"""
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """Update only if the user is the review owner or is admin"""
        if serializer.instance.user != self.request.user and not self.request.user.is_staff:
            raise PermissionError('You can only update your own reviews')
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        """Delete only if the user is the review owner or is admin"""
        if instance.user != self.request.user and not self.request.user.is_staff:
            raise PermissionError('You can only delete your own reviews')
        instance.delete()
