from django.urls import path
from .views import chat_proxy

app_name = 'chatbot'

urlpatterns = [
    path('send/', chat_proxy, name='chat_proxy'),  # Handles both POST and OPTIONS
]
