---
trigger: glob
glob: "src/{components,app/dashboard}/**/*.jsx"
description: Reglas para componentes de React y páginas del dashboard
---

## Reglas para Componentes UI — RutEs-Admin

### Idioma

- **Todo texto visible al usuario en Español**: labels, placeholders, mensajes de error, toasts, botones.
- Los toasts de éxito/error usan `sonner`: `toast.success("...")` y `toast.error("...")`.

### Server vs Client Components

- Las páginas en `src/app/dashboard/` son **Server Components** por defecto.
- Agregar `"use client"` solo cuando el componente use: `useState`, `useEffect`, `useFormikContext`, `useRouter` u otros hooks.
- Los formularios y componentes interactivos siempre llevan `"use client"`.

### Formularios Multi-Paso (Formik)

- El estado del formulario se mantiene en Formik durante todos los pasos.
- Los schemas de validación Yup van en `src/utils/validationSchemas.js`.
- El componente orquestador (`MultiStepForm/`) maneja el `onSubmit` final y llama al servicio.
- Los pasos individuales (`Forms/Step*/`) solo leen y modifican el estado con `useFormikContext()`.

### Componentes de UI disponibles

Usar los componentes existentes en lugar de HTML nativo:

- `<InputField />` → inputs de texto
- `<SelectField />` → selects (Radix UI)
- `<Button />` y `<ButtonAction />` → botones
- `<Autocomplete />` → búsqueda con autocompletado
- `<FileInput />` → inputs de archivo (avatares)

### Iconos

Importar de `@heroicons/react` o `lucide-react`. No usar emojis como iconos en la UI.

### Clases CSS

Usar TailwindCSS. Los componentes de tabla usan DaisyUI + Tanstack Table.
El alias `@/components/ui/` es para componentes de Radix UI (Label, Tabs, etc.).

### Confirmaciones de borrado

Siempre mostrar un diálogo de confirmación antes de eliminar cualquier entidad. El borrado es lógico (`isDeleted: true`).
