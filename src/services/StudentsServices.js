import { setStudents, useStudentsStore } from "@/store/useStudentsStore";
import { setStructureDatatable } from "./TableServices";

const getStudents = async () => {
  const setLoading = useStudentsStore.getState().setLoading;

  try {
    setLoading(true); // activa loader

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/students`,
    );

    if (response?.redirected) {
      return { error: true, redirect: response.url };
    }

    const data = await response.json();
    const dataTable = setStructureDatatable(data);
    setStudents(dataTable); // guarda los datos procesados

    return true;
  } catch (error) {
    return { error: error?.message };
  } finally {
    setLoading(false); // desactiva loader
  }
};

const deleteStudents = async (ids) => {
  try {
    const response = await fetch(`/api/students`, {
      method: "DELETE",
      body: JSON.stringify(ids),
    });

    if (response?.redirected) {
      return { error: true, redirect: response.url };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error?.message };
  }
};

export { getStudents, deleteStudents };
