import { createDocument, updateDocument } from "@/firebase/crud";
import {
  addUnits,
  setAllUnits,
  setUnits,
  updateUnits,
} from "@/store/useUnitsStore";
import { setStructureDatatable } from "./TableServices";

const createUnitsByForm = async (data) => {
  const dataCopy = { ...data };
  try {
    const response = await createDocument("units", dataCopy);
    addUnits({ ...dataCopy, id: response.id });
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
    updateUnits(dataCopy.id, dataCopy);
    return {
      success: true,
      message: "Unidad actualizado correctamente",
      result: dataCopy,
    };
  } catch (error) {
    return { error };
  }
};

const getUnits = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/units`,
    );
    if (response?.redirected) {
      return { error: true, redirect: response.url };
    }
    const data = await response.json();
    const dataTable = setStructureDatatable(data);
    return setUnits(dataTable);
  } catch (error) {
    return { error: error?.message };
  }
};

const getAllUnits = async ({ all = false, passengers, route = null }) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/units?all=${all}&passengers=${passengers}&route=${route}`,
    );
    if (response?.redirected) {
      return { error: true, redirect: response.url };
    }
    if (!response.ok) {
      if (response.status === 404) setAllUnits([]);
      return { error: true, message: response.statusText };
    }
    const data = await response.json();
    setAllUnits(data);
    return data;
  } catch (error) {
    return { error: error.message };
  }
};

const getUnit = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/units/${id}/`,
      { cache: "no-store" },
    );
    if (!response.ok) return { error: true };
    const data = await response.json();
    data.id = id;
    return data;
  } catch (error) {
    return { error };
  }
};



export { createUnitsByForm, getUnits, updateUnitsByForm, getUnit, getAllUnits };
