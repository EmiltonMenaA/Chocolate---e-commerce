from rest_framework import generics, permissions
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from ..models import PerfilUsuario, Producto
from ..serializers import ProductoSerializer
from .permissions import IsOwnerOrAdmin, IsTienda


class ProductoPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProductoListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductoSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = ProductoPagination

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
    pagination_class = ProductoPagination

    def get_queryset(self):
        user = self.request.user
        try:
            if user.perfil.rol == PerfilUsuario.Rol.ADMIN:
                return Producto.objects.all().order_by('nombre')
        except PerfilUsuario.DoesNotExist:
            pass
        return Producto.objects.filter(tienda=user).order_by('nombre')


import requests as http_requests
from rest_framework.decorators import api_view
from rest_framework.response import Response

ALLIED_TEAM_API_URL = 'https://fakestoreapi.com/products'


@api_view(['GET'])
def productos_aliados(request):
    try:
        response = http_requests.get(ALLIED_TEAM_API_URL, timeout=5)
        response.raise_for_status()
        return Response(response.json())
    except Exception as e:
        return Response({'error': str(e), 'data': []}, status=200)
