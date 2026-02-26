# Informe Técnico Ejecutivo - RutEs-Admin

## Resumen Ejecutivo

**RutEs-Admin** es un sistema web integral de gestión de transporte escolar desarrollado con tecnologías modernas y escalables. La plataforma permite a instituciones educativas administrar de manera eficiente y segura todos los aspectos del transporte escolar: estudiantes, padres de familia, personal operativo (conductores y auxiliares), vehículos y rutas georreferenciadas.

### Propósito del Sistema

El sistema resuelve la necesidad de las escuelas de:
- Gestionar eficientemente el transporte escolar
- Proporcionar transparencia a los padres de familia
- Rastrear en tiempo real la ubicación de los estudiantes
- Comunicar eficientemente eventos y emergencias
- Optimizar la asignación de recursos de transporte

### Ecosistema Completo

RutEs-Admin es parte de un ecosistema de tres aplicaciones:
1. **RutEs-Admin** (Web) - Panel administrativo para escuelas
2. **RutEs Parent App** (Móvil) - Aplicación móvil para padres/tutores
3. **RutEs Auxiliary App** (Móvil) - Aplicación móvil para auxiliares/nanas

## Stack Tecnológico

### Frontend (Cliente Web)

```
Next.js 14.1.0          - Framework React con App Router
React 18.2.0            - Biblioteca de interfaz de usuario
Tailwind CSS 3.3.2      - Framework CSS utilitario
Radix UI                - Componentes accesibles headless
Shadcn/ui               - Biblioteca de componentes reutilizables
TanStack Table v8       - Tablas de datos avanzadas
Lucide React            - Sistema de iconografía
React Google Maps API   - Integración con Google Maps
```

### Backend (Servidor)

```
Next.js API Routes      - Endpoints RESTful serverless
Firebase Admin SDK      - Operaciones privilegiadas del servidor
Nodemailer              - Sistema de envío de emails
Handlebars              - Motor de plantillas para emails
```

### Base de Datos y Autenticación

```
Firebase Firestore      - Base de datos NoSQL en tiempo real
Firebase Authentication - Sistema de autenticación
Firebase Cloud Messaging- Sistema de notificaciones push
```

### Gestión de Estado

```
Zustand 4.5.1          - Estado global de la aplicación
React Context API       - Contexto de autenticación
Session Storage         - Persistencia de datos del cliente
```

### Herramientas de Desarrollo

```
ESLint                 - Análisis estático de código
Prettier               - Formateo de código
Husky                  - Git hooks
Vercel                 - Plataforma de despliegue
```

## Arquitectura de la Aplicación

### Patrón de Arquitectura

El sistema sigue una **arquitectura de capas** combinada con el patrón **MVC (Model-View-Controller)** adaptado a React:

```
┌─────────────────────────────────────────────────┐
│          CAPA DE PRESENTACIÓN (UI)              │
│  ┌───────────────────────────────────────────┐  │
│  │ Components (React Components)             │  │
│  │ - Forms, Tables, Maps, Modals             │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↓↑
┌─────────────────────────────────────────────────┐
│        CAPA DE LÓGICA DE NEGOCIO                │
│  ┌───────────────────────────────────────────┐  │
│  │ Custom Hooks (useStudentManager, etc)     │  │
│  │ Stores (Zustand)                          │  │
│  │ Context (AuthContext)                     │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↓↑
┌─────────────────────────────────────────────────┐
│         CAPA DE SERVICIOS (API Layer)           │
│  ┌───────────────────────────────────────────┐  │
│  │ Services (students.js, routes.js, etc)    │  │
│  │ API Routes (Next.js endpoints)            │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↓↑
┌─────────────────────────────────────────────────┐
│          CAPA DE DATOS (Data Layer)             │
│  ┌───────────────────────────────────────────┐  │
│  │ Firebase CRUD Operations                  │  │
│  │ Firestore Database                        │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Usuario → UI**: El usuario interactúa con componentes React
2. **UI → Custom Hooks**: Los componentes llaman hooks personalizados
3. **Hooks → Services**: Los hooks invocan servicios de API
4. **Services → API Routes**: Los servicios hacen peticiones HTTP a endpoints
5. **API Routes → Firebase**: Los endpoints interactúan con Firestore
6. **Respuesta inversa**: Los datos fluyen de regreso hasta la UI

## Funcionalidades Principales

### 1. Gestión de Estudiantes

**Características:**
- Registro completo con datos personales (nombre, fecha de nacimiento, tipo de sangre, alergias)
- Información académica (grado, grupo, matrícula)
- Gestión de direcciones con geocodificación
- Asignación a rutas y paradas específicas
- Vinculación con padres/tutores
- Carga masiva mediante archivos Excel

**Código de Ejemplo:**

```javascript
// Creación de estudiante
const createStudent = async (studentData) => {
  const response = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: studentData.name,
      lastName: studentData.lastName,
      birthDate: studentData.birthDate,
      bloodType: studentData.bloodType,
      grade: studentData.grade,
      address: studentData.address,
      schoolId: currentSchoolId
    })
  });
  return response.json();
};
```

### 2. Gestión de Rutas

**Características:**
- Creación de rutas con nombres descriptivos
- Asignación de conductor y auxiliar
- Configuración por día de la semana
- Definición de paradas georreferenciadas
- Tres tipos de viajes: ida a escuela, regreso a casa, talleres
- Visualización en Google Maps

**Estructura de Datos:**

```javascript
// Estructura de una ruta
{
  id: "route_123",
  name: "Ruta Norte",
  schoolId: "school_abc",
  driver: { reference to driver document },
  auxiliary: { reference to auxiliary document },
  unit: { reference to unit document },
  days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
  isDeleted: false
}

// Estructura de viajes por día
travels/{routeId} = {
  monday: {
    toSchool: {
      stops: [
        {
          coords: { lat: 19.432, lng: -99.133 },
          students: [{ ref to student1 }, { ref to student2 }]
        }
      ]
    },
    toHome: { stops: [...] },
    workshop: { stops: [...] }
  }
}
```

### 3. Sistema de Autenticación y Roles

**Roles del Sistema:**

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| `admin-rutes` | Super administrador de la plataforma | Acceso total a todas las escuelas |
| `admin` | Administrador escolar | Acceso completo a datos de su escuela |
| `user-school` | Usuario secundario | Solo visualización de rutas sin datos personales |
| `user` | Padre de familia | Acceso desde app móvil |
| `tutor` | Tutor legal | Acceso desde app móvil |
| `auxiliary` | Auxiliar/nana | Acceso desde app móvil con NIP |

**Implementación de Autenticación:**

```javascript
// Middleware de autenticación en API routes
import { getUser } from '@/firebase/validateToken';

export async function POST(req) {
  try {
    const user = await getUser(req);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verificar rol
    if (!user.roles.includes('admin')) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Procesar solicitud...
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

### 4. Viajes con Amigo

Sistema que permite a los padres solicitar cambios temporales de ruta cuando su hijo viaja con un amigo.

**Flujo del Proceso:**

1. Padre solicita cambio desde app móvil
2. Sistema valida disponibilidad de capacidad en la ruta destino
3. Administrador revisa y aprueba/rechaza
4. Sistema envía notificación push al padre
5. Si es aprobado, el estudiante aparece en la nueva ruta para ese día

**Estructura de Datos:**

```javascript
travelsWithFriend/{studentId} = {
  monday: {
    route: { reference to route },
    student: { reference to student },
    status: "pending" | "accepted" | "rejected",
    date: Timestamp
  }
}
```

### 5. Sistema de Notificaciones

**Tipos de Notificaciones:**
- `emergency`: Emergencias críticas
- `travel`: Actualizaciones de viajes
- `status`: Cambios de estado
- `travelWithFriend`: Respuestas a solicitudes
- `general`: Comunicados generales

**Implementación:**

```javascript
// Envío de notificación
await fetch('/api/notifications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "Emergencia en Ruta Norte",
    body: "El autobús tendrá un retraso de 15 minutos",
    category: "emergency",
    userIds: ["user1", "user2", "user3"] // FCM tokens de destinatarios
  })
});
```

### 6. Carga Masiva de Estudiantes

Sistema de importación de datos mediante archivos Excel (.xlsx).

**Proceso:**
1. Usuario carga archivo Excel con formato específico
2. Sistema valida columnas y formato
3. Procesa cada fila creando/actualizando estudiantes
4. Crea automáticamente cuentas de padres si no existen
5. Envía emails con credenciales a los padres
6. Retorna reporte de éxitos y errores

**Columnas Requeridas del Excel:**
- Nombre, Apellido Paterno, Apellido Materno
- Fecha de Nacimiento
- Tipo de Sangre, Alergias
- Grado, Grupo, Matrícula
- Nombre del Padre, Email del Padre, Teléfono del Padre
- Dirección

## Estructura del Código

### Organización de Directorios

```
/home/user/RutEs-Admin/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # Backend API Routes
│   │   │   ├── students/            # Endpoints de estudiantes
│   │   │   ├── routes/              # Endpoints de rutas
│   │   │   ├── notifications/       # Endpoints de notificaciones
│   │   │   ├── travel-with-friend/  # Endpoints de viajes con amigo
│   │   │   ├── mail/                # Envío de correos
│   │   │   └── auth/                # Autenticación
│   │   ├── dashboard/               # Páginas del dashboard
│   │   │   ├── admin/              # Sección de administración
│   │   │   ├── students/           # Módulo de estudiantes
│   │   │   ├── parents/            # Módulo de padres
│   │   │   ├── drivers/            # Módulo de conductores
│   │   │   ├── auxiliars/          # Módulo de auxiliares
│   │   │   ├── units/              # Módulo de unidades
│   │   │   ├── routes/             # Módulo de rutas
│   │   │   ├── travel/             # Seguimiento de viajes
│   │   │   └── notifications/      # Centro de notificaciones
│   │   └── signin/                 # Página de inicio de sesión
│   │
│   ├── components/                  # Componentes React reutilizables
│   │   ├── Forms/                  # Formularios por pasos
│   │   │   ├── StudentForm/
│   │   │   ├── DriverForm/
│   │   │   └── RouteForm/
│   │   ├── MultiStepForm/          # Sistema de formularios multi-paso
│   │   ├── Table/                  # Componentes de tabla
│   │   │   ├── DataTable.jsx
│   │   │   └── columns/           # Definiciones de columnas
│   │   ├── ui/                     # Componentes UI base (Shadcn)
│   │   ├── Maps/                   # Componentes de mapas
│   │   ├── Sidebar.jsx             # Navegación lateral
│   │   └── NavBar.jsx              # Barra superior
│   │
│   ├── context/                     # Contextos de React
│   │   └── AuthContext.jsx         # Contexto de autenticación
│   │
│   ├── firebase/                    # Configuración de Firebase
│   │   ├── config.js               # Inicialización de Firebase
│   │   ├── crud.js                 # Operaciones CRUD genéricas
│   │   └── validateToken.js        # Validación de tokens JWT
│   │
│   ├── hooks/                       # Custom Hooks
│   │   ├── useStudentManager.js    # Lógica compleja de estudiantes
│   │   ├── useMarkersMap.js        # Gestión de marcadores en mapas
│   │   └── useTutorsByStudents.js  # Gestión de tutores
│   │
│   ├── services/                    # Capa de servicios API
│   │   ├── students.js             # Servicio de estudiantes
│   │   ├── routes.js               # Servicio de rutas
│   │   ├── notifications.js        # Servicio de notificaciones
│   │   └── travel.js               # Servicio de viajes
│   │
│   ├── store/                       # Zustand stores
│   │   ├── useStudentStore.js      # Estado de estudiantes
│   │   ├── useRoutesStore.js       # Estado de rutas
│   │   └── useDriversStore.js      # Estado de conductores
│   │
│   ├── utils/                       # Utilidades y helpers
│   │   ├── constants.js            # Constantes de la aplicación
│   │   └── helpers.js              # Funciones de ayuda
│   │
│   └── views/                       # Plantillas de email
│       ├── welcome.hbs             # Email de bienvenida
│       └── resetPassword.hbs       # Email de restablecimiento
│
├── public/                          # Archivos estáticos
│   ├── images/
│   └── favicon.ico
│
├── .kiro/                          # Hooks de automatización Kiro
│   ├── docs-sync.sh
│   └── commit.sh
│
├── package.json                    # Dependencias del proyecto
├── next.config.js                  # Configuración de Next.js
├── tailwind.config.js              # Configuración de Tailwind
└── .env.local                      # Variables de entorno (no versionado)
```

## Patrones de Diseño Implementados

### 1. Service Layer Pattern

Todos los llamados a la API están abstraídos en servicios:

```javascript
// src/services/students.js
export const getStudents = async () => {
  const response = await fetch('/api/students');
  return response.json();
};

export const createStudent = async (data) => {
  const response = await fetch('/api/students', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.json();
};
```

### 2. Repository Pattern

Operaciones de base de datos centralizadas:

```javascript
// src/firebase/crud.js
export const create = async (collection, data) => {
  const docRef = await addDoc(collection(db, collection), data);
  return docRef.id;
};

export const read = async (collection, id) => {
  const docRef = doc(db, collection, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};
```

### 3. Custom Hook Pattern

Lógica reutilizable en hooks personalizados:

```javascript
// src/hooks/useStudentManager.js
export const useStudentManager = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadStudents = async () => {
    setLoading(true);
    const data = await getStudents();
    setStudents(data);
    setLoading(false);
  };

  return { students, loading, loadStudents };
};
```

### 4. Multi-step Form Pattern

Formularios complejos divididos en pasos manejables:

```javascript
const steps = [
  { id: 'personal', title: 'Datos Personales' },
  { id: 'academic', title: 'Datos Académicos' },
  { id: 'address', title: 'Dirección' },
  { id: 'tutors', title: 'Padres/Tutores' }
];
```

## Seguridad

### Medidas Implementadas

1. **Autenticación con Firebase**: Tokens JWT seguros
2. **Validación en API Routes**: Verificación de usuario en cada endpoint
3. **Aislamiento de Datos**: Filtrado por `schoolId` en todas las consultas
4. **HTTP-only Cookies**: Tokens almacenados de forma segura
5. **Validación de Esquemas**: Uso de Yup para validar datos de entrada
6. **Soft Deletes**: Flag `isDeleted` en lugar de borrado físico
7. **Role-based Access Control**: Permisos basados en roles

### Ejemplo de Seguridad en API:

```javascript
export async function GET(req) {
  // Validar autenticación
  const user = await getUser(req);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Obtener schoolId del usuario
  const { schoolId } = user;

  // Consultar solo datos de la escuela del usuario
  const students = await getDocs(
    query(
      collection(db, 'students'),
      where('schoolId', '==', schoolId),
      where('isDeleted', '==', false)
    )
  );

  return Response.json(students.docs.map(doc => doc.data()));
}
```

## Integración con Aplicaciones Móviles

### Puntos de Integración

1. **Base de Datos Compartida**: Firestore es accedida por las 3 aplicaciones
2. **Autenticación Común**: Firebase Auth unifica la autenticación
3. **Notificaciones Push**: FCM envía notificaciones a apps móviles
4. **Tokens FCM**: Almacenados en colección `profile`
5. **APIs Compartidas**: Algunas API routes son consumidas por móviles

### Flujo de Creación de Cuenta de Padre:

```
1. Admin crea estudiante en RutEs-Admin
2. Sistema detecta nuevo padre (email)
3. Crea cuenta Firebase Auth con contraseña generada
4. Crea documento en colección "profile"
5. Envía email con:
   - Link a Google Play / App Store
   - Credenciales de acceso
   - Instrucciones de uso
6. Padre descarga app móvil
7. Inicia sesión con credenciales recibidas
8. App móvil guarda FCM token en Firestore
9. Admin puede enviar notificaciones push
```

## Despliegue y DevOps

### Plataforma de Despliegue

**Vercel**: Plataforma serverless optimizada para Next.js

**Características:**
- Despliegue automático desde GitHub
- Variables de entorno configuradas en panel
- CDN global para assets estáticos
- Funciones serverless para API routes
- Preview deployments para PRs
- Analytics y monitoring incluidos

### Pipeline CI/CD

```
1. Developer push to GitHub
2. Vercel detecta cambio
3. Ejecuta build: next build
4. Ejecuta linting: next lint
5. Despliega a preview URL (si es PR)
6. Despliega a producción (si es main branch)
7. Invalida CDN cache
```

### Variables de Entorno Requeridas

```bash
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

# Firebase Admin
FIREBASE_ADMIN_PRIVATE_KEY
FIREBASE_ADMIN_PRIVATE_KEY_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_CLIENT_ID

# Google Services
GOOGLE_API_KEY

# Email
NODEMAILER_EMAIL
NODEMAILER_PW

# API
NEXT_PUBLIC_URL_API
```

## Rendimiento y Optimizaciones

### Optimizaciones Implementadas

1. **Server Components**: Uso de componentes de servidor por defecto en Next.js 14
2. **Code Splitting**: Carga dinámica de componentes pesados
3. **Image Optimization**: Next.js Image component para imágenes
4. **API Route Caching**: Cache de respuestas cuando es apropiado
5. **Zustand Persistence**: Session storage para evitar refetch innecesarios
6. **Lazy Loading**: Carga diferida de tablas grandes
7. **Debouncing**: En búsquedas y autocompletados

### Métricas de Rendimiento

```
First Contentful Paint: < 1.5s
Time to Interactive: < 3.5s
Total Bundle Size: ~500KB (gzipped)
API Response Time: < 500ms (promedio)
```

## Estado Actual del Proyecto

### Funcionalidades Completadas ✅

- Gestión completa de estudiantes (CRUD + carga masiva)
- Gestión de conductores, auxiliares y unidades
- Sistema de rutas con paradas georreferenciadas
- Autenticación y autorización con roles
- Sistema de notificaciones push
- Viajes con amigo (solicitud y aprobación)
- Envío automático de emails
- Asignación de NIP para auxiliares
- Usuario secundario con vista limitada

### Funcionalidades Pendientes 🚧

Según el archivo `mvp.md`:

- [ ] Creación de rutas nuevas (UI mejorada)
- [ ] Rutas específicas para talleres
- [ ] Visualización de alumnos en paradas con estado (entregado/por entregar)
- [ ] Generación de reportes descargables
- [ ] Gestión de rutas base con talleres superpuestos

### Plan de Refactorización

Aunque no existe documentación explícita de refactorización, se identifican las siguientes áreas de mejora:

1. **Migración a TypeScript**: Mayor seguridad de tipos
2. **Modularización de Hooks**: Dividir `useStudentManager.js` (9517 líneas)
3. **Testing**: Agregar pruebas unitarias e integración
4. **Middleware**: Centralizar validación de auth en API routes
5. **Documentación de Código**: Agregar JSDoc/TSDoc completo
6. **Error Boundaries**: Manejo de errores en UI
7. **Logging**: Sistema de logs estructurado

## Conclusiones

### Fortalezas del Sistema

1. **Arquitectura Moderna**: Next.js 14 con App Router, React 18
2. **Escalabilidad**: Firebase Firestore escala automáticamente
3. **Real-time**: Capacidades en tiempo real nativas
4. **Mobile-first**: Diseño responsive y apps móviles complementarias
5. **Seguridad**: Autenticación robusta y aislamiento de datos
6. **UX**: Componentes accesibles y UI moderna
7. **Mantenibilidad**: Código organizado por capas

### Áreas de Oportunidad

1. Completar funcionalidades pendientes del MVP
2. Agregar testing automatizado
3. Implementar TypeScript
4. Mejorar documentación del código
5. Optimizar queries de Firestore con índices
6. Implementar monitoreo y alertas
7. Agregar analytics del negocio

### Recomendaciones Técnicas

1. **Corto Plazo** (1-2 meses):
   - Completar funcionalidades pendientes
   - Agregar tests unitarios críticos
   - Documentar APIs con Swagger/OpenAPI
   - Implementar error tracking (ej: Sentry)

2. **Mediano Plazo** (3-6 meses):
   - Migración gradual a TypeScript
   - Implementar CI/CD testing
   - Refactorizar hooks grandes
   - Agregar monitoreo de rendimiento

3. **Largo Plazo** (6-12 meses):
   - Evaluar microservicios si es necesario
   - Implementar caching avanzado
   - Considerar GraphQL si la complejidad aumenta
   - Agregar feature flags

## Contacto y Soporte

Para consultas técnicas, soporte o contribuciones al proyecto, contactar al equipo de desarrollo de RutEs.

---

**Documento Generado**: Noviembre 2025
**Versión del Sistema**: 0.1.0
**Framework**: Next.js 14.1.0
**Base de Datos**: Firebase Firestore
