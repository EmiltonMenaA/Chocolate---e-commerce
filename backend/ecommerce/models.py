import uuid
from decimal import Decimal

from django.core.validators import MinValueValidator
from django.conf import settings
from django.db import models


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
    imagen = models.ImageField(upload_to='products/')
    activo = models.BooleanField(default=True)

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
        # Valor por defecto mientras no exista modulo de resenas.
        return 0.0


class Carrito(models.Model):
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
