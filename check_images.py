import os
import sys
import django

# Cambiar al directorio backend
sys.path.insert(0, 'backend')
os.chdir('backend')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
os.environ['DB_ENGINE'] = 'sqlite3'

django.setup()

from ecommerce.models import Producto

# Obtener primer producto
p = Producto.objects.first()
if p:
    print(f'Producto: {p.nombre}')
    print(f'Imagen field: {p.imagen}')
    if p.imagen:
        print(f'Imagen URL: {p.imagen.url}')
        print(f'Imagen path: {p.imagen.path}')
        print(f'Imagen name: {p.imagen.name}')
    else:
        print('No hay imagen')
else:
    print('No hay productos')

# Listar carpeta media
media_dir = 'media'
if os.path.exists(media_dir):
    print(f'\nContenido de {media_dir}:')
    for root, dirs, files in os.walk(media_dir):
        level = root.replace(media_dir, '').count(os.sep)
        indent = ' ' * 2 * level
        print(f'{indent}{os.path.basename(root)}/')
        subindent = ' ' * 2 * (level + 1)
        for file in files:
            print(f'{subindent}{file}')
else:
    print(f'\nCarpeta {media_dir} no existe')
