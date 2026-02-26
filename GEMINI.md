# RutEs-Admin — Contexto del Agente AI

## 🗺️ Descripción del Proyecto

**RutEs-Admin** es un panel de administración escolar para la gestión de rutas de transporte. Permite a los administradores de escuelas gestionar alumnos, padres/tutores, conductores, auxiliares, unidades (vehículos) y las rutas escolares diarias.

**Idioma del proyecto:** Todo el código de usuario (mensajes UI, toasts, validaciones) está en **Español**. El código fuente está en Inglés.

---

## 🏗️ Stack Tecnológico

| Tecnología                 | Versión          | Uso                                                 |
| -------------------------- | ---------------- | --------------------------------------------------- |
| **Next.js**                | 14+ (App Router) | Framework fullstack                                 |
| **React**                  | 18.2             | UI con componentes                                  |
| **Firebase SDK (web)**     | v9 (modular)     | Auth y datos cliente                                |
| **Firebase Admin SDK**     | v11              | Operaciones backend/server                          |
| **Firestore**              | —                | Base de datos NoSQL                                 |
| **Formik**                 | v2               | Manejo de formularios                               |
| **Zustand**                | v4               | Estado global del cliente                           |
| **Yup**                    | v1               | Validaciones de esquema                             |
| **TailwindCSS + DaisyUI**  | 3.x              | Estilos                                             |
| **Radix UI**               | —                | Componentes accesibles (Select, Tabs, Dialog, etc.) |
| **Tanstack Table**         | v8               | Tablas de datos                                     |
| **Sonner**                 | v1               | Toast notifications                                 |
| **Nodemailer**             | v6               | Envío de correos                                    |
| **@formkit/drag-and-drop** | —                | DnD en paradas de rutas                             |
| **@react-google-maps/api** | —                | Mapas para coordenadas de paradas                   |

---

## 📁 Estructura de Carpetas Clave

```
src/
├── app/
│   ├── api/              # Route Handlers (App Router) — backend con firebase-admin
│   │   ├── students/     # CRUD alumnos (GET lista, POST crear con tutores)
│   │   ├── routes/       # CRUD rutas
│   │   ├── drivers/      # CRUD conductores
│   │   └── ...
│   └── dashboard/        # Páginas del panel de administración
│       ├── students/     # Lista y detalle de alumnos
│       ├── routes/       # Lista y formulario de rutas
│       └── ...
├── components/
│   ├── Forms/            # Pasos de formularios (StepStudent, StepRoute, StepStops…)
│   └── MultiStepForm/    # Orquestadores de formularios multi-paso (Students, Route, etc.)
├── services/             # Funciones de cliente: fetch a API o Firestore (SDK web)
│   ├── StudentsServices.js
│   ├── RoutesServices.js
│   └── ...
├── store/                # Stores de Zustand por entidad
│   ├── useStudentsStore.js
│   ├── useRoutesStore.js
│   └── ...
├── hooks/                # Custom hooks
│   └── useStudentManager.js   # Manejo de asignación de paradas en formulario de rutas
├── firebase/
│   ├── client.js         # Inicialización SDK web de Firebase (para cliente)
│   ├── admin.js          # Inicialización Firebase Admin SDK (para server)
│   └── crud.js           # Funciones genéricas: createDocument, updateDocument, etc.
└── utils/
    ├── validationSchemas.js  # Todos los esquemas Yup del proyecto
    └── options.js            # Constantes: DAYS, SCHOOL_GRADES, tipos de sangre, etc.
```

---

## 🗄️ Modelo de Datos (Firestore)

El esquema está documentado en detalle en `BASE_DATOS.md`. Los puntos clave:

### Colecciones Principales

- **`students`** — Info personal del alumno. Referencias a `profile` (padres/tutores). Campo `tutorActive` indica tutor principal.
- **`profile`** — Perfiles de usuarios (padres, tutores, admin, conductores auxiliares). Campo `students[]` contiene referencias a sus alumnos.
- **`routes`** — Define la ruta escolar: `name`, `capacity`, `unit`, `driver`, `auxiliar`, `workshop` (bool), `schoolId`.
- **`travels`** — Viajes de una ruta. Estructura anidada por día (`monday`…`sunday`) → tipo (`toSchool`, `toHome`, `workshop`) → `students[]` (refs).
- **`stops`** — Paradas individuales: `student` (ID), `route` (ID), `day`, `type`, `coords`.
- **`drivers`** — Conductores. Campo `route` o `routeWorkshop[]` con IDs de rutas.
- **`units`** — Vehículos. Campo `route` o `routeWorkshop[]`.

### Regla de Oro del Esquema

> Las paradas (`stops`) **NO** se crean al crear un alumno. Se crean al asignar un alumno a una ruta mediante el formulario de rutas. El álumno en sí solo almacena datos personales y referencias a sus tutores.

---

## ⚙️ Patrones de Arquitectura del Proyecto

### 1. Operaciones Críticas → API Routes (Server)

Las operaciones que involucran **Firebase Auth** (crear usuarios) se DEBEN hacer desde `src/app/api/` usando `firebase-admin` para evitar que el SDK web del cliente cambie la sesión activa del administrador.

```
Crear alumno con papás → POST /api/students → firebase-admin crea usuarios en Auth
Editar datos básicos del alumno → updateDocument() directamente desde el cliente está OK
```

### 2. Suscripciones en Tiempo Real → `onSnapshot`

Los stores de Zustand se alimentan con suscripciones en tiempo real usando `onSnapshot`. Los componentes se suscriben en su `useEffect` y devuelven el `unsubscribe`.

### 3. Formularios Multi-Paso (Formik)

Los formularios complejos (crear alumno, crear ruta) usan Formik con múltiples pasos. El estado completo del formulario se mantiene en Formik durante todos los pasos. Los servicios reciben los `values` del Formik ya completos al final.

### 4. Estado Global (Zustand)

Los stores de Zustand tienen accesores estáticos (`useStudentsStore.getState()`) para ser usados fuera de componentes React (e.g., en los archivos de servicios).

---

## 🚨 Convenciones Importantes

1. **Idioma de mensajes UI**: Siempre en **Español** (modales, toasts, validaciones, etiquetas).
2. **`isDeleted`**: El borrado es **lógico** — nunca se borra fisicamente. Siempre se usa `isDeleted: true`.
3. **Rutas de Taller (`workshop: true`)**: Usan el campo `routeWorkshop` (array) en lugar de `route` (string) en drivers, units y profile de auxiliares. Esto permite que un conductor tenga ruta principal Y rutas de taller.
4. **`tutorActive`**: Campo en `students` que guarda el ID del tutor cuya app mostrará la info del alumno en tiempo real.
5. **`fullName`**: Array `[name, lastName, secondLastName]` en minúsculas para búsqueda textual en Firestore.
6. **Importaciones**: Usar alias `@/` que apunta a `src/`.

---

## 🔑 Variables de Entorno Requeridas

```
NEXT_PUBLIC_URL_API          # URL base de la API (ej: http://localhost:3000/)
NEXT_PUBLIC_FIREBASE_*       # Config pública de Firebase (SDK web)
FIREBASE_ADMIN_*             # Credenciales del Admin SDK (privadas)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY  # API Key de Google Maps
```
