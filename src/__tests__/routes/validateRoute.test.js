import { validateRoute } from "@/utils/validationSchemas";

describe("validateRoute - Validación de creación de rutas", () => {
  describe("Casos válidos", () => {
    test("debe validar una ruta con todos los campos requeridos", async () => {
      const validData = {
        name: "Ruta Norte",
        capacity: 30,
        unit: "unit-123",
        driver: "driver-456",
        auxiliar: "aux-789",
      };

      const isValid = await validateRoute.isValid(validData);
      expect(isValid).toBe(true);
    });

    test("debe validar con capacity como número", async () => {
      const data = {
        name: "Ruta Sur",
        capacity: 25,
        unit: "unit-1",
        driver: "driver-1",
        auxiliar: "aux-1",
      };

      const isValid = await validateRoute.isValid(data);
      expect(isValid).toBe(true);
    });
  });

  describe("Casos inválidos", () => {
    test("debe fallar sin nombre", async () => {
      const data = {
        name: "",
        capacity: 30,
        unit: "unit-123",
        driver: "driver-456",
        auxiliar: "aux-789",
      };

      const isValid = await validateRoute.isValid(data);
      expect(isValid).toBe(false);
    });

    test("debe fallar sin capacidad", async () => {
      const data = {
        name: "Ruta Norte",
        capacity: null,
        unit: "unit-123",
        driver: "driver-456",
        auxiliar: "aux-789",
      };

      const isValid = await validateRoute.isValid(data);
      expect(isValid).toBe(false);
    });

    test("debe fallar sin unidad", async () => {
      const data = {
        name: "Ruta Norte",
        capacity: 30,
        unit: null,
        driver: "driver-456",
        auxiliar: "aux-789",
      };

      const isValid = await validateRoute.isValid(data);
      expect(isValid).toBe(false);
    });

    test("debe fallar sin conductor", async () => {
      const data = {
        name: "Ruta Norte",
        capacity: 30,
        unit: "unit-123",
        driver: null,
        auxiliar: "aux-789",
      };

      const isValid = await validateRoute.isValid(data);
      expect(isValid).toBe(false);
    });

    test("debe fallar sin auxiliar", async () => {
      const data = {
        name: "Ruta Norte",
        capacity: 30,
        unit: "unit-123",
        driver: "driver-456",
        auxiliar: null,
      };

      const isValid = await validateRoute.isValid(data);
      expect(isValid).toBe(false);
    });
  });

  describe("Mensajes de error", () => {
    test("debe mostrar mensaje de error para nombre requerido", async () => {
      const data = {
        name: null,
        capacity: 30,
        unit: "unit-123",
        driver: "driver-456",
        auxiliar: "aux-789",
      };

      try {
        await validateRoute.validate(data);
      } catch (err) {
        expect(err.message).toBe("Nombre de ruta requerido");
      }
    });

    test("debe mostrar mensaje de error para capacidad requerida", async () => {
      const data = {
        name: "Ruta Norte",
        capacity: null,
        unit: "unit-123",
        driver: "driver-456",
        auxiliar: "aux-789",
      };

      try {
        await validateRoute.validate(data);
      } catch (err) {
        expect(err.message).toBe("Capacidad requerida");
      }
    });

    test("debe mostrar mensaje de error para unidad requerida", async () => {
      const data = {
        name: "Ruta Norte",
        capacity: 30,
        unit: null,
        driver: "driver-456",
        auxiliar: "aux-789",
      };

      try {
        await validateRoute.validate(data);
      } catch (err) {
        expect(err.message).toBe("Unidad requerida");
      }
    });

    test("debe mostrar mensaje de error para conductor requerido", async () => {
      const data = {
        name: "Ruta Norte",
        capacity: 30,
        unit: "unit-123",
        driver: null,
        auxiliar: "aux-789",
      };

      try {
        await validateRoute.validate(data);
      } catch (err) {
        expect(err.message).toBe("Conductor requerido");
      }
    });

    test("debe mostrar mensaje de error para auxiliar requerido", async () => {
      const data = {
        name: "Ruta Norte",
        capacity: 30,
        unit: "unit-123",
        driver: "driver-456",
        auxiliar: null,
      };

      try {
        await validateRoute.validate(data);
      } catch (err) {
        expect(err.message).toBe("Auxiliar requerido");
      }
    });
  });
});
