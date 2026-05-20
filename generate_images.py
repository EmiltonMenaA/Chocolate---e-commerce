#!/usr/bin/env python
"""Generate placeholder product images directly to media folder"""
import os
import sys
from pathlib import Path
from io import BytesIO

# Setup Django
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
os.environ['DB_ENGINE'] = 'sqlite3'

import django
django.setup()

from ecommerce.models import Producto
from PIL import Image, ImageDraw

# Crear carpeta de media si no existe
media_products_dir = Path('backend/media/products')
media_products_dir.mkdir(parents=True, exist_ok=True)

print(f'Usando carpeta: {media_products_dir.absolute()}')

# Generar imágenes para todos los productos sin imagen
productos = Producto.objects.filter(imagen='')
print(f'\nEncontramos {productos.count()} productos sin imagen')

for producto in productos:
    # Crear imagen placeholder
    img = Image.new('RGB', (400, 400), color=(139, 69, 19))
    draw = ImageDraw.Draw(img)
    
    # Agregar texto
    text = producto.nombre[:25]
    try:
        draw.text((200, 190), text, fill=(255, 255, 255), anchor='mm')
    except:
        draw.text((200, 190), text, fill=(255, 255, 255))
    
    # Guardar directamente en carpeta
    filename = f'{producto.nombre.lower().replace(" ", "_")}.png'
    filepath = media_products_dir / filename
    img.save(filepath)
    
    # Actualizar modelo con la ruta relativa
    producto.imagen = f'products/{filename}'
    producto.save(update_fields=['imagen'])
    
    print(f'✓ {producto.nombre} -> {filename}')

print(f'\n✓ Imágenes generadas en {media_products_dir.absolute()}')

# Verificar
productos_con_imagen = Producto.objects.exclude(imagen='')
print(f'\nAhora hay {productos_con_imagen.count()} productos con imagen:')
for p in productos_con_imagen:
    print(f'  - {p.nombre}: {p.imagen}')
