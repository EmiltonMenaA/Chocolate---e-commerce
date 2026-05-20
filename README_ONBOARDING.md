# Onboarding rápido — Chocolate E‑commerce

Objetivo
- Documentar pasos mínimos para que un nuevo desarrollador ponga el proyecto en marcha y comprenda la estructura, convenciones y tareas comunes.

Requisitos
- Node.js >= 18, npm/yarn
- Python 3.11 (compatible con el entorno virtual del proyecto)
- Docker & Docker Compose (para desarrollo con contenedores)

Clonar y preparar
1. Clonar el repositorio:
```bash
git clone git@github.com:EmiltonMenaA/Chocolate---e-commerce.git
cd Chocolate---e-commerce
```

2. Archivos de entorno
- Crear un `.env` en la raíz (no commitear). Ejemplo de variables mínimas:
```env
DJANGO_SECRET_KEY=tu_secreto_aqui
DEBUG=True
VITE_API_URL=http://localhost:8000
VITE_PROXY_TARGET=http://web:8000
```

Instalación local (sin Docker)
```bash
# Backend
python -m venv .venv
.venv\Scripts\activate    # Windows
pip install -r backend/requirements.txt

# Frontend
cd src
npm install
```

Ejecución rápida con Docker Compose (recomendado)
```bash
docker compose up -d --build web frontend
```
Esto levanta el backend en `http://localhost:8000` y el frontend (dev) en `http://localhost:3000`.

Comandos útiles
- Ejecutar migraciones:
  - `docker compose exec web python manage.py migrate`
- Crear superusuario:
  - `docker compose exec web python manage.py createsuperuser`
- Cargar fixtures:
  - `docker compose exec web python manage.py loaddata backend/fixtures/initial_data.json`
- Ver logs:
  - `docker compose logs web --tail 200`

Estructura clave para revisar primero
- `backend/ecommerce/models.py` — modelos principales (Producto, Pedido, Carrito, PerfilUsuario).
- `backend/ecommerce/serializers.py` — cómo se exponen los datos al frontend.
- `src/pages/*` — páginas React que consumen la API.
- `src/services/api.ts` — cliente API y helpers para normalizar URLs de media.

Pruebas y validaciones
- Tests de Django: `docker compose exec web python manage.py test backend`.
- Validar build frontend: `cd src && npm run build`.

Problemas comunes y soluciones rápidas
- Error 500 en `/api/*`: revisar logs de `web` (`docker compose logs web`) y ejecutar migraciones pendientes.
- Imágenes con host `web:8000` inaccesible en navegador: revisar `serializers.py` para evitar `request.build_absolute_uri(...)` con hostname Docker; usar rutas relativas y dejar que el frontend construya orígenes públicos.

Buenas prácticas
- No subir `.env` ni secretos al repositorio.
- Mantener migraciones en `backend/migrations/` y documentar cambios que afecten la base de datos.

¿Qué hacer después?
- Revisar `README_ARCHITECTURE.md` para entender el diseño.
- Ejecutar el flujo de creación de producto y verificar que las imágenes se suben a `backend/media/products/`.

Contacto
- Si tienes dudas, abre un issue o contacta al responsable del repositorio.
