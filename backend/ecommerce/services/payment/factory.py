from django.conf import settings

from .base import PaymentGateway
from .mock_gateway import MockGateway
from .stripe_gateway import StripeGateway


def get_payment_gateway() -> PaymentGateway:
    provider = str(getattr(settings, 'PAYMENT_GATEWAY', 'mock')).strip().lower()
    if provider == 'stripe':
        return StripeGateway()
    return MockGateway()
