from .view_modules.auth import (
    CustomTokenObtainPairView,
    LogoutView,
    MeView,
    RegistroClienteView,
    RegistroTiendaView,
    health,
)
from .view_modules.orders import (
    CheckoutPedidoView,
    crear_payment_intent,
    MisPedidosListView,
    PanelPedidoEnvioUpdateView,
    PanelPedidoListView,
    PedidoDetalladoView,
)
from .view_modules.products import PanelProductoListView, ProductoDetailView, ProductoListCreateView, productos_aliados
from .view_modules.reviews import ReseñaListCreateView

__all__ = [
    'health',
    'CustomTokenObtainPairView',
    'RegistroClienteView',
    'RegistroTiendaView',
    'MeView',
    'LogoutView',
    'ProductoListCreateView',
    'ProductoDetailView',
    'PanelProductoListView',
    'productos_aliados',
    'PanelPedidoListView',
    'PanelPedidoEnvioUpdateView',
    'MisPedidosListView',
    'crear_payment_intent',
    'CheckoutPedidoView',
    'ReseñaListCreateView',
    'PedidoDetalladoView',
]
