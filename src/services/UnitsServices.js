import { createDocument, updateDocument } from "@/firebase/crud";

const createUnitsByForm = async (data) => {
  const dataCopy = { ...data };
  try {
    const response = await createDocument("units", dataCopy);
    if (response?.error) return { error: response.error };
    return { success: true, message: "Unidad creada correctamente" };
  } catch (error) {
    return { error };
  }
};

const updateUnitsByForm = async (data) => {
  const dataCopy = { ...data };

  try {
    const response = await updateDocument("units", dataCopy.id, dataCopy);

    if (response?.error) return { error: response.error };
    return {
      success: true,
      message: "Usuario actualizado correctamente",
      result: dataCopy,
    };
  } catch (error) {
    return { error };
  }
};

const getUnits = async ({ pageIndex, pageSize, schoolId }) => {
  try {
    const response = await fetch(
      `/api/units?pageIndex=${pageIndex}&pageSize=${pageSize}&schoolId=${schoolId}`,
    );
    return { success: true, data: response };
  } catch (error) {
    return { error };
  }
};

export { createUnitsByForm, getUnits, updateUnitsByForm };
