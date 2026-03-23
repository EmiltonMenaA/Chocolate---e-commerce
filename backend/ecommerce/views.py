from django.http import HttpRequest, JsonResponse
from django.db import transaction
from decimal import Decimal

from rest_framework import generics, permissions, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from .models import DetallePedido, Pedido, PerfilUsuario, Producto, Reseña
from .serializers import (
    CustomTokenObtainPairSerializer,
    PedidoResumenSerializer,
    ProductoSerializer,
    RegistroClienteSerializer,
    RegistroTiendaSerializer,
    ReseñaSerializer,
    PedidoDetalladoSerializer,
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


class CheckoutPedidoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request) -> Response:
        items = request.data.get('items')
        if not isinstance(items, list) or not items:
            return Response(
                {'detail': 'Debes enviar al menos un producto para procesar la compra.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        normalized_items: list[dict] = []
        for item in items:
            producto_id = str(item.get('producto_id', '')).strip()
            try:
                cantidad = int(item.get('cantidad', 0))
            except (TypeError, ValueError):
                cantidad = 0

            if not producto_id:
                return Response(
                    {'detail': 'Cada item debe incluir producto_id.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if cantidad <= 0:
                return Response(
                    {'detail': 'La cantidad de cada producto debe ser mayor a cero.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            normalized_items.append({'producto_id': producto_id, 'cantidad': cantidad})

        product_ids = [item['producto_id'] for item in normalized_items]
        productos = Producto.objects.select_for_update().filter(id__in=product_ids)
        productos_map = {str(producto.id): producto for producto in productos}

        if len(productos_map) != len(set(product_ids)):
            return Response(
                {'detail': 'Uno o más productos no existen.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        stock_errors = []
        for item in normalized_items:
            producto = productos_map[item['producto_id']]
            if not producto.activo:
                stock_errors.append(
                    {
                        'producto_id': item['producto_id'],
                        'nombre': producto.nombre,
                        'detail': 'El producto no está disponible.',
                    }
                )
                continue

            if producto.stock < item['cantidad']:
                stock_errors.append(
                    {
                        'producto_id': item['producto_id'],
                        'nombre': producto.nombre,
                        'detail': f'Stock insuficiente. Disponible: {producto.stock}.',
                    }
                )

        if stock_errors:
            return Response(
                {
                    'detail': 'No se puede completar la compra por falta de inventario.',
                    'items': stock_errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        pedido = Pedido.objects.create(
            usuario=request.user,
            estado=Pedido.Estado.CONFIRMADO,
        )

        total = Decimal('0.00')
        for item in normalized_items:
            producto = productos_map[item['producto_id']]
            cantidad = item['cantidad']

            DetallePedido.objects.create(
                pedido=pedido,
                producto=producto,
                cantidad=cantidad,
                precio_unitario=producto.precio,
            )

            producto.stock -= cantidad
            producto.save(update_fields=['stock'])
            total += producto.precio * cantidad

        pedido.total = total
        pedido.save(update_fields=['total'])

        return Response(
            {
                'id': str(pedido.id),
                'estado': pedido.estado,
                'total': f'{pedido.total:.2f}',
            },
            status=status.HTTP_201_CREATED,
        )

from rest_framework.permissions import IsAuthenticatedOrReadOnly

class ReseñaListCreateView(ListCreateAPIView):
    serializer_class = ReseñaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        producto_id = self.kwargs['producto_id']
        return Reseña.objects.filter(producto__id=producto_id).select_related('usuario')

    def perform_create(self, serializer):
        producto_id = self.kwargs['producto_id']
        producto = Producto.objects.get(id=producto_id)

        # Verificar que el usuario haya comprado el producto
        ha_comprado = DetallePedido.objects.filter(
            pedido__usuario=self.request.user,
            pedido__estado=Pedido.Estado.CONFIRMADO,
            producto__id=producto_id,
        ).exists()

        if not ha_comprado:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Solo puedes reseñar productos que hayas comprado.')

        serializer.save(producto=producto)


class PedidoDetalladoView(RetrieveAPIView):
    serializer_class = PedidoDetalladoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Pedido.objects.filter(
            usuario=self.request.user
        ).prefetch_related('detalles__producto')

