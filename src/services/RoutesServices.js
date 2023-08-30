import { createDocument, updateDocument } from "@/firebase/crud";

const createStopsIntoStudents = async (student) => {
  const arrayStops = [];
  try {
    return student?.stops.map(async (stop) => {
      const stopRef = await createDocument("stops", stop);
      arrayStops.push(stopRef);
      const studentRef = await updateDocument("students", student.id, {
        stops: arrayStops,
      });

      return studentRef;
    });
  } catch (error) {
    return { error };
  }
};

const createRoutesByForm = async (data) => {
  const dataCopy = { ...data };
  console.log("🚀 ~ file: RoutesServices.js:22 ~ createRoutesByForm ~ dataCopy:", dataCopy)
  if (!dataCopy?.students?.length)
    return { error: { message: "No se puede crear una ruta sin paradas" } };
  try {
    // dataCopy?.students.map(async (student) => {
    //   await createStopsIntoStudents(student);
    //   return { success: true, message: "Ruta creada correctamente" };
    // });
    // update "drivers" collection with route = id of route created
    // update "auxiliars" collection with route = id of route created
    // update "units" collection with route = id of route created
    // create trips.
    // ** update "students" collection with route = id of route created
    const dataRoute = {
      name: dataCopy.name,
      capacity: dataCopy.capacity,
      schoolId: dataCopy.schoolId,
    }

    const responseRoute = await createDocument("routes", dataRoute);
    
    
  } catch (error) {
    return { error };
  }
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
