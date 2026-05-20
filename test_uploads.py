#!/usr/bin/env python
"""Test if file uploads work correctly"""
import os
import sys
from pathlib import Path
from io import BytesIO

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
os.environ['DB_ENGINE'] = 'sqlite3'

import django
django.setup()

from django.core.files.base import ContentFile
from ecommerce.models import Producto, Categoria
from PIL import Image
from django.contrib.auth import get_user_model

User = get_user_model()

# Verificar configuración
from django.conf import settings
print(f"MEDIA_ROOT: {settings.MEDIA_ROOT}")
print(f"MEDIA_URL: {settings.MEDIA_URL}")

# Crear carpeta si no existe
os.makedirs(settings.MEDIA_ROOT / 'products', exist_ok=True)
print(f"\n✓ Carpeta media/products creada/verificada")

# Crear usuario de prueba si no existe
user, _ = User.objects.get_or_create(
    username='test_vendor',
    defaults={
        'email': 'test@example.com',
        'first_name': 'Test',
        'last_name': 'Vendor'
    }
)
print(f"✓ Usuario de prueba: {user.email}")

# Crear categoría
categoria, _ = Categoria.objects.get_or_create(nombre='Test')
print(f"✓ Categoría: {categoria.nombre}")

# Crear producto con imagen de prueba
print("\n→ Creando producto con imagen...")
try:
    # Generar imagen
    img = Image.new('RGB', (200, 200), color=(100, 100, 150))
    img_io = BytesIO()
    img.save(img_io, format='PNG')
    img_io.seek(0)
    
    # Crear producto
    producto, created = Producto.objects.get_or_create(
        nombre='Test Product',
        tienda=user,
        defaults={
            'descripcion': 'Test description',
            'precio': 19.99,
            'stock': 10,
            'marca': 'Test',
            'categoria': categoria,
        }
    )
    
    if created:
        # Guardar imagen
        producto.imagen.save('test_product.png', ContentFile(img_io.getvalue()))
        print(f"✓ Producto creado: {producto.nombre}")
        print(f"  Imagen guardada en: {producto.imagen.path}")
        print(f"  Imagen URL: {producto.imagen.url}")
        
        # Verificar que el archivo existe
        if os.path.exists(producto.imagen.path):
            file_size = os.path.getsize(producto.imagen.path)
            print(f"  ✓ Archivo existe ({file_size} bytes)")
        else:
            print(f"  ✗ ERROR: Archivo no existe en {producto.imagen.path}")
    else:
        print(f"✓ Producto ya existe: {producto.nombre}")
        if producto.imagen:
            print(f"  Imagen URL: {producto.imagen.url}")
        
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()

print("\n✓ Test completado")
