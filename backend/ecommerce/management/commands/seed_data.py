from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from ecommerce.models import Categoria, DetallePedido, Pedido, PerfilUsuario, Producto


class Command(BaseCommand):
    help = 'Puebla la base de datos con tiendas, productos y pedidos de ejemplo.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Elimina productos y pedidos existentes antes de crear datos nuevos.',
        )

    def handle(self, *args, **options):
        User = get_user_model()

        if options['reset']:
            DetallePedido.objects.all().delete()
            Pedido.objects.all().delete()
            Producto.objects.all().delete()
            self.stdout.write(self.style.WARNING('Datos de productos/pedidos eliminados.'))

        tiendas_seed = [
            {
                'email': 'tienda.centro@chocolat.com',
                'password': '12345678',
                'first_name': 'Laura',
                'last_name': 'Vega',
                'nombre_tienda': 'Chocolat Centro',
                'telefono': '+52 55 1000 1000',
            },
            {
                'email': 'tienda.norte@chocolat.com',
                'password': '12345678',
                'first_name': 'Carlos',
                'last_name': 'Mora',
                'nombre_tienda': 'Chocolat Norte',
                'telefono': '+52 55 2000 2000',
            },
        ]

        clientes_seed = [
            {
                'email': 'cliente.demo@chocolat.com',
                'password': '12345678',
                'first_name': 'Maria',
                'last_name': 'Lopez',
            },
            {
                'email': 'cliente.demo2@chocolat.com',
                'password': '12345678',
                'first_name': 'Emilton',
                'last_name': 'Mena',
            },
        ]

        productos_seed = [
            {
                'nombre': 'Serum Vitamina C',
                'descripcion': 'Serum antioxidante para iluminar y unificar tono.',
                'precio': Decimal('49.90'),
                'stock': 25,
                'marca': 'Chocolat',
                'categoria': 'Serums',
            },
            {
                'nombre': 'Crema Hidratante Cacao',
                'descripcion': 'Hidratacion profunda para piel normal a seca.',
                'precio': Decimal('39.90'),
                'stock': 30,
                'marca': 'Chocolat',
                'categoria': 'Cremas',
            },
            {
                'nombre': 'Limpiador Suave Diario',
                'descripcion': 'Limpia sin resecar y respeta la barrera de la piel.',
                'precio': Decimal('28.50'),
                'stock': 40,
                'marca': 'Chocolat',
                'categoria': 'Limpiadores',
            },
            {
                'nombre': 'Protector Solar FPS 50',
                'descripcion': 'Proteccion UVA/UVB de uso diario, acabado ligero.',
                'precio': Decimal('35.00'),
                'stock': 45,
                'marca': 'Chocolat',
                'categoria': 'Protector solar',
            },
        ]

        tiendas = []
        for data in tiendas_seed:
            email = data['email']
            user, created = User.objects.get_or_create(
                username=email,
                defaults={
                    'email': email,
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                },
            )
            if created:
                user.set_password(data['password'])
                user.save(update_fields=['password'])

            perfil, _ = PerfilUsuario.objects.get_or_create(
                usuario=user,
                defaults={
                    'rol': PerfilUsuario.Rol.TIENDA,
                    'nombre_tienda': data['nombre_tienda'],
                    'telefono': data['telefono'],
                },
            )
            if perfil.rol != PerfilUsuario.Rol.TIENDA:
                perfil.rol = PerfilUsuario.Rol.TIENDA
            perfil.nombre_tienda = data['nombre_tienda']
            perfil.telefono = data['telefono']
            perfil.save()
            tiendas.append(user)

        clientes = []
        for data in clientes_seed:
            email = data['email']
            user, created = User.objects.get_or_create(
                username=email,
                defaults={
                    'email': email,
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                },
            )
            if created:
                user.set_password(data['password'])
                user.save(update_fields=['password'])

            perfil, _ = PerfilUsuario.objects.get_or_create(
                usuario=user,
                defaults={'rol': PerfilUsuario.Rol.CLIENTE},
            )
            if perfil.rol != PerfilUsuario.Rol.CLIENTE:
                perfil.rol = PerfilUsuario.Rol.CLIENTE
                perfil.save(update_fields=['rol'])
            clientes.append(user)

        productos = []
        for i, data in enumerate(productos_seed):
            tienda = tiendas[i % len(tiendas)]
            categoria, _ = Categoria.objects.get_or_create(nombre=data['categoria'])
            producto, _ = Producto.objects.get_or_create(
                nombre=data['nombre'],
                tienda=tienda,
                defaults={
                    'descripcion': data['descripcion'],
                    'precio': data['precio'],
                    'stock': data['stock'],
                    'marca': data['marca'],
                    'categoria': categoria,
                    'activo': True,
                },
            )
            if not producto.activo:
                producto.activo = True
                producto.save(update_fields=['activo'])
            productos.append(producto)

        if clientes and productos:
            cliente = clientes[0]
            pedido = Pedido.objects.create(
                usuario=cliente,
                estado=Pedido.Estado.CONFIRMADO,
            )
            DetallePedido.objects.create(
                pedido=pedido,
                producto=productos[0],
                cantidad=1,
                precio_unitario=productos[0].precio,
            )
            DetallePedido.objects.create(
                pedido=pedido,
                producto=productos[1],
                cantidad=2,
                precio_unitario=productos[1].precio,
            )
            pedido.calcular_total()

        self.stdout.write(self.style.SUCCESS('Seed completado: tiendas, clientes, productos y pedido de ejemplo.'))
