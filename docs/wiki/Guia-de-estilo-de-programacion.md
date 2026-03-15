# Guia de estilo de programacion

## 1. Estructura y organizacion
- Mantener apps separadas por dominio (users, products, orders).
- No mezclar logica de negocio en vistas; usar servicios o helpers.
- Rutas por app incluidas desde urls del proyecto principal.

## 2. Nombres
- Clases en PascalCase: `ProductView`, `OrderService`.
- Funciones y variables en snake_case: `create_order`, `total_price`.
- Archivos de templates en snake_case con extension `.html`.

## 3. Formato del codigo
- Indentacion de 4 espacios.
- Maximo 88 caracteres por linea.
- Una responsabilidad principal por funcion.
- Funciones idealmente menores a 40 lineas.

## 4. Tipado y contratos
- Type hints en funciones de servicio y utilidades.
- Docstrings en funciones no triviales.
- Validar entradas de usuario antes de procesar.

## 5. Base de datos
- Campos con nombres explicitos y semanticos.
- Nunca borrar datos criticos sin respaldo.
- Todo cambio de modelo genera migracion.

## 6. Pruebas
- Toda logica nueva incluye tests.
- Casos minimos: camino feliz, errores esperados, validaciones.

## 7. Flujo de trabajo
- Commits pequenos y enfocados en un solo cambio.
- Pull request con descripcion clara de que cambia y por que.
- No aprobar cambios que violen esta guia.
