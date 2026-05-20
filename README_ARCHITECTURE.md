# Arquitectura del proyecto — Chocolate E‑commerce

Resumen
- Proyecto monolítico dividido en frontend (React + Vite + TypeScript) y backend (Django + DRF).
- Base de datos ligera para desarrollo (`db.sqlite3`) y almacenamiento de archivos en `media/`.

Principales componentes
- `backend/`: Django 4.2, Django REST Framework, lógica de negocio, modelos y serializadores.
- `src/`: frontend React + Vite con rutas, contextos (`AuthContext`, `CartContext`) y páginas.
- `docker-compose.yml`: define servicios `web` (Django), `frontend` (Vite) y volúmenes para `media`.
- `public/` y `media/`: `public/images` para assets estáticos; `backend/media` para imágenes subidas por usuarios.

Diagrama (texto)
- Browser ↔ Frontend (Vite/Build) ↔ API (`/api/*`) ↔ Django (`web`) ↔ DB (SQLite / producción: Cloud SQL)
  - Media: Browser solicita `/media/...` directamente al backend o al proxy (Nginx) en producción.

Flujos importantes
- Listado de productos: frontend llama a `/api/productos/` → DRF serializa `Producto` → devuelve datos JSON.
- Imágenes: `models.ImageField(upload_to='products/')` guarda archivos en `MEDIA_ROOT` y `MEDIA_URL` es `/media/`.
  - En desarrollo los contenedores comparten el volumen `media_files` para exponer imágenes.
  - Evitar devolver hostnames internos de Docker (ej. `web:8000`) en URLs absolutas — el frontend debe construir orígenes accesibles.

Decisiones de diseño
- Serializers devuelven rutas relativas de media cuando es posible; el frontend normaliza a una URL completa usando `VITE_API_URL` o el host actual.
- Uso de SQLite para desarrollo por simplicidad; producción debería usar Cloud SQL/Postgres y Cloud Storage para media.

Infra y despliegue
- Desarrollo: Docker Compose (`docker compose up -d --build`) para levantar `web` y `frontend`.
- Producción (GCP): desplegar contenedores en VM o Cloud Run, exponer frontend en el puerto 3000 o servir build estático por Nginx, y servir media desde bucket o Nginx.

Archivos claves
- Backend: [backend/config/settings.py](backend/config/settings.py) — configuración de `MEDIA_ROOT`, `MEDIA_URL`, `ALLOWED_HOSTS`.
- Serializers: [backend/ecommerce/serializers.py](backend/ecommerce/serializers.py) — lógica que evita devolver hostnames internos.
- Frontend: [src/services/api.ts](src/services/api.ts) — helpers `getBackendOrigin()` y `normalizeMediaUrl()`.
- Vite config: [vite.config.ts](vite.config.ts) — proxy dev para `/api` y `/media`.
- Docker: [docker-compose.yml](docker-compose.yml) y [backend/Dockerfile](backend/Dockerfile).

Observabilidad y depuración
- Endpoints de salud: `/api/health/`.
- Logs: `docker compose logs web` y `docker compose logs frontend`.
- Comandos útiles para verificar media y API:
  - `curl -i http://127.0.0.1:8000/api/productos/`
  - `curl -I http://127.0.0.1:8000/media/products/<archivo>`

Consideraciones para producción
- No almacenar imágenes en la base de datos — usar Cloud Storage o un almacén de objetos.
- Configurar Nginx para servir archivos estáticos y media, y usar un CDN frente a media públicas.
- Asegurar `ALLOWED_HOSTS`, TLS, y variables sensibles en secretos (Secret Manager / .env fuera del repo).

Contacto y mantenimiento
- Mantener sincronía entre lo que devuelve el backend y cómo el frontend construye URLs de media.
- Revisar migraciones en `backend/migrations/` y mantener fixtures en `backend/fixtures/initial_data.json`.

---
Archivo generado automáticamente: resumen técnico de arquitectura para colaboradores.
