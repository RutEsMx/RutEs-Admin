# RutEs-Admin

**Administrador de RutEs mx** - Sistema de gestión de transporte escolar desarrollado en Next.js

RutEs-Admin es una plataforma completa para la administración de rutas de transporte escolar que permite a las escuelas gestionar estudiantes, conductores, auxiliares, padres de familia y rutas de manera eficiente y segura.

## 🚌 Características Principales

### Gestión de Usuarios

- **Administradores**: Control total del sistema con roles diferenciados
- **Usuarios Secundarios**: Acceso limitado para seguimiento de rutas sin datos personales
- **Autenticación**: Sistema seguro con Firebase Authentication
- **Perfiles**: Gestión completa de perfiles de usuario

### Gestión de Transporte

- **Estudiantes**: Registro completo con datos personales y asignación de rutas
- **Conductores**: Administración de choferes con información detallada
- **Auxiliares**: Gestión de nanas con asignación de NIP
- **Unidades**: Control de vehículos y su estado
- **Rutas**: Creación y administración de rutas con paradas georreferenciadas

### Funcionalidades Avanzadas

- **Mapas Interactivos**: Integración con Google Maps para visualización de rutas
- **Notificaciones**: Sistema de alertas y comunicación en tiempo real
- **Viajes con Amigos**: Autorización de cambios de ruta temporales
- **Carga Masiva**: Importación de estudiantes mediante archivos Excel
- **Reportes**: Generación de reportes descargables
- **Email Automático**: Envío de credenciales y notificaciones

## 🛠️ Tecnologías Utilizadas

### Frontend

- **Next.js 14**: Framework React con App Router
- **React 18**: Biblioteca de interfaz de usuario
- **Tailwind CSS**: Framework de estilos utilitarios
- **Radix UI**: Componentes accesibles y personalizables
- **Lucide React**: Iconografía moderna
- **React Google Maps**: Integración con Google Maps API

### Backend & Base de Datos

- **Firebase**: Autenticación y Firestore como base de datos
- **Firebase Admin**: Operaciones del lado del servidor
- **Next.js API Routes**: Endpoints RESTful

### Gestión de Estado

- **Zustand**: Manejo de estado global
- **React Context**: Contexto de autenticación

### Formularios y Validación

- **Formik**: Manejo de formularios
- **Yup**: Validación de esquemas
- **React Select**: Componentes de selección avanzados

### Utilidades

- **XLSX**: Procesamiento de archivos Excel
- **Nodemailer**: Envío de correos electrónicos
- **Handlebars**: Templates para emails
- **Sonner**: Notificaciones toast

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18 o superior
- pnpm (recomendado) o npm
- Cuenta de Firebase
- API Key de Google Maps

### Instalación

```bash
# Clonar el repositorio
git clone [repository-url]
cd rutes-admin

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp example.env .env.local
```

### Variables de Entorno

Configura las siguientes variables en tu archivo `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PROJECT_ID=

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Email Configuration
EMAIL_USER=
EMAIL_PASS=
```

### Ejecutar en Desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   ├── dashboard/         # Páginas del dashboard
│   └── signin/           # Página de inicio de sesión
├── components/            # Componentes reutilizables
│   ├── Forms/            # Formularios por pasos
│   ├── MultiStepForm/    # Formularios multi-paso
│   ├── Table/            # Componentes de tabla
│   └── ui/               # Componentes UI base
├── context/              # Contextos de React
├── firebase/             # Configuración de Firebase
├── hooks/                # Hooks personalizados
├── services/             # Servicios de API
├── store/                # Stores de Zustand
├── utils/                # Utilidades y helpers
└── views/                # Templates de email
```

## 🔐 Roles y Permisos

### Administrador Principal

- Acceso completo a todas las funcionalidades
- Gestión de usuarios, escuelas y configuraciones
- Visualización de datos personales de estudiantes

### Usuario Secundario

- Acceso limitado al seguimiento de rutas
- Sin acceso a datos personales de estudiantes
- Visualización del estado de las rutas únicamente

## 📱 Funcionalidades por Módulo

### Estudiantes

- ✅ Registro completo con datos personales
- ✅ Asignación a rutas y paradas
- ✅ Gestión de tutores/padres
- ✅ Carga masiva mediante Excel
- ✅ Búsqueda y filtrado avanzado

### Conductores

- ✅ Registro con información personal y laboral
- ✅ Asignación a unidades y rutas
- ✅ Gestión de documentación

### Auxiliares (Nanas)

- ✅ Registro completo
- ✅ Asignación de NIP para acceso
- ✅ Vinculación con rutas específicas

### Rutas

- ✅ Creación con paradas georreferenciadas
- ✅ Asignación de estudiantes por parada
- ✅ Visualización en mapas interactivos
- ✅ Gestión de horarios y días

### Notificaciones

- ✅ Sistema de alertas en tiempo real
- ✅ Notificaciones de emergencia
- ✅ Comunicación con padres de familia

## 🔄 Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Construcción para producción
pnpm build

# Iniciar servidor de producción
pnpm start

# Linting
pnpm lint

# Preparar hooks de Git
pnpm prepare
```

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Otras Plataformas

El proyecto es compatible con cualquier plataforma que soporte Next.js.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas, contacta al equipo de desarrollo.
