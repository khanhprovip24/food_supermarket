import requests
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/food-chatbot'

@api_view(['POST', 'OPTIONS'])
@permission_classes([AllowAny])
def chat_proxy(request):
    """
    Proxy endpoint để forward request tới n8n webhook
    Giải quyết CORS issue
    """
    try:
        user_message = request.data.get('message', '')
        
        if not user_message:
            return Response(
                {'error': 'Message is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Forward request tới n8n
        n8n_response = requests.post(
            N8N_WEBHOOK_URL,
            json={'message': user_message},
            timeout=10
        )
        
        if n8n_response.status_code == 200:
            data = n8n_response.json()
            return Response({
                'success': True,
                'message': data.get('message', 'Không thể xử lý câu trả lời')
            })
        else:
            return Response(
                {'error': f'n8n error: {n8n_response.status_code}'},
                status=n8n_response.status_code
            )
    
    except requests.exceptions.Timeout:
        return Response(
            {'error': 'Request timeout - n8n không phản hồi'},
            status=status.HTTP_504_GATEWAY_TIMEOUT
        )
    except requests.exceptions.ConnectionError:
        return Response(
            {'error': 'Cannot connect to n8n - kiểm tra docker container'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
