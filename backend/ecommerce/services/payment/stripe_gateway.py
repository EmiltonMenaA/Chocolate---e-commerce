import uuid
from decimal import Decimal

from rest_framework.exceptions import ValidationError

from .base import PaymentGateway


class StripeGateway(PaymentGateway):
    """Stripe placeholder implementation ready to be replaced by real SDK calls."""

    def process_payment(self, amount: Decimal, currency: str, token: str | None = None) -> dict:
        if not token:
            raise ValidationError({'detail': 'Se requiere token de pago para procesar con Stripe.'})
        return {
            'status': 'approved',
            'transaction_id': f'STRIPE-{uuid.uuid4().hex[:8].upper()}',
            'amount': str(amount),
            'currency': currency,
        }

    def refund(self, transaction_id: str) -> dict:
        return {
            'status': 'refunded',
            'transaction_id': transaction_id,
        }
