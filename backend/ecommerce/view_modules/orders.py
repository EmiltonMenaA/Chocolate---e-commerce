from rest_framework import generics, permissions, status
from rest_framework.generics import RetrieveAPIView
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Envio, Pedido, PerfilUsuario
from ..serializers import PanelPedidoSerializer, PedidoDetalladoSerializer, PedidoResumenSerializer
from ..services import CheckoutService, ShippingService
from .permissions import IsTienda


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

        try:
            result = ShippingService.update_shipping(pedido=pedido, data=request.data)
        except ValidationError as exc:
            return Response(exc.detail, status=status.HTTP_400_BAD_REQUEST)

        if not result['changed']:
            return Response(
                {
                    'detail': 'Sin cambios para guardar.',
                    'envio': result['envio'],
                }
            )

        return Response(
            {
                'detail': 'Envio actualizado.',
                'envio': result['envio'],
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

    def post(self, request) -> Response:
        pedido = CheckoutService.process_checkout(
            user=request.user,
            items=request.data.get('items'),
            envio_data=request.data.get('envio') or {},
            perfil_data=request.data.get('perfil') or {},
            payment_data=request.data.get('payment') or {},
        )

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


class PedidoDetalladoView(RetrieveAPIView):
    serializer_class = PedidoDetalladoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Pedido.objects.filter(
            usuario=self.request.user
        ).prefetch_related('detalles__producto')
