from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from ..models import DetallePedido, Pedido, Producto, Reseña
from ..serializers import ReseñaSerializer


class ReseñaListCreateView(ListCreateAPIView):
    serializer_class = ReseñaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        producto_id = self.kwargs['producto_id']
        return Reseña.objects.filter(producto__id=producto_id).select_related('usuario')

    def perform_create(self, serializer):
        producto_id = self.kwargs['producto_id']
        producto = Producto.objects.get(id=producto_id)

        ha_comprado = DetallePedido.objects.filter(
            pedido__usuario=self.request.user,
            pedido__estado=Pedido.Estado.CONFIRMADO,
            producto__id=producto_id,
        ).exists()

        if not ha_comprado:
            raise PermissionDenied('Solo puedes reseñar productos que hayas comprado.')
        serializer.save(producto=producto)
