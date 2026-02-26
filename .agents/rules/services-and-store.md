---
trigger: glob
glob: "src/{services,store}/**/*.js"
description: Reglas para archivos de servicios y stores de Zustand
---

## Reglas para Services y Stores — RutEs-Admin

### Services (`src/services/`)

**Operaciones que van al servidor (fetch a `/api/`):**

- Crear usuarios en Firebase Auth (papás, tutores, admins, conductores)
- Cualquier operación que use `firebase-admin`

**Operaciones que van directo al cliente (SDK web):**

- Leer documentos con `getDocumentById`, `getDocumentByField`
- Actualizar datos simples con `updateDocument`
- Suscripciones en tiempo real con `onSnapshot`

**Patrón de suscripción (`onSnapshot`):**

```js
const subscribeXxx = (schoolId) => {
  if (!schoolId) return;
  const setLoading = useXxxStore.getState().setLoading;
  setLoading(true);
  const q = query(
    collection(db, "coleccion"),
    where("schoolId", "==", schoolId),
  );
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setXxx(data);
      setLoading(false);
    },
    (error) => {
      console.error("Error:", error);
      setLoading(false);
    },
  );
  return unsubscribe;
};
```

**Patrón de función de servicio con manejo de errores:**

```js
const miServicio = async (data) => {
  try {
    // lógica
    return { success: true, message: "Operación exitosa" };
  } catch (error) {
    return { error: error?.message || "Error desconocido" };
  }
};
```

### Stores de Zustand (`src/store/`)

- Exponer accesores estáticos al final de cada store para uso fuera de componentes:

```js
const setXxx = useXxxStore.getState().setXxx;
export { setXxx };
```

- Usar `persist` + `sessionStorage` para stores que necesiten sobrevivir recargas.
- Nunca reemplazar arrays completos — usar métodos específicos (`arrayUnion`, `arrayRemove` en Firestore; métodos del store en Zustand).
- Mantener un campo `isLoading` en cada store para indicar operaciones pendientes.
