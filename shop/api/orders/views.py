from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
from decimal import Decimal

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
            # Return more detailed error message
            error_messages = []
            for field, errors in serializer.errors.items():
                if isinstance(errors, list):
                    error_messages.extend(errors)
                else:
                    error_messages.append(str(errors))
            
            return Response({
                'success': False,
                'message': 'Lỗi xác thực: ' + ', '.join(error_messages),
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
                discount_code = serializer.validated_data.get('discount_code', '').strip()
                discount_value = 0
                
                if discount_code:
                    logger.info(f"Processing discount code: {discount_code}")
                    try:
                        # Try case-insensitive search
                        discount = Discount.objects.get(code__iexact=discount_code)
                        logger.info(f"Discount found: {discount.code}")
                        
                        # Validate discount is active
                        if not discount.is_active:
                            logger.warning(f"Discount {discount.code} is not active")
                            return Response({
                                'success': False,
                                'message': 'Mã giảm giá này đã bị vô hiệu hóa'
                            }, status=status.HTTP_400_BAD_REQUEST)
                        
                        # Validate discount date range
                        from django.utils import timezone
                        now = timezone.now()
                        if now < discount.valid_from:
                            logger.warning(f"Discount {discount.code} has not started yet")
                            return Response({
                                'success': False,
                                'message': f'Mã giảm giá chưa có hiệu lực (bắt đầu: {discount.valid_from.strftime("%d/%m/%Y")})'
                            }, status=status.HTTP_400_BAD_REQUEST)
                        
                        if now > discount.valid_to:
                            logger.warning(f"Discount {discount.code} has expired")
                            return Response({
                                'success': False,
                                'message': f'Mã giảm giá đã hết hạn (kết thúc: {discount.valid_to.strftime("%d/%m/%Y")})'
                            }, status=status.HTTP_400_BAD_REQUEST)
                        
                        # Validate usage limit
                        if discount.usage_count >= discount.usage_limit:
                            logger.warning(f"Discount {discount.code} usage limit reached: {discount.usage_count}/{discount.usage_limit}")
                            return Response({
                                'success': False,
                                'message': f'Mã giảm giá đã hết lượt sử dụng ({discount.usage_count}/{discount.usage_limit})'
                            }, status=status.HTTP_400_BAD_REQUEST)
                        
                        # Calculate discount value
                        try:
                            discount_value = Decimal(str(discount.value))
                            if discount.is_percentage:
                                discount_value = (total_amount * discount_value) / Decimal('100')
                                logger.info(f"Applied percentage discount: {discount.value}% = {discount_value}đ")
                            else:
                                logger.info(f"Applied fixed discount: {discount_value}đ")
                            
                            total_amount = max(Decimal('0'), total_amount - discount_value)
                        except (ValueError, TypeError) as e:
                            logger.error(f"Error calculating discount value: {str(e)}")
                            return Response({
                                'success': False,
                                'message': 'Lỗi trong tính toán giảm giá'
                            }, status=status.HTTP_400_BAD_REQUEST)
                        
                    except Discount.DoesNotExist:
                        logger.warning(f"Discount code not found: {discount_code}")
                        return Response({
                            'success': False,
                            'message': f'Mã giảm giá "{discount_code}" không tồn tại'
                        }, status=status.HTTP_400_BAD_REQUEST)
                
                # Check if all items have enough stock
                for item in cart.items.all():
                    if item.product.stock < item.quantity:
                        return Response({
                            'success': False,
                            'message': f'Not enough stock for {item.product.name}. Available: {item.product.stock}, Requested: {item.quantity}'
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
                    
                    # Reduce product stock
                    cart_item.product.stock -= cart_item.quantity
                    cart_item.product.save()
                    logger.info(f"Updated stock for product {cart_item.product.id}: -{cart_item.quantity}")
                
                # Clear cart after successful order
                cart.items.all().delete()
                
                # Increment discount usage count if applied
                if discount:
                    discount.usage_count += 1
                    discount.save()
                    logger.info(f"Discount {discount.code} usage count: {discount.usage_count}/{discount.usage_limit}")
                
                
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
    
    @action(detail=False, methods=['post'])
    def validate_discount(self, request):
        """
        Validate discount code and return discount details
        
        POST /api/orders/validate_discount/
        {
            "discount_code": "FRESH10",
            "total_amount": 100000 (optional, for calculating discount amount)
        }
        """
        import logging
        logger = logging.getLogger(__name__)
        
        discount_code = request.data.get('discount_code', '').strip()
        total_amount = request.data.get('total_amount', 0)
        
        if not discount_code:
            return Response({
                'success': False,
                'message': 'Vui lòng nhập mã giảm giá'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Find discount by code (case-insensitive)
            discount = Discount.objects.get(code__iexact=discount_code)
            logger.info(f"Found discount: {discount.code}")
            
            # Check if discount is active
            if not discount.is_active:
                logger.warning(f"Discount {discount.code} is inactive")
                return Response({
                    'success': False,
                    'message': 'Mã giảm giá này đã bị tắt'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check date validity
            from django.utils import timezone
            now = timezone.now()
            if now < discount.valid_from:
                logger.warning(f"Discount {discount.code} not yet valid")
                return Response({
                    'success': False,
                    'message': f'Mã giảm giá sẽ có hiệu lực từ {discount.valid_from.strftime("%d/%m/%Y")}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if now > discount.valid_to:
                logger.warning(f"Discount {discount.code} expired")
                return Response({
                    'success': False,
                    'message': 'Mã giảm giá này đã hết hiệu lực'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check usage limit
            if discount.usage_count >= discount.usage_limit:
                logger.warning(f"Discount {discount.code} usage limit exceeded")
                return Response({
                    'success': False,
                    'message': f'Mã giảm giá đã hết lượt sử dụng ({discount.usage_count}/{discount.usage_limit})'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Calculate discount value
            discount_value = Decimal(str(discount.value))
            if discount.is_percentage:
                total_as_decimal = Decimal(str(total_amount))
                discount_amount = (total_as_decimal * discount_value) / Decimal('100')
            else:
                discount_amount = discount_value
            
            # Return success with discount details
            return Response({
                'success': True,
                'message': 'Mã giảm giá hợp lệ',
                'discount': {
                    'code': discount.code,
                    'value': float(discount.value),
                    'is_percentage': discount.is_percentage,
                    'discount_amount': float(discount_amount),
                    'remaining_uses': discount.usage_limit - discount.usage_count
                }
            }, status=status.HTTP_200_OK)
        
        except Discount.DoesNotExist:
            logger.warning(f"Discount not found: {discount_code}")
            return Response({
                'success': False,
                'message': 'Mã giảm giá không tồn tại'
            }, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            logger.error(f"Error validating discount: {str(e)}")
            return Response({
                'success': False,
                'message': 'Lỗi kiểm tra mã giảm giá'
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
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """
        Cancel order - only allowed for pending or processing orders
        
        POST /api/orders/<id>/cancel/
        """
        order = self.get_object()
        
        # Check if order can be cancelled
        if order.status not in ['pending', 'processing']:
            return Response({
                'success': False,
                'message': f'Không thể hủy đơn hàng ở trạng thái {order.get_status_display()}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                # Restore stock for all items in the order
                for item in order.items.all():
                    item.product.stock += item.quantity
                    item.product.save()
                
                # Update order status to cancelled
                order.status = 'cancelled'
                order.save()
                
                return Response({
                    'success': True,
                    'message': 'Đơn hàng đã được hủy',
                    'order': OrderDetailSerializer(order, context={'request': request}).data
                }, status=status.HTTP_200_OK)
        
        except Exception as e:
            import traceback
            print(f"Error cancelling order: {str(e)}")
            print(traceback.format_exc())
            return Response({
                'success': False,
                'message': f'Lỗi khi hủy đơn hàng: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
