import stripe
from decimal import Decimal

from django.conf import settings

from rest_framework.exceptions import ValidationError

from .base import PaymentGateway


class StripeGateway(PaymentGateway):
    def __init__(self):
        stripe.api_key = settings.STRIPE_SECRET_KEY

    def process_payment(self, amount: Decimal, currency: str, token: str | None = None) -> dict:
        if not token:
            raise ValidationError({'detail': 'Se requiere token de pago para procesar con Stripe.'})

        def retrieve_payment_intent(payment_intent_token: str):
            if payment_intent_token.startswith('pi_'):
                return stripe.PaymentIntent.retrieve(payment_intent_token)
            if '_secret_' in payment_intent_token and payment_intent_token.startswith('pi_'):
                payment_intent_id = payment_intent_token.split('_secret_')[0]
                return stripe.PaymentIntent.retrieve(payment_intent_id)
            return None

        try:
            if token.startswith('pi_') or ('_secret_' in token and token.startswith('pi_')):
                intent = retrieve_payment_intent(token)
                if not intent or intent.status != 'succeeded':
                    raise ValidationError({'detail': 'El pago no se completó correctamente.'})

                return {
                    'status': 'approved',
                    'transaction_id': intent.id,
                    'amount': str(amount),
                    'currency': currency,
                }

            charge = stripe.Charge.create(
                amount=int(amount * 100),
                currency=currency.lower(),
                source=token,
                description='Compra en Chocolate Beauty',
            )
            return {
                'status': 'approved',
                'transaction_id': charge.id,
                'amount': str(amount),
                'currency': currency,
            }
        except ValidationError:
            raise
        except stripe.error.CardError as e:
            raise ValidationError({'detail': str(e.user_message)})
        except stripe.error.StripeError as e:
            raise ValidationError({'detail': str(e.user_message) or 'Error procesando el pago. Intenta de nuevo.'})

    def refund(self, transaction_id: str) -> dict:
        try:
            refund = stripe.Refund.create(charge=transaction_id)
            return {
                'status': 'refunded',
                'transaction_id': refund.id,
            }
        except stripe.error.StripeError as e:
            raise ValidationError({'detail': 'Error procesando el reembolso.'})
