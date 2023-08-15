import { db } from "@/firebase/client";
import { createDocument, updateDocument } from "@/firebase/crud";
import { doc } from "firebase/firestore";


const createStopsIntoStudents = async (stops) => {
  // create stops in firestore and add reference to each student
  
}

const createRoutesByForm = async (data) => {
  const dataCopy = { ...data };
  const responseStops = await createStopsIntoStudents(dataCopy.stops);
  // try {
  //   const driverRef = doc(db, "drivers", dataCopy.driver);
  //   const auxiliarRef = doc(db, "profile", dataCopy.auxiliar);
  //   const unitRef = doc(db, "units", dataCopy.unit);
  //   dataCopy.driver = driverRef;
  //   dataCopy.auxiliar = auxiliarRef;
  //   dataCopy.unit = unitRef;
  //   const response = await createDocument("routes", dataCopy);
  //   if (response?.error) return { error: response.error };
  //   return { success: true, message: "Ruta creada correctamente" };
  // } catch (error) {
  //   return { error };
  // }
};

const updateRoutesByForm = async (data) => {
  const dataCopy = { ...data };
  try {
    const response = await updateDocument("routes", dataCopy.id, dataCopy);
    if (response?.error) return { error: response.error };
    return {
      success: true,
      message: "Ruta actualizada correctamente",
      result: dataCopy,
    };
  } catch (error) {
    return { error };
  }
};

const getRoutes = async ({ pageIndex, pageSize, schoolId }) => {
  try {
    const response = await fetch(
      `/api/users?pageIndex=${pageIndex}&pageSize=${pageSize}&schoolId=${schoolId}`,
    );
    return { success: true, data: response };
  } catch (error) {
    return { error };
  }
};

export { createRoutesByForm, getRoutes, updateRoutesByForm };
