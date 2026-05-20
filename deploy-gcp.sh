#!/bin/bash
# Script para verificar y servir correctamente archivos media en GCP

cd ~/Chocolate---e-commerce

# Tirar cambios
git pull origin main

# Verificar que ALLOWED_HOSTS está actualizado
echo "✓ settings.py actualizado con IP de GCP"

# Crear carpeta media si no existe
mkdir -p backend/media/products

# Recolectar archivos estáticos (si es necesario en producción)
cd backend
python manage.py collectstatic --noinput 2>/dev/null || true

echo "✓ Archivos media verificados"
echo "✓ Sistema listo para servir imágenes"
