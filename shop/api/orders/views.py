from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction

from shop.models import Order, OrderItem, Cart, CartItem, Product, Discount
from shop.api.orders.serializers import (
    OrderDetailSerializer, 
    OrderListSerializer,
    OrderCreateSerializer,
    OrderStatusUpdateSerializer
)

class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Order management
    - list: GET /api/orders/ - Get user's order history
    - retrieve: GET /api/orders/<id>/ - Get order details
    - create_from_cart: POST /api/orders/ - Create order from cart
    - update_status: PUT /api/orders/<id>/status/ - Update order status
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Only return orders for the current user"""
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return OrderDetailSerializer
        elif self.action == 'create_from_cart':
            return OrderCreateSerializer
        elif self.action == 'update_status':
            return OrderStatusUpdateSerializer
        return OrderListSerializer
    
    def get_serializer_context(self):
        """Add request to serializer context for image URL building"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=False, methods=['post'])
    def create_from_cart(self, request):
        """
        Create order from cart items
        
        POST /api/orders/create_from_cart/
        {
            "shipping_address": "123 Main St",
            "payment_method": "cash",
            "discount_code": "SAVE10" (optional)
        }
        """
        import logging
        logger = logging.getLogger(__name__)
        
        logger.info(f"Creating order for user: {request.user}")
        logger.info(f"Request data: {request.data}")
        
        serializer = OrderCreateSerializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Serializer validation failed: {serializer.errors}")
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                # Get user's cart
                try:
                    cart = Cart.objects.get(user=request.user)
                except Cart.DoesNotExist:
                    return Response({
                        'success': False,
                        'message': 'Cart is empty'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Check if cart has items
                if not cart.items.exists():
                    return Response({
                        'success': False,
                        'message': 'Cart is empty'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Calculate total amount
                total_amount = 0
                for item in cart.items.all():
                    total_amount += item.quantity * item.product.price
                
                # Handle discount if provided
                discount = None
                discount_code = serializer.validated_data.get('discount_code')
                if discount_code:
                    try:
                        discount = Discount.objects.get(code=discount_code)
                        if discount.is_percentage:
                            discount_value = (total_amount * discount.value) / 100
                        else:
                            discount_value = discount.value
                        total_amount = max(0, total_amount - discount_value)
                    except Discount.DoesNotExist:
                        return Response({
                            'success': False,
                            'message': 'Invalid discount code'
                        }, status=status.HTTP_400_BAD_REQUEST)
                
                # Create order
                order = Order.objects.create(
                    user=request.user,
                    discount=discount,
                    total_amount=total_amount,
                    status='pending',
                    shipping_address=serializer.validated_data['shipping_address'],
                    payment_method=serializer.validated_data['payment_method']
                )
                
                # Create order items from cart
                for cart_item in cart.items.all():
                    OrderItem.objects.create(
                        order=order,
                        product=cart_item.product,
                        quantity=cart_item.quantity,
                        price=cart_item.product.price
                    )
                
                # Clear cart after successful order
                cart.items.all().delete()
                
                logger.info(f"Order created successfully: {order.id}")
                
                return Response({
                    'success': True,
                    'message': 'Order created successfully',
                    'id': order.id,
                    'order': OrderDetailSerializer(order, context={'request': request}).data
                }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            import traceback
            logger.error(f"Error creating order: {str(e)}")
            logger.error(traceback.format_exc())
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['put'])
    def update_status(self, request, pk=None):
        """
        Update order status (admin only recommended)
        
        PUT /api/orders/<id>/update_status/
        {
            "status": "processing"
        }
        """
        order = self.get_object()
        serializer = OrderStatusUpdateSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            order.status = serializer.validated_data['status']
            order.save()
            
            return Response({
                'success': True,
                'message': 'Order status updated',
                'order': OrderDetailSerializer(order, context={'request': request}).data
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
