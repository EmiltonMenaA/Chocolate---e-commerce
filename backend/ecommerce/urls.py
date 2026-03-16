from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CustomTokenObtainPairView,
    LogoutView,
    MeView,
    MisPedidosListView,
    PanelProductoListView,
    ProductoDetailView,
    ProductoListCreateView,
    RegistroClienteView,
    RegistroTiendaView,
    health,
)

urlpatterns = [
    path('health/', health, name='health'),
    # Auth
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/registro/cliente/', RegistroClienteView.as_view(), name='registro_cliente'),
    path('auth/registro/tienda/', RegistroTiendaView.as_view(), name='registro_tienda'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    # Products (public read / tienda write)
    path('productos/', ProductoListCreateView.as_view(), name='producto_list_create'),
    path('productos/<uuid:pk>/', ProductoDetailView.as_view(), name='producto_detail'),
    path('pedidos/mis/', MisPedidosListView.as_view(), name='mis_pedidos'),
    # Panel (vendor-only)
    path('panel/productos/', PanelProductoListView.as_view(), name='panel_productos'),
]
