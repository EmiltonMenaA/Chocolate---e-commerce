from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CheckoutPedidoView,
    CustomTokenObtainPairView,
    LogoutView,
    MeView,
    PanelPedidoEnvioUpdateView,
    PanelPedidoListView,
    MisPedidosListView,
    PanelProductoListView,
    ProductoDetailView,
    ProductoListCreateView,
    RegistroClienteView,
    RegistroTiendaView,
    ReseñaListCreateView,
    PedidoDetalladoView,
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
    path('pedidos/checkout/', CheckoutPedidoView.as_view(), name='pedido_checkout'),
    # Panel (vendor-only)
    path('panel/productos/', PanelProductoListView.as_view(), name='panel_productos'),
    path('panel/pedidos/', PanelPedidoListView.as_view(), name='panel_pedidos'),
    path('panel/pedidos/<uuid:pk>/envio/', PanelPedidoEnvioUpdateView.as_view(), name='panel_pedido_envio_update'),
    # Reseñas
    path('productos/<uuid:producto_id>/reseñas/', ReseñaListCreateView.as_view(), name='producto_reseñas'),
    # Historial detallado
    path('pedidos/<uuid:pk>/', PedidoDetalladoView.as_view(), name='pedido_detallado'),
]
