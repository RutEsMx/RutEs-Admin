/**
 * @jest-environment jsdom
 */

// Mock de variables de entorno
process.env.NEXT_PUBLIC_URL_API = "http://localhost:3000";

import {
  getStudents,
  deleteStudents,
  getStudentById,
  createParentsByForm,
  updateStudentByForm,
} from "@/services/StudentsServices";

// Mock de firebase/crud
jest.mock("@/firebase/crud", () => ({
  getDocumentById: jest.fn(),
  getDocumentByField: jest.fn(),
  updateDocument: jest.fn(),
  createDocument: jest.fn(),
}));

// Mock de firebase/firestore
jest.mock("firebase/firestore", () => ({
  doc: jest.fn((col, id) => ({ col, id })),
  collection: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  onSnapshot: jest.fn(),
}));

// Mock del store
jest.mock("@/store/useStudentsStore", () => ({
  setStudents: jest.fn(),
  setLoading: jest.fn(),
  setStudent: jest.fn(),
  useStudentsStore: {
    getState: jest.fn(() => ({
      setStudents: jest.fn(),
      setLoading: jest.fn(),
      setStudent: jest.fn(),
      updateStudent: jest.fn(),
      getStudentsRoutes: jest.fn(),
    })),
  },
}));

// Mock de TableServices
jest.mock("@/services/TableServices", () => ({
  setStructureDatatable: jest.fn((data) => data),
}));

// Mock de db
jest.mock("@/firebase/client", () => ({
  db: "mock-db",
}));

const {
  getDocumentById,
  getDocumentByField,
  updateDocument,
} = require("@/firebase/crud");

describe("StudentsServices - getStudents", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("debe obtener estudiantes exitosamente", async () => {
    const mockStudents = [
      { id: "student-1", name: "Juan", lastName: "Pérez" },
      { id: "student-2", name: "María", lastName: "García" },
    ];

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockStudents,
      redirected: false,
    });

    const result = await getStudents();

    expect(result).toBe(true);
  });

  test("debe manejar error al obtener estudiantes", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await getStudents();

    expect(result).toHaveProperty("error");
  });

  test("debe manejar redirect", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      redirected: true,
      url: "/login",
    });

    const result = await getStudents();

    expect(result).toHaveProperty("error");
    expect(result.redirect).toBe("/login");
  });
});

describe("StudentsServices - deleteStudents", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("debe eliminar estudiantes exitosamente", async () => {
    const mockIds = ["student-1", "student-2"];
    const mockResponse = { success: true, message: "Estudiantes eliminados" };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
      redirected: false,
    });

    const result = await deleteStudents(mockIds);

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/students",
      expect.objectContaining({
        method: "DELETE",
        body: JSON.stringify(mockIds),
      }),
    );
  });

  test("debe manejar error al eliminar estudiantes", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Delete failed"));

    const result = await deleteStudents(["student-1"]);

    expect(result).toHaveProperty("error");
  });
});

describe("StudentsServices - getStudentById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe obtener un estudiante por ID exitosamente", async () => {
    const mockStudent = {
      id: "student-1",
      name: "Juan",
      lastName: "Pérez",
    };

    getDocumentById.mockResolvedValueOnce(mockStudent);
    getDocumentByField.mockResolvedValueOnce([
      { id: "stop-1", coords: { lat: 19.4, lng: -99.1 } },
    ]);

    const result = await getStudentById("student-1");

    expect(result).toHaveProperty("id", "student-1");
    expect(result).toHaveProperty("name", "Juan");
    expect(result).toHaveProperty("stops");
  });

  test("debe retornar error si estudiante no existe", async () => {
    getDocumentById.mockResolvedValueOnce(null);

    const result = await getStudentById("non-existent");

    expect(result).toHaveProperty("error");
    expect(result.error).toBe("Estudiante no encontrado");
  });

  test("debe manejar error al obtener estudiante", async () => {
    getDocumentById.mockRejectedValueOnce(new Error("Database error"));

    const result = await getStudentById("student-1");

    expect(result).toHaveProperty("error");
  });
});

describe("StudentsServices - createParentsByForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("debe crear estudiante exitosamente", async () => {
    const mockData = {
      name: "Juan",
      lastName: "Pérez",
      enrollment: "2023001",
      schoolId: "school-1",
    };

    const mockResponse = { id: "student-1", ...mockData };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await createParentsByForm(mockData, "school-1");

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/students",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ ...mockData, schoolId: "school-1" }),
      }),
    );
  });

  test("debe manejar error al crear estudiante", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Error al crear estudiante" }),
    });

    const result = await createParentsByForm({}, "school-1");

    expect(result).toHaveProperty("error");
  });

  test("debe lanzar error si response no es ok", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Datos inválidos" }),
    });

    const mockData = { name: "Juan" };
    const result = await createParentsByForm(mockData, "school-1");

    expect(result.error).toBeDefined();
  });
});

describe("StudentsServices - updateStudentByForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe actualizar estudiante exitosamente", async () => {
    const mockData = {
      id: "student-1",
      name: "Juan Actualizado",
      lastName: "Pérez",
    };

    updateDocument.mockResolvedValue({ success: true });

    const result = await updateStudentByForm(mockData);

    expect(result).toEqual({
      success: true,
      message: "Estudiante actualizado correctamente",
    });
    expect(updateDocument).toHaveBeenCalledWith(
      "students",
      "student-1",
      expect.objectContaining({
        name: "Juan Actualizado",
        lastName: "Pérez",
        fullName: ["juan actualizado", "pérez"],
      }),
    );
  });

  test("debe manejar error al actualizar estudiante", async () => {
    updateDocument.mockResolvedValue({ error: "Update failed" });

    const result = await updateStudentByForm({ id: "student-1" });

    expect(result).toHaveProperty("error");
  });

  test("debe construir fullName correctamente", async () => {
    updateDocument.mockResolvedValue({ success: true });

    await updateStudentByForm({
      id: "student-1",
      name: "Juan",
      lastName: "Pérez",
      secondLastName: "García",
    });

    expect(updateDocument).toHaveBeenCalledWith(
      "students",
      "student-1",
      expect.objectContaining({
        fullName: ["juan", "pérez", "garcía"],
      }),
    );
  });

  test("debe manejar error inesperado", async () => {
    updateDocument.mockRejectedValueOnce(new Error("Unexpected error"));

    const result = await updateStudentByForm({ id: "student-1" });

    expect(result).toHaveProperty("error");
  });
});
