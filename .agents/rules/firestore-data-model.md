---
trigger: always_on
glob: "src/**/*.js"
description: Reglas sobre el modelo de datos de Firestore para este proyecto
---

## Modelo de Datos — RutEs-Admin

### Colecciones y sus Responsabilidades

| Colección  | Propósito                                                                       |
| ---------- | ------------------------------------------------------------------------------- |
| `students` | Datos personales del alumno. NO almacena paradas ni rutas directamente.         |
| `profile`  | Perfiles de padres, tutores, conductores auxiliares y admins.                   |
| `routes`   | Definición de la ruta escolar (nombre, capacidad, conductor, etc.).             |
| `travels`  | Viajes diarios de una ruta agrupados por día y tipo. Mismo `id` que su `route`. |
| `stops`    | Paradas individuales de un alumno en una ruta específica.                       |
| `drivers`  | Conductores. Campo `route` (string) o `routeWorkshop` (array).                  |
| `units`    | Vehículos. Campo `route` (string) o `routeWorkshop` (array).                    |

### Reglas de Oro

1. **Las paradas (`stops`) se crean SOLO al asignar un alumno a una ruta**, nunca al crear el alumno.
2. **El `id` del documento `travels` es el mismo que el `id` de la `route` asociada.**
3. **Rutas de Taller**: usan `routeWorkshop[]` (array) en `drivers`, `units` y `profile` de auxiliar — no el campo `route`.
4. **`tutorActive`**: ID del tutor cuya app mostrará la info del alumno en tiempo real.
5. **`fullName`**: Array `[name, lastName, secondLastName]` todo en minúsculas, para búsqueda textual en Firestore.
6. **`parents`**: Array de `DocumentReference` en el documento del alumno, apuntando a `profile/{uid}`.

### Al crear un Alumno

```
POST /api/students → firebase-admin:
  1. Crear usuario en Firebase Auth (papá, mamá, tutores)
  2. Crear documento en `profile` para cada tutor/padre
  3. Crear documento en `students`
  4. Actualizar `students[]` en cada perfil de padre/tutor (arrayUnion)
  5. Actualizar `parents[]` y `tutors[]` en el documento del alumno
```

### Al eliminar una Ruta

```
removeRoutes(id) →
  1. Leer la ruta para saber si es workshop
  2. Eliminar todos los `stops` donde route == id
  3. Marcar `isDeleted: true` en `travels` y `routes`
  4. Limpiar campo `route` o `routeWorkshop` en driver, auxiliar y unit
```
