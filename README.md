# Chocolat - E-commerce de skincare

Aplicación full stack con frontend en React y backend en Django REST Framework.

Estado actual del proyecto:

- Autenticación JWT con roles cliente, tienda y admin
- Registro separado para clientes y tiendas
- Sección pública para clientes y panel separado para vendedores
- Catálogo, detalle y home conectados a API real
- Panel de tienda con crear, editar, activar y eliminar productos
- Carga de imágenes de producto en backend
- Dashboard de cliente conectado a pedidos reales
- Comando de seed para poblar base de datos con tiendas, clientes, productos y pedidos

## Stack técnico

- Frontend: React 18, TypeScript, Vite, React Router, Tailwind CSS, Axios
- Backend: Django 4.2, Django REST Framework, Simple JWT, CORS Headers
- Base de datos: PostgreSQL 16
- Infraestructura local: Docker Compose

## Ejecución con Docker

1. Levantar servicios

	docker-compose up -d --build

2. Verificar servicios

	Frontend: http://127.0.0.1:3000

	Backend health: http://127.0.0.1:8000/api/health/

3. Detener servicios

	docker-compose down

## Ejecución local sin Docker

Frontend

1. Instalar dependencias

	npm install

2. Ejecutar desarrollo

	npm run dev

Backend

1. Instalar dependencias

	pip install -r backend/requirements.txt

2. Migrar base de datos

	python backend/manage.py migrate

3. Ejecutar servidor

	python backend/manage.py runserver

## Poblar la base de datos

Comando de seed:

	docker-compose exec web python manage.py seed_data

Con limpieza previa de productos y pedidos:

	docker-compose exec web python manage.py seed_data --reset

Usuarios de prueba creados por seed:

- Tiendas
  - tienda.centro@chocolat.com / 12345678
  - tienda.norte@chocolat.com / 12345678

- Clientes
  - cliente.demo@chocolat.com / 12345678
  - cliente.demo2@chocolat.com / 12345678

## Endpoints principales

Auth

- POST /api/auth/token/
- POST /api/auth/token/refresh/
- POST /api/auth/registro/cliente/
- POST /api/auth/registro/tienda/
- GET /api/auth/me/
- POST /api/auth/logout/

Productos y pedidos

- GET /api/productos/
- POST /api/productos/ (tienda/admin)
- GET /api/productos/{id}/
- PATCH /api/productos/{id}/ (owner/admin)
- DELETE /api/productos/{id}/ (owner/admin)
- GET /api/panel/productos/ (tienda/admin)
- GET /api/pedidos/mis/ (cliente autenticado)

## Reglas funcionales implementadas

- Solo usuarios autenticados pueden agregar al carrito
- Checkout y payment requieren login de cliente
- Solo tienda/admin puede gestionar productos
- Catálogo público muestra productos activos

## Scripts útiles

- npm run dev
- npm run build
- npm run lint
- npm run preview

## Validación

Frontend:

	npm run build

Backend:

	docker-compose exec web python manage.py check

	docker-compose exec web python manage.py test ecommerce.tests -v 1

## Estructura general

- backend/config: configuración de Django
- backend/ecommerce: modelos, serializers, vistas, urls y tests
- backend/ecommerce/management/commands/seed_data.py: carga de datos inicial
- src/components: layout, header, footer, rutas protegidas
- src/context: contexto de autenticación y carrito
- src/pages: home, catálogo, detalle, carrito, checkout, panel tienda, auth

## Derechos de autor

Desarrollado por:

- Emilton Mena Acevedo
- Mariana Hincapié Henao
- Fabián Andrés Buriticá Cardozo
