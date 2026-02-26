import { setParents, useParentsStore } from "@/store/useParentsStore";
import { setStructureDatatable } from "./TableServices";

const getParents = async () => {
  const setLoading = useParentsStore.getState().setLoading;
  try {
    setLoading(true); // activa loader

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/parents`,
    );

    if (response?.redirected) {
      return { error: true, redirect: response.url };
    }

    const data = await response.json();
    const dataTable = setStructureDatatable(data);
    setParents(dataTable); // guarda los datos procesados

    return true;
  } catch (error) {
    return { error: error?.message };
  } finally {
    setLoading(false); // desactiva loader
  }
};

const deleteParents = async (ids) => {
  try {
    const response = await fetch(`/api/parents`, {
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

export { getParents, deleteParents };
