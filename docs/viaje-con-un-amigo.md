# Viaje con un Amigo

## Descripcion General

El feature "Viaje con un Amigo" permite que un estudiante solicite viajar en la ruta de otro estudiante (su amigo) para un dia especifico. El flujo involucra una solicitud desde la app movil, una aprobacion/rechazo por parte del administrador escolar en el dashboard, y la integracion del estudiante invitado en la lista de viaje del conductor/auxiliar.

---

## Actores

| Actor                  | Rol                                               |
| ---------------------- | ------------------------------------------------- |
| **Padre/Tutor**        | Solicita el viaje con amigo desde la app movil    |
| **Admin Escolar**      | Aprueba o rechaza la solicitud desde el dashboard |
| **Conductor/Auxiliar** | Ve al estudiante invitado en su lista de viaje    |

---

## Flujo Completo

### 1. Solicitud (POST)

El padre/tutor envia una solicitud desde la app movil.

**Endpoint:** `POST /api/travel-with-friend`

**Parametros:**
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `student` | string | ID del estudiante amigo (el que ya tiene la ruta) |
| `studentRequest` | string | ID del estudiante solicitante (el que quiere viajar con el amigo) |
| `day` | string | Dia de la semana (`monday`, `tuesday`, etc.) |
| `date` | string | Fecha de la solicitud |

**Proceso interno:**

1. Busca la ruta del amigo consultando la coleccion `stops` por `student` + `day`
   - Prioriza rutas tipo `workshop`, luego `toHome`
2. Obtiene los datos de la ruta y la unidad
3. Valida que haya espacio disponible en la unidad (capacidad vs estudiantes actuales)
4. Crea un documento en la coleccion `travelsWithFriend` con status `"pending"`
5. Envia una notificacion push al admin escolar con categoria `travelWithFriend`

**Respuestas:**

- `200`: Solicitud creada exitosamente
- `400`: No hay espacio en la unidad
- `404`: No hay ruta asignada para el amigo en ese dia

### 2. Aprobacion/Rechazo (PATCH)

El admin escolar revisa la solicitud en el dashboard y actualiza el estado.

**Endpoint:** `PATCH /api/travel-with-friend`

**Parametros:**
| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `id` | string | ID del documento travelsWithFriend (ID del estudiante amigo) |
| `day` | string | Dia de la semana |
| `status` | string | Nuevo estado: `"accepted"` o `"rejected"` |
| `route` | string | ID de la ruta |
| `studentRequest` | string | ID del estudiante solicitante |
| `student` | string | ID del estudiante amigo |
| `fullName` | string | Nombre completo del solicitante |
| `schoolId` | string | ID de la escuela |

**Al aceptar (`status: "accepted"`):**

1. Agrega el `studentRequest` al array `travelWithFriend` en `travels/{routeId}/{day}/{type}`
2. Actualiza `statusTravel` del estudiante solicitante a `"travelWithFriend"`
3. Crea un documento temporal en `stops` con las coordenadas de la direccion del solicitante
   - ID deterministico: `{studentRequest}_{route}_{day}_friend`
   - Incluye flag `isTravelWithFriend: true`
4. Envia notificacion push a los padres/tutores del estudiante

**Al rechazar (`status: "rejected"`):**

1. Remueve el `studentRequest` del array `travelWithFriend` en travels
2. Resetea `statusTravel` a `""` (solo si actualmente es `"travelWithFriend"`)
3. Elimina el documento temporal de `stops` si existia
4. Envia notificacion push a los padres/tutores

### 3. Consulta de Solicitudes (GET)

**Endpoint:** `GET /api/travel-with-friend/{id}`

Retorna todas las solicitudes de viaje con amigo para un estudiante. Cada solicitud incluye:

- Datos del estudiante amigo (`studentFriend`)
- Datos del estudiante solicitante (`studentRequest`)
- Datos de la ruta (`routeData`)
- Estado, fecha y dia de la solicitud

### 4. Visualizacion en el Viaje (GET Travel)

**Endpoint:** `GET /api/travel/{id}?day={day}&type={type}`

Cuando el conductor/auxiliar consulta los detalles del viaje:

1. Se obtiene la lista regular de estudiantes
2. Se consulta el array `travelWithFriend` del viaje
3. Para cada estudiante en ese array con status `"accepted"`, se buscan sus coordenadas en el stop temporal
4. El estudiante invitado se inserta en la lista inmediatamente despues de su amigo, con:
   - `statusTravel: "accepted"`
   - `studentFriend: {idDelAmigo}`
   - `coords: {coordenadasDelStop}`

---

## Modelo de Datos

### Coleccion: `travelsWithFriend`

Documento ID: ID del estudiante solicitante

```
travelsWithFriend/{studentRequestId} = {
  [day]: {
    route: string,        // ID de la ruta del amigo
    day: string,          // "monday", "tuesday", etc.
    status: string,       // "pending" | "accepted" | "rejected"
    student: string,      // ID del estudiante amigo
    date: string,         // Fecha de la solicitud
    type: string,         // "toHome" | "workshop"
    updatedAt: Timestamp  // Ultima actualizacion
  }
}
```

### Coleccion: `travels` (campo travelWithFriend)

```
travels/{routeId} = {
  [day]: {
    toHome: {
      students: [DocumentReference],
      travelWithFriend: [string]      // Array de IDs de estudiantes solicitantes
    },
    workshop: {
      students: [DocumentReference],
      travelWithFriend: [string]
    }
  }
}
```

### Coleccion: `stops` (parada temporal del amigo)

```
stops/{studentRequest}_{route}_{day}_friend = {
  student: string,             // ID del estudiante solicitante
  route: string,               // ID de la ruta
  day: string,                 // Dia de la semana
  type: string,                // "toHome" | "workshop"
  coords: { lat, lng, ... },  // Coordenadas de la direccion del solicitante
  isTravelWithFriend: true     // Flag para identificar paradas temporales
}
```

### Coleccion: `students` (campo afectado)

```
students/{id} = {
  ...
  statusTravel: "travelWithFriend"  // Se actualiza al aceptar, se limpia al rechazar
}
```

---

## Estados de la Solicitud

| Estado    | Valor      | Descripcion                                  |
| --------- | ---------- | -------------------------------------------- |
| Pendiente | `pending`  | Solicitud enviada, esperando aprobacion      |
| Aceptado  | `accepted` | Admin aprobo, estudiante agregado al viaje   |
| Rechazado | `rejected` | Admin rechazo, estudiante removido del viaje |

---

## Notificaciones

| Evento           | Destinatario   | Titulo                                   |
| ---------------- | -------------- | ---------------------------------------- |
| Nueva solicitud  | Admin escolar  | "Solicitud de viaje con un amigo"        |
| Cambio de estado | Padres/Tutores | "El viaje con amigo ha sido actualizado" |

Categoria de notificacion: `travelWithFriend`

Las notificaciones aparecen en el dashboard en la seccion de "Permisos y Alertas" con un badge rojo indicando la cantidad de solicitudes sin leer.

---

## Interfaz de Administracion

**Ruta:** `/dashboard/travel/{studentId}`

La pagina muestra tarjetas con todas las solicitudes de viaje con amigo para un estudiante. Cada tarjeta muestra:

- Fecha de la solicitud
- Nombre del solicitante
- Nombre del acompanante (amigo)
- Ruta por asignar
- Estado actual

Al hacer click en una tarjeta se abre un dialogo para cambiar el estado (Pendiente / Aceptado / Rechazado).

---

## Archivos del Feature

| Archivo                                                 | Proposito                                                         |
| ------------------------------------------------------- | ----------------------------------------------------------------- |
| `src/app/api/travel-with-friend/route.js`               | Endpoints POST (crear solicitud) y PATCH (aprobar/rechazar)       |
| `src/app/api/travel-with-friend/[id]/route.js`          | Endpoint GET (consultar solicitudes de un estudiante)             |
| `src/app/api/travel/[id]/route.js`                      | Endpoint GET (detalles del viaje con info del amigo)              |
| `src/app/dashboard/travel/[id]/page.jsx`                | Pagina de administracion de solicitudes                           |
| `src/services/TravelWithFriendServices.js`              | Cliente API (getTravelWithFriend, confirmTravelWithFriend)        |
| `src/components/NotificationItem.jsx`                   | Componente de notificacion con routing a la pagina de viaje       |
| `src/app/dashboard/routes/components/Notifications.jsx` | Badge de notificaciones pendientes                                |
| `src/utils/options.js`                                  | Constantes: TRAVEL_WITH_FRIEND_OPTIONS, TRAVEL_WITH_FRIEND_STATUS |
| `src/services/RoutesServices.js`                        | Limpieza de travelsWithFriend al eliminar rutas                   |

---

## Limpieza de Datos

Cuando se elimina una ruta (`removeRoutes` en `RoutesServices.js`):

1. Se lee el documento `travels` de la ruta
2. Para cada dia y tipo, se buscan estudiantes en el array `travelWithFriend`
3. Se elimina la entrada del dia correspondiente en su documento `travelsWithFriend`
4. Se resetea `statusTravel` del estudiante si aplica
5. Los stops temporales (`isTravelWithFriend: true`) se eliminan junto con los demas stops de la ruta

---

## Consideraciones

- La validacion de capacidad se realiza contra el tipo correcto de viaje (`toHome` o `workshop`)
- El tipo de viaje (`type`) se guarda en el documento `travelsWithFriend` para evitar inconsistencias si la ruta cambia entre la solicitud y la aprobacion/rechazo
- Las coordenadas del stop temporal se toman de `address.coords` del estudiante solicitante
- Si el estudiante solicitante no tiene coordenadas en su direccion, no se crea stop temporal
- La determinacion del tipo usa como primera opcion el `type` guardado en `travelsWithFriend` y como fallback el campo `workshop` de la ruta
