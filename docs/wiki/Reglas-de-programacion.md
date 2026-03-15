# Reglas de programacion

## Reglas para rutas
- Toda ruta debe estar asociada a una vista.
- Usar nombres en `path()` cuando la ruta se referencie desde templates.
- Agrupar rutas por app e incluirlas en la configuracion principal.

## Reglas para vistas
- Toda vista tiene una sola responsabilidad principal.
- No escribir logica de negocio compleja directamente en la vista.
- Toda respuesta de API debe tener codigo HTTP y formato JSON consistente.

## Reglas para modelos
- Todo modelo debe tener `__str__` legible.
- Campos obligatorios validados en modelo o formulario.
- Todo cambio de modelo va acompanado de su migracion.

## Reglas para templates
- Todas las plantillas son archivos `.html`.
- Toda vista HTML extiende un `base.html` comun.
- No duplicar bloques de layout entre plantillas.

## Reglas para formularios y validacion
- Ningun dato de entrada se usa sin validacion.
- Mensajes de error claros para el usuario final.
- Reglas criticas de negocio se validan en backend.

## Reglas para seguridad
- No exponer claves, tokens ni credenciales en el repositorio.
- `DEBUG=False` en produccion.
- Endpoints sensibles protegidos con autenticacion y permisos.

## Reglas para Docker
- Todo cambio de dependencia Python requiere reconstruir la imagen: `docker compose up --build`.
- Las migraciones se corren con: `docker compose exec web python manage.py migrate`.
- No editar la base de datos directamente; usar migraciones de Django.

## Reglas para pruebas
- Ningun feature de backend se da por terminado sin prueba basica.
- Si un bug llega a produccion: primero crear test que lo reproduzca.

## Regla de cumplimiento del equipo
Si un push no cumple esta pagina o la guia de estilo, rechazar el cambio y remitir al autor a:
- [Guia de estilo de programacion](Guia-de-estilo-de-programacion)
- [Reglas de programacion](Reglas-de-programacion)
