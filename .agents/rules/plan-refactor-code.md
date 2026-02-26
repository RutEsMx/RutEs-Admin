---
trigger: always_on
glob:
description: Reglas generales de refactorización para RutEs-Admin
---

## Reglas de Refactorización — RutEs-Admin

Al refactorizar código en este proyecto, siempre seguir estas reglas:

### Prioridades

1. **No romper funcionalidad existente.** Si hay duda sobre el impacto de un cambio, crear un plan (`implementation_plan.md`) y pedir aprobación antes de proceder.
2. **Mantener la arquitectura existente** — servicios en `src/services/`, stores en `src/store/`, componentes en `src/components/`.
3. **El borrado es siempre lógico** — nunca eliminar documentos de Firestore directamente. Usar `isDeleted: true`.

### Convenciones de Código

- Mensajes de UI, toasts y validaciones en **Español**.
- Código fuente (variables, funciones) en **Inglés**.
- Usar alias `@/` para importaciones desde `src/`.
- Eliminar `console.log` de debug antes de entregar.

### Firebase

- Operaciones con Firebase Auth → **SIEMPRE desde el servidor** (`src/app/api/` con `firebase-admin`). Nunca desde el cliente.
- Al eliminar una ruta → limpiar en cascada: `stops`, `travels`, y referencias en `drivers`, `units`, `profile`.
- Para rutas de Taller (`workshop: true`) → usar el campo `routeWorkshop` (array) en lugar de `route` (string).

### Zustand

- Usar los métodos específicos del store: `updateStudents`, `removeStudents`, `addStudents`. No reemplazar el array completo.
- Fuera de componentes usar: `useXxxStore.getState().metodo()`.

### Formularios (Formik + Yup)

- Esquemas de validación en `src/utils/validationSchemas.js`.
- Los formularios multi-paso mantienen estado en Formik; los servicios reciben `values` al final del último paso.
