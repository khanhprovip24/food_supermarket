from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from shop.models import Wishlist, Product
from shop.api.wishlist.serializers import WishlistItemSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wishlist(request):
    """
    Get user's wishlist
    
    GET /api/wishlist/
    """
    try:
        wishlist_items = Wishlist.objects.filter(user=request.user)
        serializer = WishlistItemSerializer(wishlist_items, many=True)
        
        return Response({
            'success': True,
            'count': wishlist_items.count(),
            'items': serializer.data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request):
    """
    Add product to wishlist
    
    POST /api/wishlist/add/
    {
        "product_id": 1
    }
    """
    try:
        product_id = request.data.get('product_id')
        
        if not product_id:
            return Response({
                'success': False,
                'message': 'product_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        product = get_object_or_404(Product, id=product_id)
        
        # Check if already in wishlist
        wishlist_item, created = Wishlist.objects.get_or_create(
            user=request.user,
            product=product
        )
        
        if not created:
            return Response({
                'success': False,
                'message': 'Product is already in your wishlist'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'success': True,
            'message': 'Product added to wishlist',
            'item': {
                'id': wishlist_item.id,
                'product': {
                    'id': product.id,
                    'name': product.name,
                    'price': str(product.price),
                    'image': product.image.url if product.image else None,
                    'stock': product.stock
                }
            }
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_wishlist(request):
    """
    Remove product from wishlist
    
    DELETE /api/wishlist/remove/
    {
        "product_id": 1
    }
    """
    try:
        product_id = request.data.get('product_id')
        
        if not product_id:
            return Response({
                'success': False,
                'message': 'product_id is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        wishlist_item = get_object_or_404(
            Wishlist,
            user=request.user,
            product_id=product_id
        )
        
        wishlist_item.delete()
        
        return Response({
            'success': True,
            'message': 'Product removed from wishlist'
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
