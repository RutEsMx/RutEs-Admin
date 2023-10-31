import { setParents } from "@/store/useParentsStore";
import { setStructureDatatable } from "./TableServices";

const getParents = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/parents`,
    );
    if (response?.redirected) {
      return { error: true, redirect: response.url };
    }
    const data = await response.json();
    const dataTable = setStructureDatatable(data);
    return setParents(dataTable);
  } catch (error) {
    return { error: error?.message };
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
