from decimal import Decimal
from io import BytesIO
from datetime import date

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.mail import send_mail
from django.db import transaction
from django.db.models import F
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from rest_framework.exceptions import ValidationError

from ..models import DetallePedido, Envio, Pedido, PerfilUsuario, Producto
from .payment.base import PaymentGateway
from .payment.factory import get_payment_gateway


class InvoiceService:
    @staticmethod
    def _money(value: Decimal) -> str:
        return f'{value:,.2f}'

    @staticmethod
    def build_invoice_pdf(pedido: Pedido) -> bytes:
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        y = height - 50
        pdf.setFont('Helvetica-Bold', 16)
        pdf.drawString(50, y, 'Factura de Compra')

        y -= 24
        pdf.setFont('Helvetica', 10)
        pdf.drawString(50, y, f'Pedido: {pedido.id}')
        y -= 16
        pdf.drawString(50, y, f'Fecha: {pedido.fecha.strftime("%Y-%m-%d %H:%M UTC")}')
        y -= 16
        pdf.drawString(50, y, f'Cliente: {pedido.usuario.get_full_name() or pedido.usuario.email}')

        y -= 28
        pdf.setFont('Helvetica-Bold', 10)
        pdf.drawString(50, y, 'Producto')
        pdf.drawString(300, y, 'Cant.')
        pdf.drawString(360, y, 'Unitario')
        pdf.drawString(460, y, 'Subtotal')

        y -= 14
        pdf.line(50, y, width - 50, y)
        y -= 16
        pdf.setFont('Helvetica', 10)

        for detalle in pedido.detalles.select_related('producto').all():
            if y < 80:
                pdf.showPage()
                y = height - 50
                pdf.setFont('Helvetica', 10)

            nombre = detalle.producto.nombre[:40]
            pdf.drawString(50, y, nombre)
            pdf.drawRightString(340, y, str(detalle.cantidad))
            pdf.drawRightString(440, y, f'$ {InvoiceService._money(detalle.precio_unitario)}')
            pdf.drawRightString(560, y, f'$ {InvoiceService._money(detalle.subtotal)}')
            y -= 16

        y -= 8
        pdf.line(360, y, 560, y)
        y -= 20
        pdf.setFont('Helvetica-Bold', 12)
        pdf.drawRightString(560, y, f'Total: $ {InvoiceService._money(pedido.total)}')

        pdf.save()
        buffer.seek(0)
        return buffer.getvalue()


class NotificationService:
    @staticmethod
    def send_order_confirmation(pedido: Pedido) -> None:
        recipient = pedido.usuario.email
        if not recipient:
            return

        subject = f'Confirmacion de pedido {pedido.id}'
        message = (
            'Tu compra fue procesada correctamente.\n\n'
            f'Pedido: {pedido.id}\n'
            f'Total: {pedido.total}\n'
            f'Estado: {pedido.get_estado_display()}\n'
        )

        send_mail(
            subject=subject,
            message=message,
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@chocolat.local'),
            recipient_list=[recipient],
            fail_silently=True,
        )


class CheckoutService:
    @staticmethod
    @transaction.atomic
    def process_checkout(
        user,
        items,
        envio_data,
        perfil_data,
        payment_data=None,
        payment_gateway: PaymentGateway | None = None,
    ) -> Pedido:
        normalized_items = CheckoutService._validate_items(items)
        direccion_entrega = CheckoutService._validate_envio(envio_data)
        perfil_data = perfil_data if isinstance(perfil_data, dict) else {}
        payment_data = payment_data if isinstance(payment_data, dict) else {}
        payment_gateway = payment_gateway or get_payment_gateway()

        product_ids = [item['producto_id'] for item in normalized_items]
        productos = Producto.objects.select_for_update().filter(id__in=product_ids)
        productos_map = {str(producto.id): producto for producto in productos}

        if len(productos_map) != len(set(product_ids)):
            raise ValidationError({'detail': 'Uno o más productos no existen.'})

        stock_errors = []
        for item in normalized_items:
            producto = productos_map[item['producto_id']]
            if not producto.activo:
                stock_errors.append(
                    {
                        'producto_id': item['producto_id'],
                        'nombre': producto.nombre,
                        'detail': 'El producto no está disponible.',
                    }
                )
                continue

            if producto.stock < item['cantidad']:
                stock_errors.append(
                    {
                        'producto_id': item['producto_id'],
                        'nombre': producto.nombre,
                        'detail': f'Stock insuficiente. Disponible: {producto.stock}.',
                    }
                )

        if stock_errors:
            raise ValidationError(
                {
                    'detail': 'No se puede completar la compra por falta de inventario.',
                    'items': stock_errors,
                }
            )

        expected_total = sum(
            (productos_map[item['producto_id']].precio * item['cantidad'] for item in normalized_items),
            Decimal('0.00'),
        )
        payment_result = payment_gateway.process_payment(
            amount=expected_total,
            currency=str(payment_data.get('currency', 'USD')),
            token=payment_data.get('token'),
        )
        if payment_result.get('status') != 'approved':
            raise ValidationError({'detail': 'Pago rechazado por la pasarela seleccionada.'})

        pedido = Pedido.objects.create(
            usuario=user,
            estado=Pedido.Estado.CONFIRMADO,
        )

        total = Decimal('0.00')
        for item in normalized_items:
            producto = productos_map[item['producto_id']]
            cantidad = item['cantidad']

            DetallePedido.objects.create(
                pedido=pedido,
                producto=producto,
                cantidad=cantidad,
                precio_unitario=producto.precio,
            )

            updated_rows = Producto.objects.filter(
                id=producto.id,
                stock__gte=cantidad,
            ).update(stock=F('stock') - cantidad)
            if updated_rows == 0:
                raise ValidationError(
                    {
                        'detail': 'No se puede completar la compra por falta de inventario.',
                        'items': [
                            {
                                'producto_id': item['producto_id'],
                                'nombre': producto.nombre,
                                'detail': 'Stock insuficiente durante la confirmacion de compra.',
                            }
                        ],
                    }
                )
            total += producto.precio * cantidad

        pedido.total = total
        pedido.save(update_fields=['total'])

        Envio.objects.create(
            pedido=pedido,
            direccion_entrega=direccion_entrega,
            estado=Envio.Estado.PENDIENTE,
        )

        CheckoutService._update_profile(user, perfil_data, direccion_entrega)
        CheckoutService._attach_invoice_pdf(pedido)
        NotificationService.send_order_confirmation(pedido)
        return pedido

    @staticmethod
    def _validate_items(items) -> list[dict]:
        if not isinstance(items, list) or not items:
            raise ValidationError({'detail': 'Debes enviar al menos un producto para procesar la compra.'})

        normalized_items: list[dict] = []
        for item in items:
            producto_id = str(item.get('producto_id', '')).strip()
            try:
                cantidad = int(item.get('cantidad', 0))
            except (TypeError, ValueError):
                cantidad = 0

            if not producto_id:
                raise ValidationError({'detail': 'Cada item debe incluir producto_id.'})
            if cantidad <= 0:
                raise ValidationError({'detail': 'La cantidad de cada producto debe ser mayor a cero.'})

            normalized_items.append({'producto_id': producto_id, 'cantidad': cantidad})

        return normalized_items

    @staticmethod
    def _validate_envio(envio_data) -> str:
        envio_data = envio_data if isinstance(envio_data, dict) else {}
        direccion_entrega = str(envio_data.get('direccion_entrega', '')).strip()
        if not direccion_entrega:
            raise ValidationError({'detail': 'Debes enviar la direccion de entrega para procesar la compra.'})
        return direccion_entrega

    @staticmethod
    def _update_profile(user, perfil_data: dict, direccion_entrega: str) -> None:
        perfil_nombre = str(perfil_data.get('nombre', '')).strip()
        perfil_telefono = str(perfil_data.get('telefono', '')).strip()
        perfil_direccion = str(perfil_data.get('direccion', '')).strip() or direccion_entrega

        perfil, _ = PerfilUsuario.objects.get_or_create(
            usuario=user,
            defaults={'rol': PerfilUsuario.Rol.CLIENTE},
        )
        perfil_changed_fields: list[str] = []
        if perfil_nombre and perfil.nombre != perfil_nombre:
            perfil.nombre = perfil_nombre
            perfil_changed_fields.append('nombre')
        if perfil_telefono and perfil.telefono != perfil_telefono:
            perfil.telefono = perfil_telefono
            perfil_changed_fields.append('telefono')
        if perfil_direccion and perfil.direccion != perfil_direccion:
            perfil.direccion = perfil_direccion
            perfil_changed_fields.append('direccion')
        if perfil_changed_fields:
            perfil.save(update_fields=perfil_changed_fields)

    @staticmethod
    def _attach_invoice_pdf(pedido: Pedido) -> None:
        invoice_content = InvoiceService.build_invoice_pdf(pedido)
        invoice_name = f'factura-{pedido.id}.pdf'
        pedido.factura_pdf.save(invoice_name, ContentFile(invoice_content), save=True)


class ShippingService:
    @staticmethod
    @transaction.atomic
    def update_shipping(*, pedido: Pedido, data: dict) -> dict:
        if not hasattr(pedido, 'envio'):
            raise ValidationError({'detail': 'Este pedido no tiene envio asociado.'})

        envio = pedido.envio
        estado = data.get('estado')
        numero_guia = data.get('numero_guia')
        fecha_entrega = data.get('fecha_entrega')

        changed: list[str] = []
        valid_states = {choice[0] for choice in Envio.Estado.choices}
        if estado is not None:
            estado = str(estado).strip().lower()
            if estado not in valid_states:
                raise ValidationError({'detail': 'Estado de envio invalido.'})
            if envio.estado != estado:
                envio.estado = estado
                changed.append('estado')

        if numero_guia is not None:
            numero_guia = str(numero_guia).strip()
            if envio.numero_guia != numero_guia:
                envio.numero_guia = numero_guia
                changed.append('numero_guia')

        if fecha_entrega is not None:
            fecha_raw = str(fecha_entrega).strip()
            if fecha_raw:
                try:
                    parsed_date = date.fromisoformat(fecha_raw)
                except ValueError as exc:
                    raise ValidationError({'detail': 'fecha_entrega debe tener formato YYYY-MM-DD.'}) from exc
                if envio.fecha_entrega != parsed_date:
                    envio.fecha_entrega = parsed_date
                    changed.append('fecha_entrega')
            elif envio.fecha_entrega is not None:
                envio.fecha_entrega = None
                changed.append('fecha_entrega')

        if changed:
            envio.save(update_fields=changed)

            pedido_estado_map = {
                Envio.Estado.ENTREGADO: Pedido.Estado.ENTREGADO,
                Envio.Estado.ENVIADO: Pedido.Estado.ENVIADO,
                Envio.Estado.CANCELADO: Pedido.Estado.CANCELADO,
                Envio.Estado.PENDIENTE: Pedido.Estado.CONFIRMADO,
                Envio.Estado.PREPARANDO: Pedido.Estado.CONFIRMADO,
            }
            new_pedido_estado = pedido_estado_map.get(envio.estado)
            if new_pedido_estado and pedido.estado != new_pedido_estado:
                pedido.estado = new_pedido_estado
                pedido.save(update_fields=['estado'])

        return {
            'changed': changed,
            'envio': {
                'estado': envio.estado,
                'numero_guia': envio.numero_guia,
                'direccion_entrega': envio.direccion_entrega,
                'fecha_entrega': envio.fecha_entrega.isoformat() if envio.fecha_entrega else None,
            },
        }
