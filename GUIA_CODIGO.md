# Guía de Código - RutEs-Admin

## Índice

1. [Introducción](#introducción)
2. [Convenciones de Código](#convenciones-de-código)
3. [Estructura de Componentes](#estructura-de-componentes)
4. [Servicios y API](#servicios-y-api)
5. [Gestión de Estado](#gestión-de-estado)
6. [Formularios](#formularios)
7. [Manejo de Errores](#manejo-de-errores)
8. [Ejemplos Completos](#ejemplos-completos)
9. [Patrones Comunes](#patrones-comunes)
10. [Tips y Mejores Prácticas](#tips-y-mejores-prácticas)

## Introducción

Esta guía proporciona ejemplos de código real del proyecto RutEs-Admin, explicando patrones, convenciones y cómo implementar funcionalidades comunes.

## Convenciones de Código

### Nomenclatura

```javascript
// Variables y funciones: camelCase
const studentData = {};
const fetchStudents = async () => {};

// Componentes: PascalCase
function StudentCard() {}
function RouteForm() {}

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = process.env.NEXT_PUBLIC_URL_API;
const MAX_STUDENTS_PER_ROUTE = 50;

// Archivos de componentes: PascalCase
// StudentCard.jsx, RouteForm.jsx

// Archivos de servicios/utils: camelCase
// studentService.js, dateHelpers.js

// Nombres de stores: use + PascalCase + Store
// useStudentStore.js, useRoutesStore.js
```

### Organización de Imports

```javascript
// 1. Imports de React/Next.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Imports de librerías externas
import { toast } from 'sonner';
import { useFormik } from 'formik';

// 3. Imports de componentes locales
import { Button } from '@/components/ui/Button';
import StudentCard from '@/components/StudentCard';

// 4. Imports de hooks/stores/servicios
import { useStudentStore } from '@/store/useStudentStore';
import { getStudents } from '@/services/students';

// 5. Imports de utils/constantes
import { formatDate } from '@/utils/helpers';
import { BLOOD_TYPES } from '@/utils/constants';

// 6. Imports de tipos (si usas TypeScript)
import type { Student } from '@/types';
```

## Estructura de Componentes

### Componente Cliente Típico

```jsx
// src/components/StudentList.jsx
'use client'

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useStudentStore } from '@/store/useStudentStore';
import { getStudents, deleteStudent } from '@/services/students';
import { Button } from '@/components/ui/Button';
import StudentCard from './StudentCard';

export default function StudentList() {
  // 1. State local
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // 2. Stores globales
  const { students, setStudents, removeStudent } = useStudentStore();

  // 3. Efectos
  useEffect(() => {
    loadStudents();
  }, []);

  // 4. Funciones handlers
  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      toast.error('Error al cargar estudiantes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este estudiante?')) return;

    try {
      await deleteStudent(id);
      removeStudent(id);
      toast.success('Estudiante eliminado');
    } catch (error) {
      toast.error('Error al eliminar estudiante');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map(s => s.id));
    }
  };

  // 5. Render condicional
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay estudiantes registrados</p>
        <Button onClick={() => router.push('/dashboard/students/new')}>
          Agregar Estudiante
        </Button>
      </div>
    );
  }

  // 6. Render principal
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Estudiantes ({students.length})
        </h2>
        <Button onClick={handleSelectAll}>
          {selectedIds.length === students.length ? 'Deseleccionar' : 'Seleccionar'} Todos
        </Button>
      </div>

      {/* Grid de estudiantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map(student => (
          <StudentCard
            key={student.id}
            student={student}
            isSelected={selectedIds.includes(student.id)}
            onSelect={(id) => {
              setSelectedIds(prev =>
                prev.includes(id)
                  ? prev.filter(i => i !== id)
                  : [...prev, id]
              );
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
```

### Componente Servidor

```jsx
// app/dashboard/students/page.jsx
import { getStudents } from '@/services/students';
import StudentTable from '@/components/StudentTable';

export const metadata = {
  title: 'Estudiantes | RutEs-Admin',
  description: 'Gestión de estudiantes'
};

// Server Component - se renderiza en el servidor
export default async function StudentsPage() {
  // Fetch de datos en el servidor
  const students = await getStudents();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gestión de Estudiantes</h1>
        <p className="text-gray-600">
          Administra los estudiantes de tu escuela
        </p>
      </div>

      {/* Client Component para interactividad */}
      <StudentTable initialData={students} />
    </div>
  );
}
```

### Componente UI Reutilizable

```jsx
// src/components/ui/Button.jsx
import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/utils/helpers';

// Definir variantes del botón
const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50',
        ghost: 'hover:bg-gray-100',
        link: 'underline-offset-4 hover:underline text-blue-600'
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

const Button = forwardRef(({
  className,
  variant,
  size,
  children,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
```

## Servicios y API

### Service Layer (Cliente)

```javascript
// src/services/students.js

const API_URL = process.env.NEXT_PUBLIC_URL_API || '';

/**
 * Obtiene todos los estudiantes de la escuela del usuario autenticado
 * @returns {Promise<Array>} Lista de estudiantes
 */
export const getStudents = async () => {
  try {
    const response = await fetch(`${API_URL}/api/students`, {
      method: 'GET',
      credentials: 'include', // Incluir cookies
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener estudiantes');
    }

    return await response.json();
  } catch (error) {
    console.error('getStudents error:', error);
    throw error;
  }
};

/**
 * Crea un nuevo estudiante
 * @param {Object} studentData - Datos del estudiante
 * @returns {Promise<Object>} Estudiante creado
 */
export const createStudent = async (studentData) => {
  try {
    const response = await fetch(`${API_URL}/api/students`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(studentData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear estudiante');
    }

    return await response.json();
  } catch (error) {
    console.error('createStudent error:', error);
    throw error;
  }
};

/**
 * Actualiza un estudiante existente
 * @param {string} id - ID del estudiante
 * @param {Object} updates - Datos a actualizar
 * @returns {Promise<Object>} Estudiante actualizado
 */
export const updateStudent = async (id, updates) => {
  try {
    const response = await fetch(`${API_URL}/api/students/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar estudiante');
    }

    return await response.json();
  } catch (error) {
    console.error('updateStudent error:', error);
    throw error;
  }
};

/**
 * Elimina un estudiante (soft delete)
 * @param {string} id - ID del estudiante
 * @returns {Promise<void>}
 */
export const deleteStudent = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/students/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar estudiante');
    }
  } catch (error) {
    console.error('deleteStudent error:', error);
    throw error;
  }
};

/**
 * Carga masiva de estudiantes desde Excel
 * @param {File} file - Archivo Excel
 * @returns {Promise<Object>} Resultado de la carga
 */
export const bulkUploadStudents = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_URL}/api/students/bulk-upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData // No incluir Content-Type, el navegador lo maneja
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en la carga masiva');
    }

    return await response.json();
  } catch (error) {
    console.error('bulkUploadStudents error:', error);
    throw error;
  }
};
```

### API Route (Servidor)

```javascript
// app/api/students/route.js
import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { getUser } from '@/firebase/validateToken';

/**
 * GET /api/students
 * Obtiene todos los estudiantes de la escuela del usuario
 */
export async function GET(request) {
  try {
    // 1. Autenticación
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // 2. Obtener schoolId del usuario
    const { schoolId } = user;

    // 3. Query a Firestore
    const q = query(
      collection(db, 'students'),
      where('schoolId', '==', schoolId),
      where('isDeleted', '==', false)
    );

    const querySnapshot = await getDocs(q);

    // 4. Mapear documentos
    const students = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convertir Timestamps a strings para JSON
      birthDate: doc.data().birthDate?.toDate().toISOString(),
      createdAt: doc.data().createdAt?.toDate().toISOString()
    }));

    // 5. Respuesta
    return NextResponse.json(students);

  } catch (error) {
    console.error('GET /api/students error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/students
 * Crea un nuevo estudiante
 */
export async function POST(request) {
  try {
    // 1. Autenticación y autorización
    const user = await getUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    if (!user.roles.includes('admin')) {
      return NextResponse.json(
        { error: 'Permiso denegado' },
        { status: 403 }
      );
    }

    // 2. Obtener datos del body
    const body = await request.json();

    // 3. Validación de datos requeridos
    const requiredFields = ['name', 'lastName', 'grade', 'group'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Campo requerido: ${field}` },
          { status: 400 }
        );
      }
    }

    // 4. Preparar datos para Firestore
    const studentData = {
      name: body.name,
      lastName: body.lastName,
      secondLastName: body.secondLastName || '',
      birthDate: body.birthDate ? Timestamp.fromDate(new Date(body.birthDate)) : null,
      bloodType: body.bloodType || '',
      allergies: body.allergies || '',
      grade: body.grade,
      group: body.group,
      enrollment: body.enrollment || '',
      serviceType: body.serviceType || 'complete',
      address: body.address || {},
      schoolId: user.schoolId,
      parents: body.parents || [],
      tutors: body.tutors || [],
      fullName: generateFullNameArray(body.name, body.lastName, body.secondLastName),
      statusTravel: 'waiting',
      createdAt: Timestamp.now(),
      isDeleted: false
    };

    // 5. Guardar en Firestore
    const docRef = await addDoc(
      collection(db, 'students'),
      studentData
    );

    // 6. Respuesta
    return NextResponse.json({
      id: docRef.id,
      ...studentData,
      birthDate: studentData.birthDate?.toDate().toISOString(),
      createdAt: studentData.createdAt.toDate().toISOString()
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/students error:', error);
    return NextResponse.json(
      { error: 'Error al crear estudiante', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Genera array de strings para búsqueda
 */
function generateFullNameArray(name, lastName, secondLastName) {
  const parts = [
    name?.toLowerCase(),
    lastName?.toLowerCase(),
    secondLastName?.toLowerCase()
  ].filter(Boolean);

  const combinations = [
    ...parts,
    parts.slice(0, 2).join(' '),
    parts.join(' ')
  ];

  return [...new Set(combinations)]; // Eliminar duplicados
}
```

## Gestión de Estado

### Zustand Store

```javascript
// src/store/useStudentStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useStudentStore = create(
  persist(
    (set, get) => ({
      // State
      students: [],
      selectedStudent: null,
      filters: {
        grade: '',
        group: '',
        searchTerm: ''
      },

      // Setters
      setStudents: (students) => set({ students }),

      setSelectedStudent: (student) => set({ selectedStudent: student }),

      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
      })),

      // Actions
      addStudent: (student) => set((state) => ({
        students: [...state.students, student]
      })),

      updateStudent: (id, updates) => set((state) => ({
        students: state.students.map(s =>
          s.id === id ? { ...s, ...updates } : s
        ),
        selectedStudent: state.selectedStudent?.id === id
          ? { ...state.selectedStudent, ...updates }
          : state.selectedStudent
      })),

      removeStudent: (id) => set((state) => ({
        students: state.students.filter(s => s.id !== id),
        selectedStudent: state.selectedStudent?.id === id
          ? null
          : state.selectedStudent
      })),

      // Computed/Selectors
      getFilteredStudents: () => {
        const { students, filters } = get();
        return students.filter(student => {
          if (filters.grade && student.grade !== filters.grade) return false;
          if (filters.group && student.group !== filters.group) return false;
          if (filters.searchTerm) {
            const search = filters.searchTerm.toLowerCase();
            const fullName = `${student.name} ${student.lastName} ${student.secondLastName}`.toLowerCase();
            if (!fullName.includes(search)) return false;
          }
          return true;
        });
      },

      getStudentById: (id) => {
        return get().students.find(s => s.id === id);
      },

      // Reset
      reset: () => set({
        students: [],
        selectedStudent: null,
        filters: { grade: '', group: '', searchTerm: '' }
      })
    }),
    {
      name: 'student-storage',
      storage: createJSONStorage(() => sessionStorage),
      // Opcionalmente, seleccionar qué persistir
      partialize: (state) => ({
        students: state.students,
        filters: state.filters
        // No persistir selectedStudent
      })
    }
  )
);
```

### Uso del Store en Componentes

```jsx
// En un componente
import { useStudentStore } from '@/store/useStudentStore';

function StudentDashboard() {
  // Subscribirse solo a lo necesario
  const students = useStudentStore(state => state.students);
  const addStudent = useStudentStore(state => state.addStudent);
  const getFilteredStudents = useStudentStore(state => state.getFilteredStudents);

  // Usar selector para datos computados
  const filteredStudents = getFilteredStudents();

  return (
    <div>
      <h2>Total: {students.length}</h2>
      <h3>Filtrados: {filteredStudents.length}</h3>
      {/* ... */}
    </div>
  );
}
```

### Context API para Autenticación

```jsx
// src/context/AuthContext.jsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Obtener datos adicionales del usuario
          const userDoc = await getDoc(doc(db, 'profile', firebaseUser.uid));

          if (userDoc.exists()) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userDoc.data()
            });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    isAdmin: user?.roles?.includes('admin') || user?.roles?.includes('admin-rutes'),
    isSecondaryUser: user?.roles?.includes('user-school')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## Formularios

### Formulario con Formik y Yup

```jsx
// src/components/Forms/StudentForm.jsx
'use client'

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { createStudent } from '@/services/students';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

// Esquema de validación
const studentSchema = Yup.object({
  name: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'Mínimo 2 caracteres'),
  lastName: Yup.string()
    .required('El apellido es requerido'),
  secondLastName: Yup.string(),
  birthDate: Yup.date()
    .required('La fecha de nacimiento es requerida')
    .max(new Date(), 'La fecha no puede ser futura'),
  bloodType: Yup.string()
    .oneOf(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']),
  grade: Yup.string()
    .required('El grado es requerido'),
  group: Yup.string()
    .required('El grupo es requerido'),
  email: Yup.string()
    .email('Email inválido')
});

export default function StudentForm({ onSuccess }) {
  const formik = useFormik({
    initialValues: {
      name: '',
      lastName: '',
      secondLastName: '',
      birthDate: '',
      bloodType: '',
      allergies: '',
      grade: '',
      group: '',
      enrollment: ''
    },
    validationSchema: studentSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await createStudent(values);
        toast.success('Estudiante creado exitosamente');
        resetForm();
        onSuccess?.();
      } catch (error) {
        toast.error(error.message);
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nombre *
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.name && formik.errors.name ? 'border-red-500' : ''}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
        )}
      </div>

      {/* Apellido Paterno */}
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium mb-1">
          Apellido Paterno *
        </label>
        <Input
          id="lastName"
          name="lastName"
          type="text"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : ''}
        />
        {formik.touched.lastName && formik.errors.lastName && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.lastName}</p>
        )}
      </div>

      {/* Tipo de Sangre */}
      <div>
        <label htmlFor="bloodType" className="block text-sm font-medium mb-1">
          Tipo de Sangre
        </label>
        <Select
          id="bloodType"
          name="bloodType"
          value={formik.values.bloodType}
          onChange={formik.handleChange}
        >
          <option value="">Seleccionar</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </Select>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => formik.resetForm()}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {formik.isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}
```

## Manejo de Errores

### Try-Catch en Servicios

```javascript
// src/services/students.js

export const getStudents = async () => {
  try {
    const response = await fetch('/api/students', {
      credentials: 'include'
    });

    // Verificar status code
    if (!response.ok) {
      // Intentar parsear error del servidor
      let errorMessage = 'Error al obtener estudiantes';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // Si no se puede parsear JSON, usar mensaje por defecto
      }

      throw new Error(errorMessage);
    }

    return await response.json();

  } catch (error) {
    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error('getStudents error:', error);
    }

    // Re-throw con mensaje amigable
    throw new Error(
      error.message || 'Error de conexión. Por favor intenta de nuevo.'
    );
  }
};
```

### Error Boundary (React)

```jsx
// src/components/ErrorBoundary.jsx
'use client'

import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Aquí podrías enviar el error a un servicio de logging
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Algo salió mal
          </h2>
          <p className="text-red-600 mb-4">
            {this.state.error?.message || 'Error desconocido'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Intentar de nuevo
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Ejemplos Completos

### Tabla de Datos con TanStack Table

```jsx
// src/components/StudentTable.jsx
'use client'

import { useState, useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

// Filtro fuzzy para búsqueda
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

export default function StudentTable({ data }) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);

  // Definir columnas
  const columns = useMemo(() => [
    {
      accessorKey: 'enrollment',
      header: 'Matrícula',
      size: 100
    },
    {
      accessorKey: 'name',
      header: 'Nombre',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">
            {row.original.name} {row.original.lastName}
          </div>
          <div className="text-sm text-gray-500">
            {row.original.secondLastName}
          </div>
        </div>
      )
    },
    {
      accessorKey: 'grade',
      header: 'Grado',
      size: 80
    },
    {
      accessorKey: 'group',
      header: 'Grupo',
      size: 80
    },
    {
      accessorKey: 'bloodType',
      header: 'Tipo de Sangre',
      size: 120
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="text-blue-600 hover:text-blue-800"
          >
            Editar
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="text-red-600 hover:text-red-800"
          >
            Eliminar
          </button>
        </div>
      )
    }
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: fuzzyFilter,
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  });

  return (
    <div className="space-y-4">
      {/* Buscador */}
      <input
        value={globalFilter ?? ''}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Buscar estudiantes..."
        className="px-4 py-2 border rounded-lg w-full max-w-sm"
      />

      {/* Tabla */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽'
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">
          Página {table.getState().pagination.pageIndex + 1} de{' '}
          {table.getPageCount()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Patrones Comunes

### Custom Hook para Datos

```javascript
// src/hooks/useStudents.js
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getStudents } from '@/services/students';

export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return {
    students,
    loading,
    error,
    refetch: loadStudents
  };
}

// Uso en componente
function StudentList() {
  const { students, loading, error, refetch } = useStudents();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={refetch}>Recargar</button>
      {/* ... */}
    </div>
  );
}
```

## Tips y Mejores Prácticas

### 1. Optimización de Re-renders

```jsx
// ❌ Esto causa re-render en cada cambio
const { students, addStudent, updateStudent, deleteStudent } = useStudentStore();

// ✅ Subscribirse solo a lo necesario
const students = useStudentStore(state => state.students);
const addStudent = useStudentStore(state => state.addStudent);
```

### 2. Lazy Loading de Componentes

```jsx
import { lazy, Suspense } from 'react';

// Cargar componente pesado solo cuando se necesite
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 3. Memoización

```jsx
import { useMemo, useCallback } from 'react';

function StudentList({ students }) {
  // Memoizar cálculos costosos
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [students]);

  // Memoizar funciones pasadas como props
  const handleSelect = useCallback((id) => {
    console.log('Selected:', id);
  }, []);

  return (
    <div>
      {sortedStudents.map(student => (
        <StudentCard
          key={student.id}
          student={student}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}
```

### 4. Debouncing en Búsquedas

```jsx
import { useState, useEffect } from 'react';

function SearchInput({ onSearch }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    // Debounce: esperar 500ms después de que el usuario deje de escribir
    const timeout = setTimeout(() => {
      onSearch(value);
    }, 500);

    return () => clearTimeout(timeout);
  }, [value, onSearch]);

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Buscar..."
    />
  );
}
```

---

**Guía de Código - RutEs-Admin**
Última actualización: Noviembre 2025
Versión: 1.0
