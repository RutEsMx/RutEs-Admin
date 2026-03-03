/**
 * @jest-environment jsdom
 */

// Mock de variables de entorno
process.env.NEXT_PUBLIC_URL_API = "http://localhost:3000";

import {
  validateStudent,
  validateStudentEdit,
} from "@/utils/validationSchemas";

// Mock de firebase
jest.mock("@/firebase/client", () => ({
  auth: {},
  db: "mock-db",
  app: {},
}));

jest.mock("firebase/auth", () => ({
  fetchSignInMethodsForEmail: jest.fn().mockResolvedValue([]),
  getAuth: jest.fn(() => ({})),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  onSnapshot: jest.fn(),
}));

describe("validateStudent - Validación de creación de estudiantes", () => {
  const validStudent = {
    name: "Juan",
    lastName: "Pérez",
    secondLastName: "García",
    birthDate: new Date("2015-05-10"),
    bloodType: "O+",
    allergies: "Ninguna",
    grade: "3",
    group: "A",
    enrollment: "2023001",
    serviceType: "complete",
    address: {
      street: "Av. Principal",
      number: "123",
      interiorNumber: "",
      neighborhood: "Centro",
      postalCode: "06000",
      city: "CDMX",
      state: "Ciudad de México",
    },
    includeFather: true,
    includeMother: false,
  };

  describe("Casos válidos", () => {
    test("debe validar un estudiante con todos los campos requeridos", async () => {
      const isValid = await validateStudent.isValid(validStudent);
      expect(isValid).toBe(true);
    });

    test("debe validar con solo padre", async () => {
      const data = {
        ...validStudent,
        includeFather: true,
        includeMother: false,
      };
      const isValid = await validateStudent.isValid(data);
      expect(isValid).toBe(true);
    });

    test("debe validar con solo madre", async () => {
      const data = {
        ...validStudent,
        includeFather: false,
        includeMother: true,
      };
      const isValid = await validateStudent.isValid(data);
      expect(isValid).toBe(true);
    });

    test("debe validar sin alergias", async () => {
      const data = { ...validStudent, allergies: "" };
      const isValid = await validateStudent.isValid(data);
      expect(isValid).toBe(true);
    });
  });

  describe("Casos inválidos - Campos requeridos", () => {
    test("debe fallar sin nombre", async () => {
      const data = { ...validStudent, name: "" };
      const isValid = await validateStudent.isValid(data);
      expect(isValid).toBe(false);
    });

    test("debe fallar sin apellido paterno", async () => {
      const data = { ...validStudent, lastName: "" };
      const isValid = await validateStudent.isValid(data);
      expect(isValid).toBe(false);
    });

    test("debe fallar sin matrícula", async () => {
      const data = { ...validStudent, enrollment: "" };
      const isValid = await validateStudent.isValid(data);
      expect(isValid).toBe(false);
    });

    test("debe fallar sin tipo de servicio", async () => {
      const data = { ...validStudent, serviceType: "" };
      const isValid = await validateStudent.isValid(data);
      expect(isValid).toBe(false);
    });

    test("debe fallar sin dirección", async () => {
      const data = { ...validStudent, address: {} };
      const isValid = await validateStudent.isValid(data);
      expect(isValid).toBe(false);
    });
  });

  describe("Casos inválidos - Dirección", () => {
    test("debe fallar sin calle", async () => {
      const data = {
        ...validStudent,
        address: { ...validStudent.address, street: "" },
      };
      const isValid = await validateStudent.isValid(data);
      expect(isValid).toBe(false);
    });

    test("debe fallar sin número", async () => {
      const data = {
        ...validStudent,
        address: { ...validStudent.address, number: "" },
      };
      const isValid = await validateStudent.isValid(data);
      expect(isValid).toBe(false);
    });

    test("debe fallar sin colonia", async () => {
      const data = {
        ...validStudent,
        address: { ...validStudent.address, neighborhood: "" },
      };
      const isValid = await validateStudent.isValid(data);
      expect(isValid).toBe(false);
    });

    test("debe fallar sin código postal", async () => {
      const data = {
        ...validStudent,
        address: { ...validStudent.address, postalCode: "" },
      };
      const isValid = await validateStudent.isValid(data);
      expect(isValid).toBe(false);
    });

    test("debe fallar sin ciudad", async () => {
      const data = {
        ...validStudent,
        address: { ...validStudent.address, city: "" },
      };
      const isValid = await validateStudent.isValid(data);
      expect(isValid).toBe(false);
    });

    test("debe fallar sin estado", async () => {
      const data = {
        ...validStudent,
        address: { ...validStudent.address, state: "" },
      };
      const isValid = await validateStudent.isValid(data);
      expect(isValid).toBe(false);
    });
  });

  describe("Casos inválidos - Padres", () => {
    test("debe fallar sin seleccionar padre ni madre", async () => {
      const data = {
        ...validStudent,
        includeFather: false,
        includeMother: false,
      };
      const isValid = await validateStudent.isValid(data);
      expect(isValid).toBe(false);
    });
  });

  describe("Mensajes de error", () => {
    test("debe mostrar mensaje para nombre requerido", async () => {
      const data = { ...validStudent, name: null };
      try {
        await validateStudent.validate(data);
      } catch (err) {
        expect(err.message).toBe("Nombre requerido");
      }
    });

    test("debe mostrar mensaje para apellido paterno requerido", async () => {
      const data = { ...validStudent, lastName: null };
      try {
        await validateStudent.validate(data);
      } catch (err) {
        expect(err.message).toBe("Apellido Paterno requerido");
      }
    });

    test("debe mostrar mensaje para matrícula requerida", async () => {
      const data = { ...validStudent, enrollment: null };
      try {
        await validateStudent.validate(data);
      } catch (err) {
        expect(err.message).toBe("Matricula requerida");
      }
    });

    test("debe mostrar mensaje para tipo de servicio requerido", async () => {
      const data = { ...validStudent, serviceType: null };
      try {
        await validateStudent.validate(data);
      } catch (err) {
        expect(err.message).toBe("Tipo de Servicio requerido");
      }
    });

    test("debe mostrar mensaje para calle requerida", async () => {
      const data = {
        ...validStudent,
        address: { ...validStudent.address, street: null },
      };
      try {
        await validateStudent.validate(data);
      } catch (err) {
        expect(err.message).toBe("Calle requerida");
      }
    });

    test("debe mostrar mensaje para seleccionar al menos un padre", async () => {
      const data = {
        ...validStudent,
        includeFather: false,
        includeMother: false,
      };
      try {
        await validateStudent.validate(data);
      } catch (err) {
        expect(err.message).toBe("Selecciona al menos un padre");
      }
    });
  });
});

describe("validateStudentEdit - Validación de edición de estudiantes", () => {
  const validStudentEdit = {
    name: "Juan",
    lastName: "Pérez",
    secondLastName: "García",
    birthDate: new Date("2015-05-10"),
    bloodType: "O+",
    allergies: "Ninguna",
    grade: "3",
    group: "A",
    enrollment: "2023001",
    serviceType: "complete",
  };

  describe("Casos válidos", () => {
    test("debe validar un estudiante para edición con campos requeridos", async () => {
      const isValid = await validateStudentEdit.isValid(validStudentEdit);
      expect(isValid).toBe(true);
    });
  });

  describe("Casos inválidos", () => {
    test("debe fallar sin nombre", async () => {
      const data = { ...validStudentEdit, name: "" };
      const isValid = await validateStudentEdit.isValid(data);
      expect(isValid).toBe(false);
    });

    test("debe fallar sin apellido paterno", async () => {
      const data = { ...validStudentEdit, lastName: "" };
      const isValid = await validateStudentEdit.isValid(data);
      expect(isValid).toBe(false);
    });

    test("debe fallar sin matrícula", async () => {
      const data = { ...validStudentEdit, enrollment: "" };
      const isValid = await validateStudentEdit.isValid(data);
      expect(isValid).toBe(false);
    });

    test("debe fallar sin tipo de servicio", async () => {
      const data = { ...validStudentEdit, serviceType: "" };
      const isValid = await validateStudentEdit.isValid(data);
      expect(isValid).toBe(false);
    });
  });

  describe("Mensajes de error", () => {
    test("debe mostrar mensaje para nombre requerido", async () => {
      const data = { ...validStudentEdit, name: null };
      try {
        await validateStudentEdit.validate(data);
      } catch (err) {
        expect(err.message).toBe("Nombre requerido");
      }
    });

    test("debe mostrar mensaje para apellido paterno requerido", async () => {
      const data = { ...validStudentEdit, lastName: null };
      try {
        await validateStudentEdit.validate(data);
      } catch (err) {
        expect(err.message).toBe("Apellido Paterno requerido");
      }
    });

    test("debe mostrar mensaje para matrícula requerida", async () => {
      const data = { ...validStudentEdit, enrollment: null };
      try {
        await validateStudentEdit.validate(data);
      } catch (err) {
        expect(err.message).toBe("Matricula requerida");
      }
    });

    test("debe mostrar mensaje para tipo de servicio requerido", async () => {
      const data = { ...validStudentEdit, serviceType: null };
      try {
        await validateStudentEdit.validate(data);
      } catch (err) {
        expect(err.message).toBe("Tipo de Servicio requerido");
      }
    });
  });
});
