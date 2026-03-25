import uuid
from decimal import Decimal
from typing import TYPE_CHECKING

from django.core.validators import MinValueValidator
from django.conf import settings
from django.db import models

if TYPE_CHECKING:
    from django.db.models.manager import RelatedManager


class Producto(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField()
    precio = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
    )
    stock = models.PositiveIntegerField()
    marca = models.CharField(max_length=120)
    categoria = models.CharField(max_length=100, blank=True, default='')
    imagen = models.ImageField(upload_to='products/', blank=True, null=True)
    activo = models.BooleanField(default=True)
    tienda = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='productos',
    )

    def __str__(self) -> str:
        return f'{self.nombre} - {self.marca}'

    def esta_disponible(self) -> bool:
        return self.activo and self.stock > 0

    def actualizar_stock(self, nuevo_stock: int) -> None:
        if nuevo_stock < 0:
            raise ValueError('El stock no puede ser negativo')
        self.stock = nuevo_stock
        self.save(update_fields=['stock'])

    @property
    def calificacion_promedio(self) -> float:
        reseñas = self.reseñas.all()
        if not reseñas.exists():
         return 0.0
        total = sum(r.calificacion for r in reseñas)
        return round(total / reseñas.count(), 1)


class Carrito(models.Model):
    if TYPE_CHECKING:
        items: RelatedManager['ItemCarrito']

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='carrito',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f'Carrito de {self.usuario}'

    @property
    def precio_total(self) -> Decimal:
        total = Decimal('0.00')
        for item in self.items.select_related('producto').all():
            total += item.subtotal
        return total

    def agregar_producto(self, producto: Producto, cantidad: int = 1) -> None:
        if cantidad <= 0:
            raise ValueError('La cantidad debe ser mayor a 0')

        item, creado = ItemCarrito.objects.get_or_create(
            carrito=self,
            producto=producto,
            defaults={'cantidad': cantidad},
        )
        if not creado:
            item.cantidad += cantidad
            item.save(update_fields=['cantidad'])

    def eliminar_producto(self, producto: Producto) -> None:
        self.items.filter(producto=producto).delete()

    def vaciar(self) -> None:
        self.items.all().delete()


class ItemCarrito(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    carrito = models.ForeignKey(
        Carrito,
        on_delete=models.CASCADE,
        related_name='items',
    )
    producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        related_name='carrito_items',
    )
    cantidad = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('carrito', 'producto')

    def __str__(self) -> str:
        return f'{self.cantidad} x {self.producto.nombre}'

    @property
    def subtotal(self) -> Decimal:
        return Decimal(self.producto.precio) * self.cantidad


class Pedido(models.Model):
    class Estado(models.TextChoices):
        PENDIENTE = 'pendiente', 'Pendiente'
        CONFIRMADO = 'confirmado', 'Confirmado'
        ENVIADO = 'enviado', 'Enviado'
        ENTREGADO = 'entregado', 'Entregado'
        CANCELADO = 'cancelado', 'Cancelado'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='pedidos',
    )
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.PENDIENTE,
    )
    total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
    )
    factura_pdf = models.FileField(upload_to='invoices/', blank=True, null=True)

    def __str__(self) -> str:
        return f'Pedido {self.id} — {self.usuario} ({self.get_estado_display()})'

    def confirmar(self) -> None:
        if self.estado != self.Estado.PENDIENTE:
            raise ValueError('Solo se puede confirmar un pedido en estado Pendiente')
        self.estado = self.Estado.CONFIRMADO
        self.save(update_fields=['estado'])

    def cancelar(self) -> None:
        if self.estado in (self.Estado.ENTREGADO, self.Estado.CANCELADO):
            raise ValueError('No se puede cancelar un pedido ya entregado o cancelado')
        self.estado = self.Estado.CANCELADO
        self.save(update_fields=['estado'])

    def calcular_total(self) -> Decimal:
        total = sum(
            (detalle.subtotal for detalle in self.detalles.select_related('producto').all()),
            Decimal('0.00'),
        )
        self.total = total
        self.save(update_fields=['total'])
        return total


class Envio(models.Model):
    class Estado(models.TextChoices):
        PENDIENTE = 'pendiente', 'Pendiente'
        PREPARANDO = 'preparando', 'Preparando'
        ENVIADO = 'enviado', 'Enviado'
        ENTREGADO = 'entregado', 'Entregado'
        CANCELADO = 'cancelado', 'Cancelado'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pedido = models.OneToOneField(
        Pedido,
        on_delete=models.CASCADE,
        related_name='envio',
    )
    direccion_entrega = models.CharField(max_length=255)
    fecha_entrega = models.DateField(blank=True, null=True)
    numero_guia = models.CharField(max_length=80, blank=True, default='')
    estado = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.PENDIENTE,
    )

    def __str__(self) -> str:
        return f'Envio {self.id} - {self.get_estado_display()}'


class DetallePedido(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pedido = models.ForeignKey(
        Pedido,
        on_delete=models.CASCADE,
        related_name='detalles',
    )
    producto = models.ForeignKey(
        Producto,
        on_delete=models.PROTECT,
        related_name='detalles_pedido',
    )
    cantidad = models.PositiveIntegerField()
    # Snapshot del precio al momento de la compra
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self) -> str:
        return f'{self.cantidad} x {self.producto.nombre} (${self.precio_unitario})'

    @property
    def subtotal(self) -> Decimal:
        return Decimal(self.precio_unitario) * self.cantidad


class PerfilUsuario(models.Model):
    class Rol(models.TextChoices):
        CLIENTE = 'cliente', 'Cliente'
        TIENDA = 'tienda', 'Tienda'
        ADMIN = 'admin', 'Administrador'

    usuario = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='perfil',
    )
    rol = models.CharField(
        max_length=10,
        choices=Rol.choices,
        default=Rol.CLIENTE,
    )
    nombre = models.CharField(max_length=200, blank=True, default='')
    nombre_tienda = models.CharField(max_length=200, blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    direccion = models.CharField(max_length=255, blank=True, default='')

    def __str__(self) -> str:
        return f'{self.usuario.email} ({self.get_rol_display()})'

    @property
    def es_tienda(self) -> bool:
        return self.rol == self.Rol.TIENDA

    @property
    def es_admin(self) -> bool:
        return self.rol == self.Rol.ADMIN
    

    
class Reseña(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        related_name='reseñas',
    )
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reseñas',
    )
    calificacion = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1)],
    )
    comentario = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('producto', 'usuario')

    def __str__(self) -> str:
        return f'Reseña de {self.usuario} para {self.producto.nombre} ({self.calificacion}★)'
