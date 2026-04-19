import uuid
from decimal import Decimal

from .base import PaymentGateway


class MockGateway(PaymentGateway):
    def process_payment(self, amount: Decimal, currency: str, token: str | None = None) -> dict:
        return {
            'status': 'approved',
            'transaction_id': f'MOCK-{uuid.uuid4().hex[:8].upper()}',
            'amount': str(amount),
            'currency': currency,
        }

    def refund(self, transaction_id: str) -> dict:
        return {
            'status': 'refunded',
            'transaction_id': transaction_id,
        }
