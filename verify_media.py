#!/usr/bin/env python
"""Verificar que Django está sirviendo correctamente los archivos media"""
import os
import sys
from pathlib import Path

sys.path.insert(0, 'backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
os.environ['DB_ENGINE'] = 'sqlite3'

import django
django.setup()

from django.conf import settings
from ecommerce.models import Producto

print("=" * 60)
print("VERIFICACIÓN DE CONFIGURACIÓN MEDIA")
print("=" * 60)

# Verificar configuración
print(f"\n✓ MEDIA_ROOT: {settings.MEDIA_ROOT}")
print(f"✓ MEDIA_URL: {settings.MEDIA_URL}")
print(f"✓ DEBUG: {settings.DEBUG}")
print(f"✓ ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")

# Verificar carpetas
media_dir = Path(settings.MEDIA_ROOT)
print(f"\n✓ Carpeta media existe: {media_dir.exists()}")
if media_dir.exists():
    print(f"  └─ {len(list(media_dir.glob('**/*')))} archivos encontrados")

products_dir = media_dir / 'products'
print(f"✓ Carpeta products existe: {products_dir.exists()}")
if products_dir.exists():
    files = list(products_dir.glob('*.png')) + list(products_dir.glob('*.jpg')) + list(products_dir.glob('*.webp'))
    print(f"  └─ {len(files)} imágenes encontradas")

# Verificar productos con imagen
productos = Producto.objects.exclude(imagen='')
print(f"\n✓ Productos con imagen: {productos.count()}")
for p in productos[:5]:
    if p.imagen:
        print(f"  └─ {p.nombre}: /media/{p.imagen.name}")

print("\n" + "=" * 60)
print("CÓMO SERVIR ARCHIVOS MEDIA EN PRODUCCIÓN")
print("=" * 60)
print("""
En GCP, necesitas una de estas opciones:

1. GUNICORN + WHITENOISE (recomendado):
   pip install whitenoise
   
2. NGINX como reverse proxy (mejor rendimiento):
   - Frontend en puerto 3000
   - Backend (Gunicorn) en puerto 8000
   - Nginx en puerto 80
   - Nginx sirve /media/ desde backend/media/

3. APACHE con mod_wsgi

Para desarrollo en GCP:
   python backend/manage.py runserver 0.0.0.0:8000
""")
