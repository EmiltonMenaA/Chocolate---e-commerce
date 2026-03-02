# Carpeta de Imágenes

## Estructura

- **products/** - Imágenes de productos
- **banners/** - Imágenes grandes para banners y secciones hero
- **icons/** - Iconos personalizados

## Cómo usar en componentes

```tsx
// Importar imagen estática
import productImage from '/images/products/serum.jpg'

// O usar ruta directa en img
<img src="/images/products/serum.jpg" alt="Producto" />
```

## Tamaños recomendados

- **Imágenes de producto**: 400x400px (cuadradas)
- **Banners**: 1200x600px (full-width)
- **Iconos**: 64x64px o 128x128px

## Formatos soportados

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- SVG (.svg)

## Nota importante

Las imágenes se sirven desde `/public/images/`, así que la ruta en el código debe comenzar con `/images/`
