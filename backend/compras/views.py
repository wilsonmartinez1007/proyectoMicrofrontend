from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework import status, serializers
from .models import Compra
from .serializers import CompraSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User  

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def compras_list_create(request):
    if request.method == 'GET':
        compras = Compra.objects.filter(usuario = request.user).order_by('-fecha')
        serializer = CompraSerializer(compras, many=True)
        return Response(serializer.data)
    if request.method == 'POST':
        serializer = CompraSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(usuario=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def compra_detail(request, pk):
    compra = get_object_or_404(Compra, pk=pk, usuario=request.user)
    if request.method == 'GET':
        serializer = CompraSerializer(compra)
        return Response(serializer.data)
    if request.method == 'PUT':
        serializer = CompraSerializer(compra, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        compra.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def compras_cambiar_estado(request, pk):
    compra = get_object_or_404(Compra, pk=pk, usuario=request.user)

    nuevo_estado = request.data.get('estado')
    if nuevo_estado not in ['PENDIENTE', 'PAGADA', 'CANCELADA']:
        return Response(
            {'error': 'Estado inválido.'},
             status=status.HTTP_400_BAD_REQUEST
             )
    compra.estado = nuevo_estado
    compra.save()   
    serializer = CompraSerializer(compra)
    return Response(serializer.data)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "password")

    def create(self, validated_data):
        user = User(username=validated_data["username"])
        user.set_password(validated_data["password"])
        user.save()
        return user


@api_view(['POST'])
@permission_classes([AllowAny]) 
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"detail": "Usuario creado correctamente"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)