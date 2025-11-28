from django.urls import path
from . import views
urlpatterns = [
    path('compras/', views.compras_list_create, name='compras_list_create'),   
    path('compras/<int:pk>/', views.compra_detail, name='compra_detail'),
    path('compras/<int:pk>/estado/', views.compras_cambiar_estado, name='compras_cambiar_estado'),
    path('register/', views.register, name='register'),
]