from django.http import HttpRequest, JsonResponse
from rest_framework import generics, permissions, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Pedido, PerfilUsuario, Producto
from .serializers import (
    CustomTokenObtainPairSerializer,
    PedidoResumenSerializer,
    ProductoSerializer,
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


# ─── Auth ────────────────────────────────────────────────────────────────────

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
        }
        try:
            perfil = user.perfil
            data['rol'] = perfil.rol
            data['nombre_tienda'] = perfil.nombre_tienda
        except PerfilUsuario.DoesNotExist:
            pass
        return Response(data)


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


# ─── Permissions ─────────────────────────────────────────────────────────────

class IsTienda(permissions.BasePermission):
    """Allows access only to users with rol=tienda or rol=admin."""

    def has_permission(self, request, view) -> bool:
        if not request.user.is_authenticated:
            return False
        try:
            return request.user.perfil.rol in (
                PerfilUsuario.Rol.TIENDA,
                PerfilUsuario.Rol.ADMIN,
            )
        except PerfilUsuario.DoesNotExist:
            return False


class IsOwnerOrAdmin(permissions.BasePermission):
    """Object-level: only the product owner or admin can modify."""

    def has_object_permission(self, request, view, obj) -> bool:
        if not request.user.is_authenticated:
            return False
        try:
            rol = request.user.perfil.rol
        except PerfilUsuario.DoesNotExist:
            return False
        if rol == PerfilUsuario.Rol.ADMIN:
            return True
        return obj.tienda == request.user


# ─── Products ─────────────────────────────────────────────────────────────────

class ProductoListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductoSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return Producto.objects.filter(activo=True).order_by('nombre')

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsTienda()]
        return [permissions.AllowAny()]


class ProductoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [IsOwnerOrAdmin()]


class PanelProductoListView(generics.ListAPIView):
    """Returns ALL products (active + inactive) owned by the authenticated vendor."""
    serializer_class = ProductoSerializer
    permission_classes = [IsTienda]

    def get_queryset(self):
        user = self.request.user
        try:
            if user.perfil.rol == PerfilUsuario.Rol.ADMIN:
                return Producto.objects.all().order_by('nombre')
        except PerfilUsuario.DoesNotExist:
            pass
        return Producto.objects.filter(tienda=user).order_by('nombre')


class MisPedidosListView(generics.ListAPIView):
    serializer_class = PedidoResumenSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Pedido.objects
            .filter(usuario=self.request.user)
            .prefetch_related('detalles')
            .order_by('-fecha')
        )

