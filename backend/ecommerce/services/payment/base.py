from abc import ABC, abstractmethod
from decimal import Decimal


class PaymentGateway(ABC):
    @abstractmethod
    def process_payment(self, amount: Decimal, currency: str, token: str | None = None) -> dict:
        raise NotImplementedError

    @abstractmethod
    def refund(self, transaction_id: str) -> dict:
        raise NotImplementedError
