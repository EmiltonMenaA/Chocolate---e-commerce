# Entregable

## Elemento 1. Wiki principal
Pagina principal con descripcion, integrantes y enlaces a subpaginas.
Ver: [Home](Home)

## Elemento 2. Esta pagina (Entregable)
Documenta los elementos 1 a 4 y su estado de cumplimiento.

## Elemento 3. Guia de estilo de programacion
Ver: [Guia de estilo de programacion](Guia-de-estilo-de-programacion)

## Elemento 4. Reglas de programacion
Ver: [Reglas de programacion](Reglas-de-programacion)

---

## Entorno Docker - Configuracion y Comandos

### Archivos creados
- `Dockerfile` - imagen Django + Gunicorn
- `Dockerfile.frontend` - imagen React + Vite
- `docker-compose.yml` - servicios: web, db, frontend
- `.env.example` - variables de entorno de referencia
- `.gitignore` actualizado para excluir `.env`

### Servicios en docker-compose.yml
| Servicio   | Tecnologia        | Puerto |
|------------|-------------------|--------|
| web        | Django + Gunicorn | 8000   |
| db         | PostgreSQL 16     | 5432   |
| frontend   | React + Vite      | 3000   |

### Comandos principales

Levantar todos los servicios (primera vez o tras cambios):
```bash
docker compose up --build
```

Levantar en segundo plano:
```bash
docker compose up --build -d
```

Aplicar migraciones dentro del contenedor:
```bash
docker compose exec web python manage.py migrate
```

Crear superusuario Django:
```bash
docker compose exec web python manage.py createsuperuser
```

Ver logs del backend:
```bash
docker compose logs -f web
```

Detener todos los servicios:
```bash
docker compose down
```

### Criterios de aceptacion cumplidos
- [x] `docker compose up --build` levanta los 3 servicios sin errores
- [x] Migraciones corren automaticamente dentro del contenedor al iniciar
- [x] Frontend React se conecta al backend Django via proxy en `/api`
- [x] Comandos `migrate` y `createsuperuser` funcionan con `docker compose exec`
