from decimal import Decimal

from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase
from django.urls import reverse

from .models import Carrito, ItemCarrito, Producto


class HealthEndpointTests(TestCase):
    def test_health_endpoint_returns_200(self) -> None:
        response = self.client.get(reverse('health'))
        self.assertEqual(response.status_code, 200)

    def test_health_endpoint_response_shape(self) -> None:
        response = self.client.get(reverse('health'))
        payload = response.json()

        self.assertIn('success', payload)
        self.assertTrue(payload['success'])
        self.assertIn('data', payload)
        self.assertEqual(payload['data']['status'], 'ok')


class ProductoModelTests(TestCase):
    def test_producto_tiene_str_legible(self) -> None:
        producto = Producto.objects.create(
            nombre='Crema Cacao',
            descripcion='Hidratante corporal',
            precio='45.90',
            stock=8,
            marca='Chocolat',
            imagen='products/crema-cacao.jpg',
            activo=True,
        )

        self.assertEqual(str(producto), 'Crema Cacao - Chocolat')

    def test_esta_disponible_depende_de_activo_y_stock(self) -> None:
        producto = Producto.objects.create(
            nombre='Serum Cacao',
            descripcion='Serum antioxidante',
            precio='59.50',
            stock=2,
            marca='Chocolat',
            imagen='products/serum-cacao.jpg',
            activo=True,
        )

        self.assertTrue(producto.esta_disponible())
        producto.actualizar_stock(0)
        self.assertFalse(producto.esta_disponible())

    def test_calificacion_promedio_por_defecto(self) -> None:
        producto = Producto.objects.create(
            nombre='Body Mist',
            descripcion='Bruma perfumada',
            precio='29.90',
            stock=5,
            marca='Chocolat',
            imagen='products/body-mist.jpg',
            activo=True,
        )

        self.assertEqual(producto.calificacion_promedio, 0.0)


class CarritoModelTests(TestCase):
    def setUp(self) -> None:
        user_model = get_user_model()
        self.usuario = user_model.objects.create_user(
            username='cliente1',
            email='cliente1@example.com',
            password='Secret123!'
        )
        self.carrito = Carrito.objects.create(usuario=self.usuario)
        self.producto = Producto.objects.create(
            nombre='Crema Noche',
            descripcion='Crema nutritiva nocturna',
            precio='30.00',
            stock=10,
            marca='Chocolat',
            imagen='products/crema-noche.jpg',
            activo=True,
        )

    def test_carrito_tiene_str_legible(self) -> None:
        self.assertIn('Carrito de', str(self.carrito))

    def test_agregar_producto_y_precio_total(self) -> None:
        self.carrito.agregar_producto(self.producto, cantidad=2)

        self.assertEqual(self.carrito.items.count(), 1)
        self.assertEqual(self.carrito.precio_total, Decimal('60.00'))

    def test_agregar_producto_acumula_cantidad_si_ya_existe(self) -> None:
        self.carrito.agregar_producto(self.producto, cantidad=1)
        self.carrito.agregar_producto(self.producto, cantidad=2)

        item = self.carrito.items.get(producto=self.producto)
        self.assertEqual(item.cantidad, 3)
        self.assertEqual(self.carrito.precio_total, Decimal('90.00'))

    def test_eliminar_producto(self) -> None:
        self.carrito.agregar_producto(self.producto, cantidad=1)
        self.carrito.eliminar_producto(self.producto)

        self.assertEqual(self.carrito.items.count(), 0)

    def test_vaciar_carrito(self) -> None:
        self.carrito.agregar_producto(self.producto, cantidad=1)
        producto_2 = Producto.objects.create(
            nombre='Serum Dia',
            descripcion='Serum ligero',
            precio='20.00',
            stock=4,
            marca='Chocolat',
            imagen='products/serum-dia.jpg',
            activo=True,
        )
        self.carrito.agregar_producto(producto_2, cantidad=1)

        self.carrito.vaciar()
        self.assertEqual(self.carrito.items.count(), 0)


class ItemCarritoModelTests(TestCase):
    def setUp(self) -> None:
        user_model = get_user_model()
        usuario = user_model.objects.create_user(
            username='cliente2',
            email='cliente2@example.com',
            password='Secret123!'
        )
        self.carrito = Carrito.objects.create(usuario=usuario)
        self.producto = Producto.objects.create(
            nombre='Gel Cacao',
            descripcion='Gel de limpieza facial',
            precio='25.00',
            stock=7,
            marca='Chocolat',
            imagen='products/gel-cacao.jpg',
            activo=True,
        )

    def test_item_carrito_tiene_str_legible(self) -> None:
        item = ItemCarrito.objects.create(
            carrito=self.carrito,
            producto=self.producto,
            cantidad=2,
        )
        self.assertEqual(str(item), '2 x Gel Cacao')

    def test_subtotal_calcula_precio_por_cantidad(self) -> None:
        item = ItemCarrito.objects.create(
            carrito=self.carrito,
            producto=self.producto,
            cantidad=3,
        )
        self.assertEqual(item.subtotal, Decimal('75.00'))

    def test_unique_together_carrito_producto(self) -> None:
        ItemCarrito.objects.create(
            carrito=self.carrito,
            producto=self.producto,
            cantidad=1,
        )
        with self.assertRaises(IntegrityError):
            ItemCarrito.objects.create(
                carrito=self.carrito,
                producto=self.producto,
                cantidad=2,
            )
