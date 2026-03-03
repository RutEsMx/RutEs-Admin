/**
 * @jest-environment jsdom
 */

// Mock de variables de entorno
process.env.NEXT_PUBLIC_URL_API = "http://localhost:3000";

import {
  createRoutesByForm,
  updateRoutesByForm,
  removeRoutes,
  getRouteById,
} from "@/services/RoutesServices";

// Mock de firebase/crud
jest.mock("@/firebase/crud", () => ({
  createDocument: jest.fn(),
  deleteDocument: jest.fn(),
  updateDocument: jest.fn(),
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
  arrayUnion: jest.fn((val) => val),
  arrayRemove: jest.fn((val) => val),
}));

// Mock del store
jest.mock("@/store/useRoutesStore", () => ({
  setRoutes: jest.fn(),
}));

// Mock de db
jest.mock("@/firebase/client", () => ({
  db: "mock-db",
}));

const {
  createDocument,
  updateDocument,
  deleteDocument,
} = require("@/firebase/crud");

describe("RoutesServices - createRoutesByForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    createDocument.mockImplementation((collection) => {
      return Promise.resolve({ id: `${collection}-123` });
    });
    updateDocument.mockResolvedValue({ success: true });
  });

  test("debe crear una ruta exitosamente con datos válidos", async () => {
    const mockData = {
      name: "Ruta Norte",
      capacity: 30,
      schoolId: "school-1",
      unit: "unit-1",
      driver: "driver-1",
      auxiliar: "aux-1",
      workshop: false,
      students: {
        monday: {
          toHome: [
            { id: "student-1", stop: { coords: { lat: 19.4, lng: -99.1 } } },
          ],
          toSchool: [],
          workshop: [],
        },
      },
    };

    const result = await createRoutesByForm(mockData);

    expect(result).toEqual({
      success: true,
      message: "Ruta creada correctamente",
    });
    expect(createDocument).toHaveBeenCalledWith("travels", expect.any(Object));
    expect(createDocument).toHaveBeenCalledWith(
      "routes",
      expect.objectContaining({
        name: "Ruta Norte",
        capacity: 30,
        schoolId: "school-1",
      }),
    );
  });

  test("debe manejar error al crear ruta", async () => {
    createDocument.mockRejectedValueOnce(new Error("Firebase error"));

    const mockData = {
      name: "Ruta Norte",
      capacity: 30,
      schoolId: "school-1",
      unit: "unit-1",
      driver: "driver-1",
      auxiliar: "aux-1",
      workshop: false,
      students: {},
    };

    const result = await createRoutesByForm(mockData);

    expect(result).toHaveProperty("error");
  });
});

describe("RoutesServices - updateRoutesByForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe actualizar una ruta exitosamente", async () => {
    const { getDoc } = require("firebase/firestore");

    getDoc.mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({
        name: "Ruta Antigua",
        capacity: 25,
        unit: "unit-old",
        driver: "driver-old",
        auxiliar: "aux-old",
        workshop: false,
      }),
    });

    updateDocument.mockResolvedValue({ success: true });

    const mockData = {
      routeId: "route-123",
      name: "Ruta Norte Actualizada",
      capacity: 30,
      schoolId: "school-1",
      unit: "unit-1",
      driver: "driver-1",
      auxiliar: "aux-1",
      workshop: false,
      students: {},
      studentsToRemove: {},
    };

    const result = await updateRoutesByForm(mockData);

    expect(result).toEqual({
      success: true,
      message: "Ruta actualizada correctamente",
    });
  });

  test("debe manejar error al actualizar ruta", async () => {
    const { getDoc } = require("firebase/firestore");

    getDoc.mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({}),
    });

    updateDocument.mockRejectedValue(new Error("Update failed"));

    const mockData = {
      routeId: "route-123",
      name: "Ruta Actualizada",
      capacity: 30,
      schoolId: "school-1",
      unit: "unit-1",
      driver: "driver-1",
      auxiliar: "aux-1",
      workshop: false,
      students: {},
    };

    const result = await updateRoutesByForm(mockData);

    expect(result).toHaveProperty("error");
  });
});

describe("RoutesServices - removeRoutes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe eliminar una ruta exitosamente", async () => {
    const {
      getDoc,
      getDocs,
      query,
      where,
      collection,
      doc,
      deleteDoc: firestoreDeleteDoc,
      updateDoc: firestoreUpdateDoc,
    } = require("firebase/firestore");

    getDoc.mockResolvedValue({
      exists: jest.fn().mockReturnValue(true),
      data: jest.fn().mockReturnValue({ workshop: false }),
    });

    getDocs.mockResolvedValue({ docs: [] });
    query.mockReturnValue({});
    where.mockReturnValue({});
    collection.mockReturnValue("mock-collection");
    doc.mockReturnValue({});
    firestoreDeleteDoc.mockResolvedValue({});
    firestoreUpdateDoc.mockResolvedValue({});

    deleteDocument.mockResolvedValue({ success: true });

    const result = await removeRoutes("route-123");

    expect(result).toEqual({
      success: true,
      message: "Ruta eliminada correctamente",
    });
  });

  test("debe retornar error si la ruta no existe", async () => {
    const { getDoc } = require("firebase/firestore");
    getDoc.mockResolvedValue({
      exists: jest.fn().mockReturnValue(false),
    });

    const result = await removeRoutes("non-existent-route");

    expect(result).toEqual({ error: "Ruta no encontrada" });
  });
});

describe("RoutesServices - getRouteById", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("debe obtener una ruta por ID exitosamente", async () => {
    const mockRoute = {
      id: "route-123",
      name: "Ruta Norte",
      capacity: 30,
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRoute,
    });

    const result = await getRouteById("route-123");

    expect(result).toEqual(mockRoute);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:3000api/routes/route-123/",
      expect.objectContaining({ cache: "no-store" }),
    );
  });

  test("debe retornar error si la ruta no existe", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    const result = await getRouteById("non-existent");

    expect(result).toEqual({ error: true });
  });

  test("debe manejar errores de red", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await getRouteById("route-123");

    expect(result).toHaveProperty("error");
  });
});
