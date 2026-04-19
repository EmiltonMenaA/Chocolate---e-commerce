from django.http import HttpRequest, JsonResponse
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from ..models import PerfilUsuario
from ..serializers import (
    CustomTokenObtainPairSerializer,
    PerfilUsuarioSerializer,
    RegistroClienteSerializer,
    RegistroTiendaSerializer,
    _build_user_dict,
)


def health(request: HttpRequest) -> JsonResponse:
    return JsonResponse(
        {
            'success': True,
            'data': {
                'status': 'ok',
                'framework': 'django',
                'version': '4.2.13',
            },
        },
        status=200,
    )


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegistroClienteView(generics.CreateAPIView):
    serializer_class = RegistroClienteSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(_build_user_dict(user), status=status.HTTP_201_CREATED)


class RegistroTiendaView(generics.CreateAPIView):
    serializer_class = RegistroTiendaSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(_build_user_dict(user), status=status.HTTP_201_CREATED)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request) -> Response:
        user = request.user
        data = {
            'id': user.id,
            'email': user.email,
            'nombre': user.get_full_name() or user.email,
            'rol': 'cliente',
            'nombre_tienda': '',
            'telefono': '',
            'direccion': '',
        }
        try:
            perfil = user.perfil
            data['rol'] = perfil.rol
            data['nombre_tienda'] = perfil.nombre_tienda
            data['nombre'] = perfil.nombre or data['nombre']
            data['telefono'] = perfil.telefono
            data['direccion'] = perfil.direccion
        except PerfilUsuario.DoesNotExist:
            pass
        return Response(data)

    def patch(self, request) -> Response:
        perfil, _ = PerfilUsuario.objects.get_or_create(
            usuario=request.user,
            defaults={
                'rol': PerfilUsuario.Rol.CLIENTE,
                'nombre': request.user.get_full_name() or request.user.email,
            },
        )
        serializer = PerfilUsuarioSerializer(perfil, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                'id': request.user.id,
                'email': request.user.email,
                'nombre': perfil.nombre or request.user.get_full_name() or request.user.email,
                'rol': perfil.rol,
                'nombre_tienda': perfil.nombre_tienda,
                'telefono': perfil.telefono,
                'direccion': perfil.direccion,
            }
        )


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request) -> Response:
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except (TokenError, Exception):
            pass
        return Response({'detail': 'Sesión cerrada correctamente.'})
