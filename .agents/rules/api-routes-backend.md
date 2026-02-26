---
trigger: glob
glob: "src/app/api/**/*.js"
description: Reglas para los Route Handlers de la API (backend con firebase-admin)
---

## Reglas para API Routes — RutEs-Admin

Estas reglas aplican a todos los archivos dentro de `src/app/api/`.

### Obligatorio

- Siempre llamar `customInitApp()` al inicio del archivo para inicializar Firebase Admin.
- Usar `firestore()` de `firebase-admin` (no el SDK web de cliente).
- Autenticar al usuario con `getUSer(sessionid?.value)` antes de operar. Redirigir a `/signin` si hay error.
- Retornar siempre `NextResponse.json(...)` con un status code apropiado.

### Manejo de Errores

```js
try {
  // lógica
  return NextResponse.json({ success: true, message: "..." });
} catch (error) {
  console.error("Descripción del error:", error);
  return NextResponse.json({ error: error.message }, { status: 500 });
}
```

### Creación de Usuarios (Auth)

- Usar `getAuth()` de `firebase-admin/auth` para crear usuarios.
- Generar contraseña aleatoria: `Math.random().toString(36).slice(-8)`.
- Enviar contraseña por email usando `sendPassword()` de `@/services/MailService`.
- El UID generado por Auth es el ID del documento en `profile`.

### Estructura de Respuesta Exitosa

```js
{ success: true, message: "Mensaje en español", id: "docId" }
```

### Estructura de Respuesta de Error

```js
{
  error: "Descripción del error";
} // status 400 o 500
```

### Headers de Autenticación para Bulk

Cuando el endpoint necesita `schoolId` sin sesión (ej: bulk-upload), leerlo de headers:

```js
const schoolId = request.headers.get("schoolId");
```
