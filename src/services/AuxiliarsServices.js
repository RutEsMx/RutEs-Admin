import { setAuxiliars, setAuxiliarsRoutes } from "@/store/useAuxiliarsStore";
import { setStructureDatatable } from "./TableServices";

const getAuxiliars = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/auxiliars`,
    );

    if (response?.redirected) {
      return { error: true, redirect: response.url };
    }
    const data = await response.json();
    const dataTable = setStructureDatatable(data);
    return setAuxiliars(dataTable);
  } catch (error) {
    return { error: error.message };
  }
};
const getAuxiliarsRoutes = async (isEdit = false) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/auxiliars`,
    );

    if (response?.redirected) {
      return { error: true, redirect: response.url };
    }
    const data = await response.json();
    const dataFilter = data.filter((auxiliar) => auxiliar.route === null);
    
    if (isEdit) {
      return setAuxiliarsRoutes(data);
    } else {
      return setAuxiliarsRoutes(dataFilter);
    }
  } catch (error) {
    return { error: error.message };
  }
};
export { getAuxiliars, getAuxiliarsRoutes };
