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
    MisPedidosListView,
    PanelPedidoEnvioUpdateView,
    PanelPedidoListView,
    PedidoDetalladoView,
)
from .view_modules.products import PanelProductoListView, ProductoDetailView, ProductoListCreateView
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
    'PanelPedidoListView',
    'PanelPedidoEnvioUpdateView',
    'MisPedidosListView',
    'CheckoutPedidoView',
    'ReseñaListCreateView',
    'PedidoDetalladoView',
]
