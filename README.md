
```markdown
# Chocolate Beauty — E-commerce de Skincare

Aplicación full stack especializada en productos de cuidado de la piel (skincare).
Permite explorar un catálogo, gestionar el carrito, realizar pedidos con pago real
mediante Stripe, y consultar productos de aliados externos.

## Stack técnico

- **Frontend:** React 18, TypeScript, Vite, React Router, Tailwind CSS, i18next
- **Backend:** Django 4.2, Django REST Framework, Simple JWT, CORS Headers, ReportLab, Stripe
- **Base de datos:** PostgreSQL 16
- **Infraestructura:** Docker Compose
- **Pagos:** Stripe (modo prueba)

## Arquitectura

El proyecto sigue una arquitectura cliente-servidor desacoplada con separación
clara en capas:

```
Frontend React  →  API REST Django  →  Capa de Servicios  →  Modelos  →  PostgreSQL
```

### Capas del backend

- **Vistas** (`view_modules/`): solo reciben la petición y delegan a servicios
- **Servicios** (`services/`): toda la lógica de negocio
  - `CheckoutService` — orquesta el proceso de compra con `@transaction.atomic`
  - `InvoiceService` — genera facturas en PDF con ReportLab
  - `NotificationService` — envía emails de confirmación
  - `ShippingService` — gestiona el ciclo de vida del envío
- **Inversión de dependencias — Pasarela de pagos:**
  - `PaymentGateway` (interfaz abstracta en `services/payment/base.py`)
  - `MockGateway` — para desarrollo y pruebas
  - `StripeGateway` — integración real con Stripe API
  - `factory.py` — selecciona el gateway según la variable `PAYMENT_GATEWAY` del entorno

## Funcionalidades implementadas

### Clientes
- Registro e inicio de sesión con JWT
- Catálogo público con búsqueda y filtros
- Detalle de producto con reseñas y calificación promedio
- Carrito de compras persistente
- Checkout en 3 pasos: envío → pago → confirmación
- Pago real con Stripe Elements (tarjeta de crédito/débito)
- Descarga de factura PDF tras la compra
- Dashboard con historial de pedidos

### Tiendas
- Registro como tienda
- Panel de gestión de productos (crear, editar, activar, eliminar)
- Panel de pedidos con gestión de envíos
- Carga de imágenes de producto

### Sistema
- Roles: cliente, tienda, admin
- Permisos personalizados por rol (`IsTienda`, `IsOwnerOrAdmin`)
- Internacionalización en español e inglés (i18n)
- Página de Productos Aliados consumiendo API externa
- Servicio JSON público en `/api/productos/` para consumo de otros equipos
- 340 líneas de tests unitarios

## Guía rápida

### Requisitos

- Docker Desktop encendido
- Docker Compose v2
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/EmiltonMenaA/Chocolate---e-commerce.git
cd Chocolate---e-commerce
```

### 2. Crear el archivo de entorno

```bash
# Windows
Copy-Item .env.example .env

# Mac/Linux
cp .env.example .env
```

Variables importantes en `.env`:

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DJANGO_DEBUG` | Modo debug | `True` |
| `PAYMENT_GATEWAY` | Gateway de pagos (`mock` o `stripe`) | `mock` |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe | — |
| `STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe | — |
| `POSTGRES_DB` | Nombre de la base de datos | `chocolate_db` |

### 3. Levantar con Docker

```bash
docker compose up -d --build
```

### 4. Verificar que todo está corriendo

```bash
docker compose ps
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000/api/health/

### 5. Poblar la base de datos

```bash
docker compose exec web python manage.py seed_data
```

Con limpieza previa:

```bash
docker compose exec web python manage.py seed_data --reset
```

### 6. Detener servicios

```bash
docker compose down
```

## Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Tienda | tienda.centro@chocolat.com | 12345678 |
| Tienda | tienda.norte@chocolat.com | 12345678 |
| Cliente | cliente.demo@chocolat.com | 12345678 |
| Cliente | cliente.demo2@chocolat.com | 12345678 |

## Tarjetas de prueba Stripe

| Resultado | Número | Fecha | CVV |
|-----------|--------|-------|-----|
| Aprobada | 4242 4242 4242 4242 | Cualquier fecha futura | Cualquier |
|  Rechazada | 4000 0000 0000 0002 | Cualquier fecha futura | Cualquier |
|  Requiere autenticación | 4000 0025 0000 3155 | Cualquier fecha futura | Cualquier |

## Endpoints de la API

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/token/` | Obtener tokens JWT |
| POST | `/api/auth/token/refresh/` | Renovar token |
| POST | `/api/auth/registro/cliente/` | Registro de cliente |
| POST | `/api/auth/registro/tienda/` | Registro de tienda |
| GET | `/api/auth/me/` | Perfil del usuario autenticado |
| POST | `/api/auth/logout/` | Cerrar sesión |

### Productos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos/` | Catálogo público con campo `url` por producto |
| POST | `/api/productos/` | Crear producto (tienda/admin) |
| GET | `/api/productos/{id}/` | Detalle de producto |
| PATCH | `/api/productos/{id}/` | Editar producto (owner/admin) |
| DELETE | `/api/productos/{id}/` | Eliminar producto (owner/admin) |
| GET | `/api/productos-aliados/` | Productos de aliados externos |

### Pedidos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/pedidos/mis/` | Historial de pedidos del cliente |
| POST | `/api/pedidos/checkout/` | Procesar compra |
| GET | `/api/pedidos/{id}/` | Detalle de pedido |
| POST | `/api/pedidos/payment-intent/` | Crear intención de pago con Stripe |

### Panel de tienda
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/panel/productos/` | Productos de la tienda |
| GET | `/api/panel/pedidos/` | Pedidos de la tienda |
| PATCH | `/api/panel/pedidos/{id}/envio/` | Actualizar estado de envío |

## Ejecución sin Docker (opcional)

**Frontend:**
```bash
npm install
npm run dev
```

**Backend:**
```bash
pip install -r backend/requirements.txt
python backend/manage.py migrate
python backend/manage.py runserver
```

## Tests

```bash
# Backend
docker compose exec web python manage.py test ecommerce.tests -v 1

# Frontend (build)
npm run build
```

## Estructura del proyecto

```
├── backend/
│   ├── config/                  # Configuración de Django
│   ├── ecommerce/
│   │   ├── models.py            # 11 modelos de dominio
│   │   ├── serializers.py       # Serializers con validaciones
│   │   ├── views.py             # Punto de entrada (delega a view_modules)
│   │   ├── urls.py              # Rutas de la API
│   │   ├── tests.py             # 340 líneas de tests unitarios
│   │   ├── view_modules/        # Vistas separadas por dominio
│   │   │   ├── auth.py
│   │   │   ├── orders.py
│   │   │   ├── products.py
│   │   │   ├── reviews.py
│   │   │   └── permissions.py
│   │   └── services/            # Capa de servicios
│   │       ├── services.py      # CheckoutService, InvoiceService, NotificationService
│   │       └── payment/
│   │           ├── base.py      # PaymentGateway (interfaz abstracta)
│   │           ├── mock_gateway.py
│   │           ├── stripe_gateway.py
│   │           └── factory.py
│   └── locale/                  # Traducciones i18n (es/en)
├── src/
│   ├── components/              # Header, Footer, Layout, ProtectedRoute
│   ├── context/                 # AuthContext, CartContext
│   ├── i18n/                    # Traducciones React (es.json, en.json)
│   ├── pages/                   # Todas las páginas de la app
│   └── services/                # api.ts
├── docker-compose.yml
├── .env.example
└── README.md
```

## Solución de problemas

**Docker no inicia:**
Asegúrate de que Docker Desktop esté encendido antes de correr `docker compose up`.

**Cambios en frontend que no se reflejan:**
```bash
docker compose restart frontend
```
Luego recarga con `Ctrl + Shift + R`.

**Backend no disponible:**
```bash
docker compose logs web --tail 200
```

## Desarrollado por

- Emilton Mena Acevedo
- Mariana Hincapié Henao
- Fabián Andrés Buriticá Cardozo

Universidad EAFIT — Tópicos especiales en ingeniería de software
```
