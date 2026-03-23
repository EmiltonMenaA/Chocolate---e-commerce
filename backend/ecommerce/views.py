from django.http import HttpRequest, JsonResponse
from django.db import transaction
from django.core.files.base import ContentFile
from datetime import date
from decimal import Decimal
from io import BytesIO
from rest_framework import generics, permissions, status
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from .models import DetallePedido, Envio, Pedido, PerfilUsuario, Producto, Reseña
from .serializers import (
    CustomTokenObtainPairSerializer,
    PanelPedidoSerializer,
    PedidoDetalladoSerializer,
    PerfilUsuarioSerializer,
    PedidoResumenSerializer,
    ProductoSerializer,
    RegistroClienteSerializer,
    RegistroTiendaSerializer,
    ReseñaSerializer,
    _build_user_dict,
)


def _money(value: Decimal) -> str:
    return f'{value:,.2f}'


def _build_invoice_pdf(pedido: Pedido) -> bytes:
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    y = height - 50
    pdf.setFont('Helvetica-Bold', 16)
    pdf.drawString(50, y, 'Factura de Compra')

    y -= 24
    pdf.setFont('Helvetica', 10)
    pdf.drawString(50, y, f'Pedido: {pedido.id}')
    y -= 16
    pdf.drawString(50, y, f'Fecha: {pedido.fecha.strftime("%Y-%m-%d %H:%M UTC")}')
    y -= 16
    pdf.drawString(50, y, f'Cliente: {pedido.usuario.get_full_name() or pedido.usuario.email}')

    y -= 28
    pdf.setFont('Helvetica-Bold', 10)
    pdf.drawString(50, y, 'Producto')
    pdf.drawString(300, y, 'Cant.')
    pdf.drawString(360, y, 'Unitario')
    pdf.drawString(460, y, 'Subtotal')

    y -= 14
    pdf.line(50, y, width - 50, y)
    y -= 16
    pdf.setFont('Helvetica', 10)

    for detalle in pedido.detalles.select_related('producto').all():
        if y < 80:
            pdf.showPage()
            y = height - 50
            pdf.setFont('Helvetica', 10)

        nombre = detalle.producto.nombre[:40]
        pdf.drawString(50, y, nombre)
        pdf.drawRightString(340, y, str(detalle.cantidad))
        pdf.drawRightString(440, y, f'$ {_money(detalle.precio_unitario)}')
        pdf.drawRightString(560, y, f'$ {_money(detalle.subtotal)}')
        y -= 16

    y -= 8
    pdf.line(360, y, 560, y)
    y -= 20
    pdf.setFont('Helvetica-Bold', 12)
    pdf.drawRightString(560, y, f'Total: $ {_money(pedido.total)}')

    pdf.save()
    buffer.seek(0)
    return buffer.getvalue()


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


class PanelPedidoListView(generics.ListAPIView):
    serializer_class = PanelPedidoSerializer
    permission_classes = [IsTienda]

    def get_queryset(self):
        user = self.request.user
        try:
            if user.perfil.rol == PerfilUsuario.Rol.ADMIN:
                return (
                    Pedido.objects
                    .select_related('envio', 'usuario')
                    .prefetch_related('detalles')
                    .order_by('-fecha')
                )
        except PerfilUsuario.DoesNotExist:
            pass

        return (
            Pedido.objects
            .filter(detalles__producto__tienda=user)
            .select_related('envio', 'usuario')
            .prefetch_related('detalles')
            .distinct()
            .order_by('-fecha')
        )


class PanelPedidoEnvioUpdateView(APIView):
    permission_classes = [IsTienda]

    @transaction.atomic
    def patch(self, request, pk) -> Response:
        try:
            pedido = (
                Pedido.objects
                .select_related('envio')
                .get(pk=pk)
            )
        except Pedido.DoesNotExist:
            return Response({'detail': 'Pedido no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        try:
            rol = user.perfil.rol
        except PerfilUsuario.DoesNotExist:
            return Response({'detail': 'Perfil no encontrado.'}, status=status.HTTP_403_FORBIDDEN)

        if rol != PerfilUsuario.Rol.ADMIN:
            has_access = pedido.detalles.filter(producto__tienda=user).exists()
            if not has_access:
                return Response({'detail': 'No puedes actualizar este envio.'}, status=status.HTTP_403_FORBIDDEN)

        if not hasattr(pedido, 'envio'):
            return Response({'detail': 'Este pedido no tiene envio asociado.'}, status=status.HTTP_400_BAD_REQUEST)

        envio = pedido.envio
        estado = request.data.get('estado')
        numero_guia = request.data.get('numero_guia')
        fecha_entrega = request.data.get('fecha_entrega')

        changed: list[str] = []
        valid_states = {choice[0] for choice in Envio.Estado.choices}
        if estado is not None:
            estado = str(estado).strip().lower()
            if estado not in valid_states:
                return Response({'detail': 'Estado de envio invalido.'}, status=status.HTTP_400_BAD_REQUEST)
            if envio.estado != estado:
                envio.estado = estado
                changed.append('estado')

        if numero_guia is not None:
            numero_guia = str(numero_guia).strip()
            if envio.numero_guia != numero_guia:
                envio.numero_guia = numero_guia
                changed.append('numero_guia')

        if fecha_entrega is not None:
            fecha_raw = str(fecha_entrega).strip()
            if fecha_raw:
                try:
                    parsed_date = date.fromisoformat(fecha_raw)
                except ValueError:
                    return Response({'detail': 'fecha_entrega debe tener formato YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
                if envio.fecha_entrega != parsed_date:
                    envio.fecha_entrega = parsed_date
                    changed.append('fecha_entrega')
            elif envio.fecha_entrega is not None:
                envio.fecha_entrega = None
                changed.append('fecha_entrega')

        if not changed:
            return Response(
                {
                    'detail': 'Sin cambios para guardar.',
                    'envio': {
                        'estado': envio.estado,
                        'numero_guia': envio.numero_guia,
                        'direccion_entrega': envio.direccion_entrega,
                        'fecha_entrega': envio.fecha_entrega.isoformat() if envio.fecha_entrega else None,
                    },
                }
            )

        envio.save(update_fields=changed)

        # Keep order status aligned with shipping lifecycle shown to customer.
        pedido_estado_map = {
            Envio.Estado.ENTREGADO: Pedido.Estado.ENTREGADO,
            Envio.Estado.ENVIADO: Pedido.Estado.ENVIADO,
            Envio.Estado.CANCELADO: Pedido.Estado.CANCELADO,
            Envio.Estado.PENDIENTE: Pedido.Estado.CONFIRMADO,
            Envio.Estado.PREPARANDO: Pedido.Estado.CONFIRMADO,
        }
        new_pedido_estado = pedido_estado_map.get(envio.estado)
        if new_pedido_estado and pedido.estado != new_pedido_estado:
            pedido.estado = new_pedido_estado
            pedido.save(update_fields=['estado'])

        return Response(
            {
                'detail': 'Envio actualizado.',
                'envio': {
                    'estado': envio.estado,
                    'numero_guia': envio.numero_guia,
                    'direccion_entrega': envio.direccion_entrega,
                    'fecha_entrega': envio.fecha_entrega.isoformat() if envio.fecha_entrega else None,
                },
            }
        )


class MisPedidosListView(generics.ListAPIView):
    serializer_class = PedidoResumenSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Pedido.objects
            .filter(usuario=self.request.user)
            .select_related('envio')
            .prefetch_related('detalles')
            .order_by('-fecha')
        )


class CheckoutPedidoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request) -> Response:
        items = request.data.get('items')
        envio_data = request.data.get('envio') or {}
        perfil_data = request.data.get('perfil') or {}

        if not isinstance(envio_data, dict):
            envio_data = {}
        if not isinstance(perfil_data, dict):
            perfil_data = {}

        direccion_entrega = str(envio_data.get('direccion_entrega', '')).strip()
        if not direccion_entrega:
            return Response(
                {'detail': 'Debes enviar la direccion de entrega para procesar la compra.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

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

        Envio.objects.create(
            pedido=pedido,
            direccion_entrega=direccion_entrega,
            estado=Envio.Estado.PENDIENTE,
        )

        perfil_nombre = str(perfil_data.get('nombre', '')).strip()
        perfil_telefono = str(perfil_data.get('telefono', '')).strip()
        perfil_direccion = str(perfil_data.get('direccion', '')).strip() or direccion_entrega

        perfil, _ = PerfilUsuario.objects.get_or_create(
            usuario=request.user,
            defaults={'rol': PerfilUsuario.Rol.CLIENTE},
        )
        perfil_changed_fields: list[str] = []
        if perfil_nombre and perfil.nombre != perfil_nombre:
            perfil.nombre = perfil_nombre
            perfil_changed_fields.append('nombre')
        if perfil_telefono and perfil.telefono != perfil_telefono:
            perfil.telefono = perfil_telefono
            perfil_changed_fields.append('telefono')
        if perfil_direccion and perfil.direccion != perfil_direccion:
            perfil.direccion = perfil_direccion
            perfil_changed_fields.append('direccion')
        if perfil_changed_fields:
            perfil.save(update_fields=perfil_changed_fields)

        invoice_content = _build_invoice_pdf(pedido)
        invoice_name = f'factura-{pedido.id}.pdf'
        pedido.factura_pdf.save(invoice_name, ContentFile(invoice_content), save=True)

        return Response(
            {
                'id': str(pedido.id),
                'estado': pedido.estado,
                'total': f'{pedido.total:.2f}',
                'factura_pdf_url': pedido.factura_pdf.url if pedido.factura_pdf else None,
                'envio': {
                    'estado': pedido.envio.estado,
                    'numero_guia': pedido.envio.numero_guia,
                    'direccion_entrega': pedido.envio.direccion_entrega,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class ReseñaListCreateView(ListCreateAPIView):
    serializer_class = ReseñaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        producto_id = self.kwargs['producto_id']
        return Reseña.objects.filter(producto__id=producto_id).select_related('usuario')

    def perform_create(self, serializer):
        producto_id = self.kwargs['producto_id']
        producto = Producto.objects.get(id=producto_id)

        # Verificar que el usuario haya comprado el producto.
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