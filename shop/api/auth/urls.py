from django.urls import path
from shop.api.auth import views

app_name = 'auth'

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('me/', views.get_profile, name='profile'),
    path('profile/', views.update_profile, name='update-profile'),
]
