from django.urls import path
from shop.api.wishlist import views

app_name = 'wishlist'

urlpatterns = [
    path('', views.get_wishlist, name='list'),
    path('add/', views.add_to_wishlist, name='add'),
    path('remove/', views.remove_from_wishlist, name='remove'),
]
