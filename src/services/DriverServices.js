import { createDocument, updateDocument } from "@/firebase/crud";

const createDriverByForm = async (data) => {
  const dataCopy = { ...data };
  try {
    const response = await createDocument("drivers", dataCopy);
    if (response?.error) return { error: response.error };
    return { success: true, message: "Conductor creado correctamente" };
  } catch (error) {
    return { error };
  }
};

const updateDriverByForm = async (data) => {
  const dataCopy = { ...data };

  try {
    const response = await updateDocument("drivers", dataCopy.id, dataCopy);

    if (response?.error) return { error: response.error };
    return {
      success: true,
      message: "Conductor actualizado correctamente",
      result: dataCopy,
    };
  } catch (error) {
    return { error };
  }
};

const getDriver = async ({ pageIndex, pageSize, schoolId }) => {
  try {
    const response = await fetch(
      `/api/drivers?pageIndex=${pageIndex}&pageSize=${pageSize}&schoolId=${schoolId}`,
    );
    return { success: true, data: response };
  } catch (error) {
    return { error };
  }
};

export { createDriverByForm, updateDriverByForm, getDriver };
