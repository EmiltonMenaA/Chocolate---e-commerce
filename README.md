# Chocolate - E-Commerce Premium de Skincare

Un proyecto de e-commerce moderno con frontend en React + Vite y backend en Django 4.

## Características

-  Interfaz moderna y responsiva
-  Tema oscuro/claro
-  Catálogo de productos con filtros
-  Carrito de compras funcional
-  Flujo de checkout multipasos
-  Autenticación de usuarios
-  Dashboard de cliente
-  Dashboard de vendedor
-  Cuestionario de tipo de piel personalizado
-  Diseño completamente responsivo

## Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Type safety
- **Vite** - Build tool rápido
- **Tailwind CSS** - Utilidades CSS
- **React Router** - Enrutamiento
- **Django 4.2** - Backend y API


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

## Backend Django 4

1. Instala dependencias del backend
```bash
pip install -r backend/requirements.txt
```

2. Aplica migraciones
```bash
python backend/manage.py migrate
```

3. Ejecuta el servidor Django
```bash
python backend/manage.py runserver
```

4. Verifica el endpoint de salud
```bash
GET http://127.0.0.1:8000/api/health/
```

## Ejecutar Con Docker (Django + PostgreSQL)

1. Construir y levantar contenedores
```bash
docker compose up --build
```

2. Verificar backend
```bash
http://127.0.0.1:8000/api/health/
```

3. Detener contenedores
```bash
docker compose down
```

Servicios creados por Docker Compose:
- `web`: Django 4 en `http://127.0.0.1:8000`
- `db`: PostgreSQL 16 en puerto `5432`

## Estructura de Carpetas

```
backend/
├── config/          # Proyecto Django (settings/urls/wsgi/asgi)
├── ecommerce/       # App base del backend
├── manage.py
└── requirements.txt

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


1. **Integración API**: Conectar con un backend (Node.js, Django, etc.)
2. **Gestión de Estado**: Implementar Zustand o Redux para estado global
3. **Autenticación**: Integrar sistema de autenticación real
4. **Pagos**: Integrar Stripe, PayPal o similar
5. **Base de Datos**: Configurar base de datos para productos y órdenes
6. **Testing**: Agregar pruebas unitarias e integración

##  Derechos de autor

Este código ha sido desarrollado por:

- **Emilton Mena Acevedo**  
- **Mariana Hincapié Henao**  
- **Fabián Andrés Buriticá Cardozo**

Todos los derechos reservados ©
