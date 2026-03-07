# RutEs-Admin — Contexto del Agente AI

## 🗺️ Descripción del Proyecto

**RutEs-Admin** es un panel de administración escolar para la gestión de rutas de transporte. Permite a los administradores de escuelas gestionar alumnos, padres/tutores, conductores, auxiliares, unidades (vehículos) y las rutas escolares diarias.

Este proyecto es parte de un ecosistema de tres aplicaciones:

1. **RutEs-Admin** (Web/Next.js) — Panel administrativo para escuelas
2. **App de Padres** (Móvil iOS/Android) — Seguimiento de hijos en tiempo real
3. **App de Auxiliar** (Móvil iOS/Android) — Registro de entregas y asistencia

Todas comparten la misma infraestructura Firebase (Firestore, Auth, FCM, Storage).

**Idioma del proyecto:** Todo el código de usuario (mensajes UI, toasts, validaciones) está en **Español**. El código fuente está en Inglés.

---

## 🏗️ Stack Tecnológico

| Tecnología                 | Versión | Uso                                                 |
| -------------------------- | ------- | --------------------------------------------------- |
| **Next.js**                | 15      | Framework fullstack (App Router)                    |
| **React**                  | 19      | UI con componentes                                  |
| **Firebase SDK (web)**     | v12     | Auth y datos cliente (modular)                      |
| **Firebase Admin SDK**     | v13     | Operaciones backend/server                          |
| **Firestore**              | —       | Base de datos NoSQL                                 |
| **Formik**                 | v2      | Manejo de formularios                               |
| **Zustand**                | v5      | Estado global del cliente                           |
| **Yup**                    | v1      | Validaciones de esquema                             |
| **TailwindCSS**            | v4      | Estilos utilitarios                                 |
| **DaisyUI**                | v3      | Componentes pre-estilizados (tablas, etc.)          |
| **Radix UI**               | —       | Componentes accesibles (Select, Tabs, Dialog, etc.) |
| **Tanstack Table**         | v8      | Tablas de datos                                     |
| **Sonner**                 | v1      | Toast notifications                                 |
| **Nodemailer**             | v8      | Envío de correos                                    |
| **@formkit/drag-and-drop** | —       | DnD en paradas de rutas                             |
| **@react-google-maps/api** | v2      | Mapas para coordenadas de paradas                   |

---

## 📁 Estructura de Carpetas Clave

```
src/
├── app/
│   ├── api/                    # Route Handlers (App Router) — backend con firebase-admin
│   │   ├── students/           # CRUD alumnos (GET lista, POST crear con tutores)
│   │   ├── routes/             # CRUD rutas
│   │   ├── drivers/            # CRUD conductores
│   │   ├── travel/             # Viajes del auxiliar (GET lista con estudiantes)
│   │   ├── travel-with-friend/ # Viaje con amigo (POST solicitud, PATCH aprobar/rechazar, GET consulta)
│   │   ├── notifications/      # Notificaciones push (POST enviar, GET listar)
│   │   └── ...
│   └── dashboard/              # Páginas del panel de administración
│       ├── students/           # Lista y detalle de alumnos
│       ├── routes/             # Lista y formulario de rutas
│       ├── travel/             # Administración de solicitudes de viaje con amigo
│       └── ...
├── components/
│   ├── Forms/                  # Pasos de formularios (StepStudent, StepRoute, StepStops…)
│   ├── MultiStepForm/          # Orquestadores de formularios multi-paso (Students, Route, etc.)
│   └── ui/                     # Componentes Radix UI (Label, Tabs, Dialog, etc.)
├── services/                   # Funciones de cliente: fetch a API o Firestore (SDK web)
│   ├── StudentsServices.js
│   ├── RoutesServices.js
│   ├── TravelWithFriendServices.js
│   └── ...
├── store/                      # Stores de Zustand por entidad
│   ├── useStudentsStore.js
│   ├── useRoutesStore.js
│   └── ...
├── hooks/                      # Custom hooks
│   ├── useStudentManager.js    # Manejo de asignación de paradas en formulario de rutas
│   └── useStopsStudentDetails.js  # Paradas en detalle de alumno
├── firebase/
│   ├── client.js               # Inicialización SDK web de Firebase (para cliente)
│   ├── admin.js                # Inicialización Firebase Admin SDK (para server)
│   └── crud.js                 # Funciones genéricas: createDocument, updateDocument, etc.
└── utils/
    ├── validationSchemas.js    # Todos los esquemas Yup del proyecto
    └── options.js              # Constantes: DAYS, SCHOOL_GRADES, STATUS_TRAVEL, TRAVEL_WITH_FRIEND_*, etc.
```

### Documentación

```
docs/
├── viaje-con-un-amigo.md       # Documentación del feature "Viaje con un Amigo"
└── prompt-mobile-app.md        # Especificación para la app móvil
BASE_DATOS.md                   # Esquema detallado de Firestore
INTEGRACION_MOVIL.md            # Integración con apps móviles
```

---

## 🗄️ Modelo de Datos (Firestore)

El esquema está documentado en detalle en `BASE_DATOS.md`. Los puntos clave:

### Colecciones Principales

- **`students`** — Info personal del alumno. Referencias a `profile` (padres/tutores). Campo `tutorActive` indica tutor principal. Campo `statusTravel` indica estado actual del viaje.
- **`profile`** — Perfiles de usuarios (padres, tutores, admin, conductores auxiliares). Campo `students[]` contiene referencias a sus alumnos. Campo `tokens[]` para FCM.
- **`routes`** — Define la ruta escolar: `name`, `unit`, `driver`, `auxiliar`, `workshop` (bool), `schoolId`. El campo `workshop: true` indica ruta de taller.
- **`travels`** — Viajes de una ruta. Mismo ID que la ruta. Estructura anidada por día (`monday`…`friday`) → tipo (`toSchool`, `toHome`, `workshop`) → `students[]` (refs) + `travelWithFriend[]` (IDs).
- **`stops`** — Paradas individuales: `student` (ID), `route` (ID), `day`, `type`, `coords`. Las paradas temporales de viaje con amigo incluyen `isTravelWithFriend: true`.
- **`travelsWithFriend`** — Solicitudes de viaje con amigo. ID = studentRequestId. Estructura por día con `route`, `day`, `status`, `student`, `date`, `type`.
- **`drivers`** — Conductores. Campo `route` o `routeWorkshop[]` con IDs de rutas.
- **`units`** — Vehículos. Campo `route` o `routeWorkshop[]`. Campo `passengers` para capacidad.
- **`notificationsSchool`** — Notificaciones por escuela (subcolección `notifications`).

### Regla de Oro del Esquema

> Las paradas (`stops`) **NO** se crean al crear un alumno. Se crean al asignar un alumno a una ruta mediante el formulario de rutas. El alumno en sí solo almacena datos personales y referencias a sus tutores.

---

## ⚙️ Patrones de Arquitectura del Proyecto

### 1. Operaciones Críticas → API Routes (Server)

Las operaciones que involucran **Firebase Auth** (crear usuarios) o **transacciones Firestore** se DEBEN hacer desde `src/app/api/` usando `firebase-admin` para evitar que el SDK web del cliente cambie la sesión activa del administrador.

```
Crear alumno con papás → POST /api/students → firebase-admin crea usuarios en Auth
Aprobar viaje con amigo → PATCH /api/travel-with-friend → transacción Firestore
Editar datos básicos del alumno → updateDocument() directamente desde el cliente está OK
```

### 2. Suscripciones en Tiempo Real → `onSnapshot`

Los stores de Zustand se alimentan con suscripciones en tiempo real usando `onSnapshot`. Los componentes se suscriben en su `useEffect` y devuelven el `unsubscribe`.

### 3. Formularios Multi-Paso (Formik)

Los formularios complejos (crear alumno, crear ruta) usan Formik con múltiples pasos. El estado completo del formulario se mantiene en Formik durante todos los pasos. Los servicios reciben los `values` del Formik ya completos al final.

### 4. Estado Global (Zustand)

Los stores de Zustand tienen accesores estáticos (`useStudentsStore.getState()`) para ser usados fuera de componentes React (e.g., en los archivos de servicios).

---

## 🚌 Feature: Viaje con un Amigo

Documentado en detalle en `docs/viaje-con-un-amigo.md`. Resumen:

- Un padre solicita que su hijo viaje en la ruta de un amigo (`POST /api/travel-with-friend`)
- El admin escolar aprueba o rechaza desde el dashboard (`PATCH /api/travel-with-friend`)
- Al aceptar: se crea parada temporal en `stops` con ID `{studentRequest}_{route}_{day}_friend`, se actualiza `statusTravel` a `"travelWithFriend"`
- Al rechazar: se limpia la parada temporal, se resetea `statusTravel` (solo si es `"travelWithFriend"`)
- El auxiliar ve al estudiante invitado insertado después de su amigo en la lista de viaje
- El `type` (`toHome`/`workshop`) se guarda en el documento `travelsWithFriend` para evitar inconsistencias

---

## 🚨 Convenciones Importantes

1. **Idioma de mensajes UI**: Siempre en **Español** (modales, toasts, validaciones, etiquetas).
2. **`isDeleted`**: El borrado es **lógico** — nunca se borra fisicamente. Siempre se usa `isDeleted: true`.
3. **Rutas de Taller (`workshop: true`)**: Usan el campo `routeWorkshop` (array) en lugar de `route` (string) en drivers, units y profile de auxiliares. Esto permite que un conductor tenga ruta principal Y rutas de taller. El viaje de regreso usa tipo `workshop` en lugar de `toHome`.
4. **`tutorActive`**: Campo en `students` que guarda el ID del tutor cuya app mostrará la info del alumno en tiempo real.
5. **`fullName`**: Array `[name, lastName, secondLastName]` en minúsculas para búsqueda textual en Firestore.
6. **Importaciones**: Usar alias `@/` que apunta a `src/`.
7. **`statusTravel`**: Campo en `students` que indica el estado del viaje. Valores: `""`, `"waiting"`, `"in-transit"`, `"delivered"`, `"finished"`, `"absent"`, `"toSchool"`, `"toHome"`, `"workshop"`, `"travelWithFriend"`, `"cancelToSchool"`.

---

## 🔑 Variables de Entorno Requeridas

```
NEXT_PUBLIC_URL_API          # URL base de la API (ej: http://localhost:3000/)
NEXT_PUBLIC_FIREBASE_*       # Config pública de Firebase (SDK web)
FIREBASE_ADMIN_*             # Credenciales del Admin SDK (privadas)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY  # API Key de Google Maps
```

---

## 🗺️ Módulo de Rutas — Detalles Internos

### Estructura de `values.students` en Formik (formulario de rutas)

```js
{
  monday: {
    toHome: [ { id, name, lastName, stop: { coords, id }, ... } ],
    toSchool: [ ... ],
    workshop: [ ... ],
  },
  tuesday: { ... },
  // wednesday, thursday, friday
}
```

### Cómo se cargan los alumnos disponibles (`studentsRoutes`)

- **Función:** `getStudentsForRoutes()` → `createStudentsOptions()` en `StudentsServices.js`
- **Regla crítica:** Las paradas de un alumno **NO** se leen del doc `students`. Se consultan directamente desde la colección `stops` con `where("student", "==", student.id)`.
- El documento `students` en Firestore **nunca** almacena un campo `stops[]`. Las paradas viven separadas en `stops` con los campos: `student` (ID), `route` (ID), `day`, `type`, `coords`.
- Cada objeto retornado por `createStudentsOptions` incluye: `id`, `value`, `label`, `stops[]`, `serviceType`, `name`, `lastName`, `secondLastName`, `address`.

### Componente `DayTypePicker` (`src/components/DayTypePicker/index.jsx`)

Navegación visual de días y tipo de viaje para el formulario de paradas. Reemplaza los dropdowns de "Día" y "Tipo de viaje".

- Props: `students` (del Formik), `selectedDay`, `typeTravel`, `onDayChange`, `onTypeChange`, `isWorkshop`
- Muestra pills de días (Lun→Vie) con badge del conteo de alumnos para ese día
- Muestra tabs de tipo (A Casa / A Escuela) solo si `isWorkshop === false`
- Los contadores se calculan en tiempo real desde `values.students`

### Al eliminar una Ruta

```
removeRoutes(id) →
  1. Leer la ruta para saber si es workshop
  2. Eliminar todos los `stops` donde route == id
  3. Marcar `isDeleted: true` en `travels` y `routes`
  4. Limpiar campo `route` o `routeWorkshop` en driver, auxiliar y unit
  5. Limpiar registros de `travelsWithFriend` asociados a la ruta
  6. Resetear `statusTravel` de estudiantes afectados por viaje con amigo
```

### Patrón anti-loop en `useEffect` con `useDragAndDrop`

`StepStopsEdit` y `StepStops` tienen dos `useEffect` que pueden causar loop infinito:

1. `studentsData` cambia → actualiza `values.students` en Formik
2. `values` cambia → actualiza `studentsData` con el día/tipo actual

**Solución:** usar una `ref` como flag:

```js
const isInternalUpdate = useRef(false);

// Al cambiar día/tipo (programático):
useEffect(() => {
  isInternalUpdate.current = true; // marcar como update interno
  setStudentsData(values?.students?.[selectedDayEdit]?.[typeTravel] || []);
}, [selectedDayEdit, typeTravel]); // ← NO incluir values en deps

// Al hacer drag-and-drop (usuario):
useEffect(() => {
  if (isInternalUpdate.current) {
    isInternalUpdate.current = false;
    return; // ignorar si fue interno
  }
  setFieldValue("students", {
    ...values?.students,
    [selectedDayEdit]: { [typeTravel]: studentsData },
  });
}, [studentsData]);
```

### Gotcha: `validateServiceType` — editar coordenadas de parada

En `src/utils/functionsClient.js`, el caso `complete + isEditStudent` de `validateServiceType`:

```js
// ✅ CORRECTO — usar el value recibido
setPlace={(value) => setFieldValue(temporalName, value)}

// ❌ INCORRECTO — ignora el value nuevo, siempre restaura coords originales
setPlace={() => setFieldValue(temporalName, selectedStudent.stop.coords)}
```

### Next.js App Router — Regla Page async vs `"use client"`

Un `page.jsx` **no puede** tener `"use client"` Y ser `async` al mismo tiempo.

- Si la página hace `fetch` server-side → Server Component (sin `"use client"`)
- Si necesita hooks del cliente → convertir a Client Component y mover el fetch a un loader/service separado
