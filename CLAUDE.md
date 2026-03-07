# RutEs-Admin

Panel de administracion escolar para gestion de rutas de transporte. Parte de un ecosistema de tres apps (Admin Web, App Padres, App Auxiliar) que comparten Firebase (Firestore, Auth, FCM, Storage).

## Stack

- Next.js 15 (App Router), React 19, Firebase SDK v12 (web modular), Firebase Admin v13 (server)
- Formik v2 + Yup v1 (formularios), Zustand v5 (estado global), Tanstack Table v8
- TailwindCSS v4 + DaisyUI v3, Radix UI (Select, Tabs, Dialog, Label, Checkbox)
- Sonner (toasts), Nodemailer v8 (correo), @formkit/drag-and-drop, @react-google-maps/api v2

## Convenciones

- **Idioma UI**: Todo texto visible al usuario en **Espanol** (toasts, labels, validaciones, modales). Codigo fuente en Ingles.
- **Importaciones**: Usar alias `@/` que apunta a `src/`.
- **Borrado logico**: Nunca eliminar documentos de Firestore. Usar `isDeleted: true`.
- **Firebase Auth**: Operaciones de Auth SIEMPRE desde `src/app/api/` con `firebase-admin`. Nunca desde el cliente (evitar cambiar sesion del admin).
- **Transacciones**: Operaciones multi-documento criticas (como aprobar viaje con amigo) deben usar `firestore().runTransaction()` desde API routes.
- **Mensajes de error**: En API routes retornar `NextResponse.json({ error: "mensaje" }, { status: 4xx/5xx })`.
- **Console.log**: Eliminar logs de debug antes de entregar.

## Estructura del Proyecto

```
src/app/api/          — Route Handlers backend (firebase-admin). Siempre llamar customInitApp().
src/app/dashboard/    — Paginas del panel de administracion.
src/components/       — Componentes React. Forms/ (pasos), MultiStepForm/ (orquestadores), ui/ (Radix).
src/services/         — Funciones cliente: fetch a API o Firestore SDK web. Patron onSnapshot para tiempo real.
src/store/            — Stores de Zustand. Accesores estaticos: useXxxStore.getState().metodo().
src/hooks/            — Custom hooks (useStudentManager, useStopsStudentDetails).
src/firebase/         — client.js (SDK web), admin.js (Admin SDK), crud.js (funciones genericas).
src/utils/            — validationSchemas.js (Yup), options.js (constantes).
docs/                 — viaje-con-un-amigo.md, prompt-mobile-app.md
```

## Modelo de Datos (Firestore)

Detalle completo en `BASE_DATOS.md`.

- **`students`**: Datos personales. `parents[]`/`tutors[]` (DocumentReference a profile). `statusTravel` (estado del viaje). `tutorActive` (tutor principal). `fullName` (array minusculas para busqueda). NO almacena paradas.
- **`profile`**: Usuarios (padres, tutores, admin, auxiliares). `roles[]`, `students[]`, `tokens[]` (FCM), `schoolId`.
- **`routes`**: Ruta escolar. `workshop: true` = ruta de taller. `unit`, `driver`, `auxiliar` (refs).
- **`travels`**: Mismo ID que route. `{day}.{type}.students[]` (refs) + `{day}.{type}.travelWithFriend[]` (IDs). Tipos: `toSchool`, `toHome`, `workshop`.
- **`stops`**: Paradas individuales: `student`, `route`, `day`, `type`, `coords`. Paradas temporales de amigo: `isTravelWithFriend: true`, ID = `{studentId}_{routeId}_{day}_friend`.
- **`travelsWithFriend`**: Solicitudes viaje con amigo. ID = studentRequestId. `{day}: { route, day, status, student, date, type }`.
- **`drivers`/`units`**: Campo `route` (string) o `routeWorkshop[]` (array) para rutas de taller.
- **`notificationsSchool`**: Subcoleccion `notifications` con `title`, `body`, `category`, `readByUser/Aux/Tutor/School`.

### Reglas clave

- Paradas (`stops`) se crean SOLO al asignar alumno a ruta, nunca al crear alumno.
- ID de `travels` = ID de `routes`.
- Rutas taller (`workshop: true`): usan `routeWorkshop[]` en drivers/units/auxiliar, tipo `workshop` en vez de `toHome`.
- `statusTravel` valores: `""`, `waiting`, `in-transit`, `delivered`, `finished`, `absent`, `toSchool`, `toHome`, `workshop`, `travelWithFriend`, `cancelToSchool`.

## Patrones de Arquitectura

### Formularios Multi-Paso (Formik)

Estado completo en Formik durante todos los pasos. Schemas Yup en `src/utils/validationSchemas.js`. Servicios reciben `values` al final. Pasos individuales usan `useFormikContext()`.

### Stores Zustand

Suscripciones con `onSnapshot`. Acceso fuera de componentes: `useXxxStore.getState()`. Campo `isLoading` obligatorio. Usar `persist` + `sessionStorage` cuando necesario.

### Server vs Client Components

Paginas en `dashboard/` son Server Components por defecto. `"use client"` solo con hooks. Un `page.jsx` NO puede ser `"use client"` Y `async` al mismo tiempo.

## Viaje con un Amigo

Documentado en `docs/viaje-con-un-amigo.md`.

- `POST /api/travel-with-friend`: Padre solicita viaje. Valida capacidad, crea doc en `travelsWithFriend` con `status: "pending"` y `type`.
- `PATCH /api/travel-with-friend`: Admin aprueba/rechaza (transaccion). Al aceptar: crea parada temporal, actualiza `statusTravel`. Al rechazar: limpia parada, resetea status.
- `GET /api/travel-with-friend/{id}`: Consulta solicitudes con datos enriquecidos.
- `GET /api/travel/{auxiliarId}?day&type`: Lista de estudiantes. Invitados insertados despues de su amigo con `studentFriend` y `coords`.

## Al Eliminar una Ruta

`removeRoutes(id)`: eliminar stops, marcar `isDeleted` en travels/routes, limpiar refs en driver/auxiliar/unit, limpiar `travelsWithFriend` asociados, resetear `statusTravel` de estudiantes afectados.

## Gotchas

- **Anti-loop DnD**: `StepStopsEdit`/`StepStops` usan `useRef(isInternalUpdate)` para evitar loop infinito entre `studentsData` y `values.students`.
- **validateServiceType**: En caso `complete + isEditStudent`, usar `setPlace={(value) => setFieldValue(temporalName, value)}`, NO recrear coords originales.
- **Workshop cross-impact**: Un estudiante en ruta taller tiene `statusTravel: "workshop"` en rutas regulares. No sobreescribir.

## Componentes UI disponibles

Usar componentes existentes en lugar de HTML nativo: `<InputField />`, `<SelectField />`, `<Button />`, `<ButtonAction />`, `<Autocomplete />`, `<FileInput />`. Iconos de `@heroicons/react` o `lucide-react`.
