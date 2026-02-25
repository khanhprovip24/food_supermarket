from django.urls import path
from shop.api.cart import views

app_name = 'cart'

urlpatterns = [
    path('add/', views.add_to_cart, name='add'),
    path('', views.get_cart, name='get'),
    path('remove/', views.remove_from_cart, name='remove'),
    path('clear/', views.clear_cart, name='clear'),
]
