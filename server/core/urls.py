from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.userLogin, name='login'),
    path('register/', views.userRegister, name='register'),
    path('userInfo/', views.userInfo, name='userInfo'),
    path('roomInfo/', views.roomInfo, name='roomInfo')
]