from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from shop.models import Cart, CartItem, Product
from shop.api.cart.serializers import CartSerializer, CartItemSerializer

@api_view(['POST'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    """
    Add product to cart
    
    POST /api/cart/add/
    {
        "product_id": 1,
        "quantity": 2
    }
    """
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        logger.info(f"Request data: {request.data}")
        logger.info(f"User: {request.user}")
        
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        
        logger.info(f"Product ID: {product_id}, Quantity: {quantity}")
        
        if not product_id:
            return Response({
                'success': False,
                'message': 'product_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if quantity < 1:
            return Response({
                'success': False,
                'message': 'quantity must be at least 1'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        product = get_object_or_404(Product, id=product_id)
        
        if product.stock < quantity:
            return Response({
                'success': False,
                'message': f'Not enough stock. Available: {product.stock}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create cart for current user
        cart, created = Cart.objects.get_or_create(user=request.user)
        
        # Get or create cart item
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product
        )
        
        if not created:
            # If item already exists, increase quantity
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        
        cart_item.save()
        
        serializer = CartSerializer(cart, context={'request': request})
        logger.info(f"Cart updated: {serializer.data}")
        
        return Response({
            'success': True,
            'message': 'Product added to cart',
            'cart': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        import traceback
        logger.error(f"Error in add_to_cart: {str(e)}")
        logger.error(traceback.format_exc())
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def get_cart(request):
    """
    Get current user's cart
    
    GET /api/cart/
    """
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        logger.info(f"Getting cart for user: {request.user}")
        logger.info(f"User is authenticated: {request.user.is_authenticated}")
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart, context={'request': request})
        logger.info(f"Cart data: {serializer.data}")
        return Response({
            'success': True,
            'cart': serializer.data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        import traceback
        logger.error(f"Error in get_cart: {str(e)}")
        logger.error(traceback.format_exc())
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    """
    Remove product from cart
    
    DELETE /api/cart/remove/
    {
        "product_id": 1
    }
    """
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        logger.info(f"Removing from cart for user: {request.user}")
        product_id = request.data.get('product_id')
        logger.info(f"Product ID to remove: {product_id}")
        
        if not product_id:
            return Response({
                'success': False,
                'message': 'product_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(CartItem, cart=cart, product_id=product_id)
        
        cart_item.delete()
        
        return Response({
            'success': True,
            'message': 'Product removed from cart',
            'cart': CartSerializer(cart, context={'request': request}).data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        import traceback
        logger.error(f"Error in remove_from_cart: {str(e)}")
        logger.error(traceback.format_exc())
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@csrf_exempt
@permission_classes([IsAuthenticated])
def clear_cart(request):
    """
    Clear all items from cart
    
    POST /api/cart/clear/
    """
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        logger.info(f"Clearing cart for user: {request.user}")
        cart = get_object_or_404(Cart, user=request.user)
        cart.items.all().delete()
        logger.info(f"Cart cleared successfully")
        
        return Response({
            'success': True,
            'message': 'Cart cleared successfully',
            'cart': CartSerializer(cart, context={'request': request}).data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        import traceback
        logger.error(f"Error in clear_cart: {str(e)}")
        logger.error(traceback.format_exc())
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
