# Prompt de Actualizacion - Aplicacion Movil RutEs

## Contexto del Proyecto

RutEs es un ecosistema de gestion de transporte escolar compuesto por:

1. **RutEs-Admin** (Web/Next.js) - Panel administrativo para escuelas
2. **App de Padres** (Movil iOS/Android) - Seguimiento de hijos en tiempo real
3. **App de Auxiliar** (Movil iOS/Android) - Registro de entregas y asistencia

Todas las apps comparten la misma infraestructura Firebase (Firestore, Auth, FCM, Storage).

Este documento describe las funcionalidades actualizadas del backend que la app movil debe soportar.

---

## 1. Estructura de Rutas

### Modelo de Ruta

```javascript
routes/{routeId} = {
  name: string,                   // "Ruta Norte"
  schoolId: string,
  unit: string,                   // ID de la unidad/vehiculo
  driver: string,                 // ID del conductor
  auxiliar: string,               // ID del auxiliar
  workshop: boolean,              // true = ruta de taller, false = ruta regular
  days: string[],                 // ["monday", "tuesday", ...]
  isDeleted: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Tipos de Ruta

| Tipo                  | `workshop` | Tipos de Viaje Disponibles |
| --------------------- | ---------- | -------------------------- |
| **Regular**           | `false`    | `toSchool`, `toHome`       |
| **Taller (Workshop)** | `true`     | `toSchool`, `workshop`     |

**Regla clave**: Las rutas de taller usan `workshop` en lugar de `toHome` para el viaje de regreso. La app debe verificar `route.workshop` para determinar que tipo de viaje mostrar.

### Modelo de Viajes (Travels)

Cada ruta tiene un documento espejo en `travels` con el mismo ID:

```javascript
travels/{routeId} = {
  monday: {
    toSchool: {
      students: [DocumentReference],          // Refs a students/
      travelWithFriend: [string]              // IDs de estudiantes invitados
    },
    toHome: {                                 // Solo rutas regulares
      students: [DocumentReference],
      travelWithFriend: [string]
    },
    workshop: {                               // Solo rutas de taller
      students: [DocumentReference],
      travelWithFriend: [string]
    }
  },
  tuesday: { ... },
  wednesday: { ... },
  thursday: { ... },
  friday: { ... }
}
```

### Endpoint de Viaje por Auxiliar

**`GET /api/travel/{auxiliarId}?day={day}&type={type}`**

Retorna las rutas del auxiliar con la lista de estudiantes para el dia y tipo especificado.

**Parametros:**

- `auxiliarId` (path): ID del auxiliar autenticado
- `day` (query): `monday` | `tuesday` | `wednesday` | `thursday` | `friday`
- `type` (query): `toSchool` | `toHome` | `workshop`

**Respuesta:**

```json
{
  "routeId123": {
    "toHome": {
      "students": [
        { "studentId1": { "statusTravel": "waiting" } },
        { "studentId2": { "statusTravel": "in-transit" } },
        {
          "friendStudentId": {
            "statusTravel": "accepted",
            "studentFriend": "studentId2",
            "coords": { "lat": 19.4326, "lng": -99.1332 }
          }
        }
      ]
    }
  }
}
```

**Filtrado por tipo de ruta:**

- Si `type === "workshop"`: solo retorna rutas donde `route.workshop === true`
- Si `type !== "workshop"`: solo retorna rutas donde `route.workshop !== true`

---

## 2. Modelo de Paradas (Stops) - NUEVO

Las paradas ahora se almacenan como documentos individuales en la coleccion `stops`:

```javascript
stops/{stopId} = {
  student: string,               // ID del estudiante
  route: string,                 // ID de la ruta
  day: string,                   // "monday", "tuesday", etc.
  type: string,                  // "toSchool" | "toHome" | "workshop"
  coords: {
    lat: number,
    lng: number
  },
  isTravelWithFriend: boolean    // true solo en paradas temporales de amigos
}
```

### Consultar Paradas

```javascript
// Paradas de un estudiante en un dia
firestore()
  .collection("stops")
  .where("student", "==", studentId)
  .where("day", "==", "monday")
  .get();

// Paradas de una ruta en un dia y tipo
firestore()
  .collection("stops")
  .where("route", "==", routeId)
  .where("day", "==", "monday")
  .where("type", "==", "toHome")
  .get();
```

### IDs de Paradas Temporales (Viaje con Amigo)

Las paradas de estudiantes invitados (viaje con amigo) tienen un ID deterministico:

```text
{studentRequestId}_{routeId}_{day}_friend
```

Estas paradas incluyen `isTravelWithFriend: true`.

---

## 3. Flujo de Estudiantes y Estados (statusTravel)

### Valores Posibles

| Valor                | Significado                    | Contexto                     |
| -------------------- | ------------------------------ | ---------------------------- |
| `""` (vacio)         | Sin estado / inicio del dia    | Estado inicial               |
| `"waiting"`          | Esperando recogida             | Antes de que el bus llegue   |
| `"in-transit"`       | En el vehiculo                 | Recogido, en movimiento      |
| `"delivered"`        | Entregado                      | Dejado en destino            |
| `"finished"`         | Viaje finalizado               | Fin del viaje completo       |
| `"absent"`           | Ausente                        | No se presento               |
| `"toSchool"`         | En camino a la escuela         | Viaje tipo toSchool activo   |
| `"toHome"`           | En camino a casa               | Viaje tipo toHome activo     |
| `"workshop"`         | En taller/regreso de taller    | Estudiante en ruta de taller |
| `"travelWithFriend"` | Viajando con amigo             | Solicitud de amigo aceptada  |
| `"cancelToSchool"`   | Cancelacion de viaje a escuela | Estado interno               |

### Transiciones de Estado (App del Auxiliar)

```text
Estado Inicial ("")
  |
  ├── "waiting"      → Estudiante esta en la lista de espera
  |     |
  |     ├── "in-transit"  → Auxiliar marca como recogido
  |     |     |
  |     |     └── "delivered" → Auxiliar marca como entregado
  |     |           |
  |     |           └── "finished" → El viaje se completa
  |     |
  |     └── "absent"      → Auxiliar marca como ausente
  |
  └── "workshop"    → Se detecta automaticamente si el estudiante
                       esta en una ruta de taller el mismo dia
```

### Logica de Workshop en statusTravel

Cuando el tipo de viaje NO es `workshop` ni `toSchool`, el backend verifica automaticamente si el estudiante participa en alguna ruta de taller ese dia:

```javascript
// Si no tiene statusTravel o es "cancelToSchool"
// → Buscar si el estudiante esta en alguna ruta de taller ese dia
// Si lo esta → statusTravel = "workshop"
// Si no → statusTravel = ""
```

Esto significa que un estudiante en una ruta regular puede tener `statusTravel: "workshop"` si tambien esta inscrito en una ruta de taller. La app debe respetar este estado y no intentar cambiarlo.

---

## 4. Lista de Asistencia

### Estructura de la Lista

El endpoint `GET /api/travel/{auxiliarId}` retorna la lista de estudiantes organizada por ruta y tipo. Cada entrada es:

```json
{
  "studentId": {
    "statusTravel": "waiting"
  }
}
```

### Estudiantes con Viaje con Amigo en la Lista

Los estudiantes invitados (viaje con amigo aceptado) se insertan inmediatamente despues de su amigo en la lista:

```json
[
  { "student_regular_1": { "statusTravel": "waiting" } },
  { "student_amigo": { "statusTravel": "waiting" } },
  {
    "student_invitado": {
      "statusTravel": "accepted",
      "studentFriend": "student_amigo",
      "coords": { "lat": 19.43, "lng": -99.13 }
    }
  },
  { "student_regular_2": { "statusTravel": "waiting" } }
]
```

**Identificar estudiantes invitados:**

- Tienen `studentFriend` con el ID de su amigo
- Tienen `statusTravel: "accepted"` (no "waiting")
- Pueden tener `coords` con las coordenadas de su parada temporal

### Recomendaciones para la App

1. **Diferenciar visualmente** los estudiantes invitados de los regulares (icono, color, etiqueta)
2. **Mostrar la relacion** - indicar "Viaja con [nombre del amigo]"
3. **Usar las coordenadas del campo `coords`** del invitado para mostrar su punto de recogida en el mapa
4. **No permitir al auxiliar cambiar statusTravel** de un estudiante invitado si su status actual es `"travelWithFriend"` a nivel de coleccion students

### Estudiantes Filtrados

La API filtra automaticamente:

- Estudiantes con `status: "inactive"` (no aparecen en la lista)
- Estudiantes con `statusTravel` nulo se evaluan para workshop

---

## 5. Tracking en Tiempo Real

### Seguimiento del Estudiante (App de Padres)

La app de padres debe suscribirse a cambios en tiempo real del estudiante:

```javascript
import { doc, onSnapshot } from "firebase/firestore";

const unsubscribe = onSnapshot(doc(db, "students", studentId), (doc) => {
  const data = doc.data();
  // data.statusTravel contiene el estado actual
  // Actualizar UI segun el estado
});
```

**Estados a mostrar al padre:**

| statusTravel         | Mensaje Sugerido          | Accion en UI                 |
| -------------------- | ------------------------- | ---------------------------- |
| `""` / `null`        | "Sin viaje activo"        | Estado neutral               |
| `"waiting"`          | "Esperando el transporte" | Animacion de espera          |
| `"in-transit"`       | "En camino"               | Mostrar mapa con posicion    |
| `"delivered"`        | "Entregado en destino"    | Notificacion de confirmacion |
| `"finished"`         | "Viaje finalizado"        | Estado completado            |
| `"absent"`           | "Marcado como ausente"    | Alerta al padre              |
| `"workshop"`         | "En ruta de taller"       | Indicar que es taller        |
| `"travelWithFriend"` | "Viajando con amigo"      | Indicar ruta temporal        |

### Seguimiento de la Unidad (App de Padres)

Para mostrar la ubicacion del autobus en el mapa, suscribirse a la coleccion `tracking`:

```javascript
// El conductor/auxiliar actualiza la posicion en tiempo real
// La app de padres escucha estos cambios
onSnapshot(doc(db, "tracking", routeId), (doc) => {
  const { lat, lng, speed, heading } = doc.data();
  // Actualizar posicion del autobus en el mapa
});
```

### Actualizacion de Status (App del Auxiliar)

El auxiliar actualiza el `statusTravel` directamente en Firestore:

```javascript
import { doc, updateDoc } from "firebase/firestore";

// Marcar como recogido
await updateDoc(doc(db, "students", studentId), {
  statusTravel: "in-transit",
});

// Marcar como entregado
await updateDoc(doc(db, "students", studentId), {
  statusTravel: "delivered",
});

// Marcar como ausente
await updateDoc(doc(db, "students", studentId), {
  statusTravel: "absent",
});
```

---

## 6. Talleres (Workshops)

### Diferencias con Rutas Regulares

| Aspecto              | Ruta Regular | Ruta de Taller                    |
| -------------------- | ------------ | --------------------------------- |
| Campo `workshop`     | `false`      | `true`                            |
| Viaje de ida         | `toSchool`   | `toSchool`                        |
| Viaje de regreso     | `toHome`     | `workshop`                        |
| statusTravel impacto | Normal       | Marca `"workshop"` en otras rutas |

### Flujo del Taller

1. **Asignacion**: El admin asigna estudiantes a rutas de taller desde el dashboard
2. **Viaje a taller**: Tipo `toSchool`, flujo normal
3. **Regreso de taller**: Tipo `workshop` en lugar de `toHome`
4. **Impacto cruzado**: Si un estudiante esta en una ruta de taller, su `statusTravel` en rutas regulares mostrara `"workshop"`

### Implementacion en la App del Auxiliar

```javascript
// Determinar tipo de viaje segun la ruta
const travelType = route.workshop ? "workshop" : "toHome";

// Consultar viaje del dia
const response = await fetch(
  `${API_URL}/api/travel/${auxiliarId}?day=${currentDay}&type=${travelType}`,
);
```

### Selector de Tipo de Viaje

La app debe ofrecer al auxiliar seleccionar el tipo de viaje:

- **Viaje a escuela** (`toSchool`) - Disponible en todas las rutas
- **Viaje a casa** (`toHome`) - Solo rutas regulares (`workshop: false`)
- **Taller** (`workshop`) - Solo rutas de taller (`workshop: true`)

---

## 7. Viaje con un Amigo

### Descripcion

Permite que un estudiante solicite viajar temporalmente en la ruta de otro estudiante (amigo) para un dia especifico.

### Flujo Completo

#### Paso 1: Solicitud (App de Padres)

**`POST /api/travel-with-friend`**

```json
{
  "student": "idDelAmigo", // Estudiante que ya tiene la ruta
  "studentRequest": "idDelSolicitante", // Estudiante que quiere viajar
  "day": "monday", // Dia de la semana
  "date": "2025-03-15" // Fecha de la solicitud
}
```

**Proceso interno:**

1. Busca la ruta del amigo consultando `stops` por `student` + `day`
   - Prioriza rutas tipo `workshop`, luego `toHome`
   - Ignora `toSchool`
2. Obtiene datos de la ruta y unidad
3. Valida capacidad disponible (`students.length < unit.passengers`)
4. Crea documento en `travelsWithFriend/{studentRequest}` con `status: "pending"` y `type`
5. Envia notificacion push al admin escolar

**Respuestas:**

- `200`: Solicitud creada
- `400`: No hay espacio en la unidad
- `404`: No hay ruta asignada para el amigo en ese dia

#### Paso 2: Aprobacion/Rechazo (Dashboard Admin)

**`PATCH /api/travel-with-friend`**

```json
{
  "id": "idDelSolicitante",
  "day": "monday",
  "status": "accepted", // o "rejected"
  "route": "routeId",
  "studentRequest": "idDelSolicitante",
  "student": "idDelAmigo",
  "fullName": "Nombre del solicitante",
  "schoolId": "schoolId"
}
```

**Al aceptar (`accepted`):**

1. Agrega al solicitante en `travels/{routeId}/{day}/{type}.travelWithFriend`
2. Actualiza `statusTravel` del solicitante a `"travelWithFriend"`
3. Crea parada temporal en `stops` con ID `{studentRequest}_{routeId}_{day}_friend`
   - Usa coordenadas de `address.coords` del solicitante
   - Incluye `isTravelWithFriend: true`
4. Notifica a padres/tutores del solicitante

**Al rechazar (`rejected`):**

1. Remueve al solicitante del array `travelWithFriend` en travels
2. Resetea `statusTravel` a `""` (solo si actualmente es `"travelWithFriend"`)
3. Elimina la parada temporal de `stops`
4. Notifica a padres/tutores

#### Paso 3: Consulta de Solicitudes

**`GET /api/travel-with-friend/{studentId}`**

Retorna todas las solicitudes del estudiante con datos enriquecidos:

```json
[
  {
    "route": "routeId",
    "day": "monday",
    "status": "pending",
    "student": "idDelAmigo",
    "date": "2025-03-15",
    "type": "toHome",
    "studentFriend": {
      "name": "Carlos",
      "lastName": "Garcia"
    },
    "studentRequest": {
      "id": "requestStudentId",
      "name": "Maria",
      "lastName": "Lopez"
    },
    "routeData": {
      "name": "Ruta Norte"
    }
  }
]
```

### Modelo de Datos

```javascript
travelsWithFriend/{studentRequestId} = {
  monday: {
    route: string,           // ID de la ruta del amigo
    day: string,             // "monday"
    status: string,          // "pending" | "accepted" | "rejected"
    student: string,         // ID del amigo
    date: string,            // Fecha de la solicitud
    type: string,            // "toHome" | "workshop"
    updatedAt: Timestamp
  },
  tuesday: null,             // null si no hay solicitud
  ...
}
```

### Estados de Solicitud

| Estado    | Valor      | Descripcion                             |
| --------- | ---------- | --------------------------------------- |
| Pendiente | `pending`  | Esperando aprobacion del admin          |
| Aceptado  | `accepted` | Estudiante agregado a la ruta del amigo |
| Rechazado | `rejected` | Solicitud denegada                      |

### Implementacion en App de Padres

```javascript
// Crear solicitud
const response = await fetch(`${API_URL}/api/travel-with-friend`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    student: friendStudentId,
    studentRequest: myStudentId,
    day: "monday",
    date: new Date().toISOString(),
  }),
});

// Consultar solicitudes
const requests = await fetch(
  `${API_URL}/api/travel-with-friend/${myStudentId}`,
).then((r) => r.json());
```

### Visualizacion en App del Auxiliar

Cuando el auxiliar consulta la lista de viaje:

- Los estudiantes invitados aparecen **despues de su amigo** en la lista
- Tienen `studentFriend` con el ID del amigo
- Tienen `coords` con su punto de recogida
- La app debe mostrarlos diferenciados (etiqueta "Invitado" o similar)

---

## 8. Notificaciones Push (FCM)

### Categorias de Notificacion

| Categoria          | Uso                            | Destinatario    |
| ------------------ | ------------------------------ | --------------- |
| `travel`           | Actualizaciones de viaje       | Padres/Auxiliar |
| `travelWithFriend` | Solicitudes de viaje con amigo | Admin/Padres    |
| `parents`          | Comunicados a padres           | Padres          |
| `status`           | Cambios de estado              | Padres          |
| `emergency`        | Emergencias                    | Todos           |
| `general`          | Comunicados generales          | Todos           |

### Registro de Token FCM

Al hacer login, la app debe registrar su token FCM:

```javascript
import messaging from "@react-native-firebase/messaging";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const fcmToken = await messaging().getToken();
await updateDoc(doc(db, "profile", userId), {
  tokens: arrayUnion(fcmToken),
});
```

### Recepcion y Navegacion

```javascript
// Foreground
messaging().onMessage(async (remoteMessage) => {
  // Mostrar notificacion local
});

// Background tap
messaging().onNotificationOpenedApp((remoteMessage) => {
  const { category } = remoteMessage.data;

  switch (category) {
    case "travelWithFriend":
      // Navegar a pantalla de solicitudes de viaje con amigo
      break;
    case "emergency":
      // Navegar a pantalla de emergencia
      break;
    case "travel":
      // Navegar a pantalla de seguimiento
      break;
    default:
    // Navegar a notificaciones generales
  }
});
```

### Almacenamiento de Notificaciones

```javascript
notificationsSchool/{schoolId}/notifications/{notificationId} = {
  notification: { title, body },
  data: {
    routeId: string,
    schoolId: string,
    studentRequest: string,
    student: string
  },
  category: string,
  readByUser: boolean,
  readByAux: boolean,
  readByTutor: boolean,
  readBySchool: boolean,
  createdAt: Timestamp
}
```

La app puede leer notificaciones con un listener en tiempo real y marcar como leidas actualizando el campo correspondiente al rol (`readByUser`, `readByTutor`, `readByAux`).

---

## 9. Estructura de Datos del Estudiante

```javascript
students/{studentId} = {
  name: string,
  lastName: string,
  secondLastName: string,
  grade: string,                    // "1", "2", ..., "6"
  group: string,                    // "A", "B", "C"
  enrollment: string,               // Matricula
  birthDate: Timestamp,
  bloodType: string,                // "O+", "A-", etc.
  allergies: string,
  serviceType: string,              // "complete"

  address: {
    street: string,
    neighborhood: string,
    city: string,
    state: string,
    zipCode: string,
    reference: string,
    coords: { lat: number, lng: number }
  },

  schoolId: string,
  parents: DocumentReference[],     // Refs a profile/
  tutors: DocumentReference[],      // Refs a profile/
  statusTravel: string,             // Estado actual del viaje
  fullName: string[],               // Array para busqueda

  status: string,                   // "active" | "inactive"
  isDeleted: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 10. Resumen de Endpoints

| Metodo | Endpoint                              | Descripcion                        | Usado por       |
| ------ | ------------------------------------- | ---------------------------------- | --------------- |
| GET    | `/api/travel/{auxiliarId}?day&type`   | Lista de estudiantes del viaje     | App Auxiliar    |
| POST   | `/api/travel-with-friend`             | Crear solicitud de viaje con amigo | App Padres      |
| GET    | `/api/travel-with-friend/{studentId}` | Consultar solicitudes              | App Padres      |
| PATCH  | `/api/travel-with-friend`             | Aprobar/rechazar solicitud         | Dashboard Admin |
| GET    | `/api/routes/{routeId}`               | Detalle de ruta con estudiantes    | Dashboard/Apps  |
| POST   | `/api/notifications`                  | Enviar notificacion                | Dashboard       |
| GET    | `/api/notifications?schoolId`         | Listar notificaciones              | Apps            |

### Respuestas de Error Comunes

| Código  | Significado                         | Ejemplo de Respuesta                         |
| ------- | ----------------------------------- | -------------------------------------------- |
| 400     | Solicitud inválida                  | `{ "error": "No hay espacio en la unidad" }` |
| 401/403 | Error de autenticación/autorización | `{ "error": "No autorizado" }`               |
| 404     | Recurso no encontrado               | `{ "error": "No hay ruta asignada..." }`     |
| 500     | Error del servidor                  | `{ "error": "Error interno del servidor" }`  |

**Nota sobre errores por endpoint:**

- **Validación (400):** Comunes en `POST /api/travel-with-friend`, `PATCH /api/travel-with-friend`, `POST /api/notifications`.
- **Autenticación (401/403):** Esperados en rutas protegidas.
- **No encontrado (404):** Comunes en `GET /api/travel/{auxiliarId}`, `GET /api/routes/{routeId}` si el recurso no existe.
- **Servidor (500):** Posibles en cualquier endpoint por fallos internos.

---

## 11. Listeners en Tiempo Real (Firestore)

### Para la App de Padres

| Coleccion                                      | Documento                       | Proposito                     |
| ---------------------------------------------- | ------------------------------- | ----------------------------- |
| `students`                                     | `students/{studentId}`          | Seguimiento de `statusTravel` |
| `tracking`                                     | `tracking/{routeId}`            | Posicion del autobus          |
| `notificationsSchool/{schoolId}/notifications` | Query                           | Notificaciones nuevas         |
| `travelsWithFriend`                            | `travelsWithFriend/{studentId}` | Estado de solicitudes         |

### Para la App del Auxiliar

| Coleccion  | Documento                  | Proposito                       |
| ---------- | -------------------------- | ------------------------------- |
| `travels`  | `travels/{routeId}`        | Cambios en lista de estudiantes |
| `students` | Cada estudiante de la ruta | Cambios de statusTravel         |

---

## 12. Consideraciones Importantes

1. **Workshop cross-impact**: Un estudiante inscrito en ruta de taller afecta su `statusTravel` en rutas regulares. La app no debe intentar sobreescribir `"workshop"` en esos casos.

2. **Paradas temporales**: Las paradas de viaje con amigo tienen un ID predecible (`{student}_{route}_{day}_friend`). Usarlas para mostrar el punto de recogida del invitado en el mapa.

3. **Tipo de viaje guardado**: Las solicitudes de viaje con amigo ahora guardan el `type` (`toHome`/`workshop`) en el documento. Esto previene inconsistencias si la ruta cambia entre la solicitud y la aprobacion.

4. **Capacidad de la unidad**: La validacion de capacidad verifica contra el tipo correcto de viaje. Si la ruta es de taller, se valida contra `workshop.students`, no contra `toHome.students`.

5. **Orden de la lista**: Los estudiantes invitados siempre aparecen inmediatamente despues de su amigo en la lista del auxiliar. La app debe respetar este orden.

6. **Coordenadas del invitado**: Las coordenadas de recogida del invitado vienen en el campo `coords` dentro del objeto del estudiante invitado en la respuesta del endpoint de viaje. Son las coordenadas de `address.coords` del estudiante solicitante.

7. **Limpieza automatica**: Cuando una ruta se elimina desde el dashboard, se limpian automaticamente los registros de `travelsWithFriend` asociados y se resetean los `statusTravel` de los estudiantes afectados.

8. **Offline support**: Habilitar persistencia offline de Firestore para que la app funcione sin conexion y sincronice al reconectarse.

---

**Documento de Especificacion para App Movil**
Version: 2.0
Ultima actualizacion: Marzo 2026
Sistema: RutEs Ecosystem
