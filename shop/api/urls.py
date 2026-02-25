from django.urls import path, include
from rest_framework.routers import DefaultRouter
from shop.api.products.views import CategoryViewSet, ProductViewSet, ReviewViewSet

# API Router
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    # Auth endpoints
    path('auth/', include('shop.api.auth.urls')),
    
    # Cart endpoints
    path('cart/', include('shop.api.cart.urls')),
    
    # Orders endpoints
    path('orders/', include('shop.api.orders.urls')),
    
    # Wishlist endpoints
    path('wishlist/', include('shop.api.wishlist.urls')),
    
    # Products and other endpoints
    path('', include(router.urls)),
]
