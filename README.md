# Chocolat - E-Commerce Premium de Skincare

Un proyecto de e-commerce moderno construido con React, TypeScript, Tailwind CSS y Vite.

## Características

-  Interfaz moderna y responsiva
-  Tema oscuro/claro
-  Catálogo de productos con filtros
-  Carrito de compras funcional
-  Flujo de checkout multipasos
-  Autenticación de usuarios
-  Cuestionario de tipo de piel personalizado
-  Diseño completamente responsivo

## Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Type safety
- **Vite** - Build tool rápido
- **Tailwind CSS** - Utilidades CSS
- **React Router** - Enrutamiento
- **Zustand** - Gestión de estado (opcional)
- **Axios** - Cliente HTTP (opcional)

## Instalación

1. Clona el repositorio
```bash
git clone <repo-url>
cd E-commerce\ Chocolate
```

2. Instala las dependencias
```bash
npm install
```

3. Inicia el servidor de desarrollo
```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## Estructura de Carpetas

```
src/
├── components/       # Componentes reutilizables
│   ├── Layout.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── pages/           # Páginas de la aplicación
│   ├── HomePage.tsx
│   ├── ProductCatalog.tsx
│   ├── ProductDetail.tsx
│   ├── ShoppingCart.tsx
│   ├── Checkout.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── SkinQuiz.tsx
│   ├── CustomerDashboard.tsx
│   ├── VendorDashboard.tsx
│   ├── AddProduct.tsx
│   └── PaymentMethod.tsx
├── hooks/           # Custom hooks
├── context/         # Context API
├── types/           # TypeScript types
├── styles/          # Estilos globales
├── App.tsx          # Componente raíz
└── main.tsx         # Punto de entrada
```

## Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza build de producción
- `npm run lint` - Ejecuta ESLint

## Próximos Pasos

1. **Integración API**: Conectar con un backend (Node.js, Django, etc.)
2. **Gestión de Estado**: Implementar Zustand o Redux para estado global
3. **Autenticación**: Integrar sistema de autenticación real
4. **Pagos**: Integrar Stripe, PayPal o similar
5. **Base de Datos**: Configurar base de datos para productos y órdenes
6. **Testing**: Agregar pruebas unitarias e integración

## Contribución

Este proyecto es una estructura base. Siéntete libre de personalizarlo según tus necesidades.

## Licencia

MIT
