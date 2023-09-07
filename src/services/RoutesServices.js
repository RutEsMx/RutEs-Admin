import {
  createDocument,
  deleteDocument,
  updateDocument,
} from "@/firebase/crud";
import {
  doc,
  query,
  collection,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase/client";

const createTravels = async (students) => {
  const travelsObject = {};

  students?.map((student) => {
    const refStudent = doc(db, "students", student.id);
    student?.stops?.map((stop) => {
      if (stop?.day) {
        if (!travelsObject[stop.day]) {
          if (stop?.coords?.toSchool) {
            travelsObject[stop.day] = {
              ...travelsObject[stop.day],
              toSchool: {
                students: [refStudent],
              },
            };
          }
          if (stop?.coords?.toHome) {
            travelsObject[stop.day] = {
              ...travelsObject[stop.day],
              toHome: {
                students: [refStudent],
              },
            };
          }
        } else {
          if (stop?.coords?.toSchool) {
            travelsObject[stop.day]["toSchool"]?.students.push(refStudent);
          }
          if (stop?.coords?.toHome) {
            travelsObject[stop.day]["toHome"]?.students.push(refStudent);
          }
        }
      }
    });
  });
  const response = await createDocument("travels", travelsObject);
  return response;
};

const createStops = async (student, routeId) => {
  try {
    return student?.stops.map(async (stop) => {
      stop.route = routeId;
      stop.student = student.id;
      const stopRef = await createDocument("stops", stop);
      return stopRef;
    });
  } catch (error) {
    return { error };
  }
};

const createRoutesByForm = async (data) => {
  if (!data?.students?.length)
    return { error: { message: "No se puede crear una ruta sin paradas" } };
  try {
    const responseTravels = await createTravels(data?.students);
    data?.students.map(async (student) => {
      await createStops(student, responseTravels.id);
    });

    const dataRoute = {
      name: data.name,
      capacity: data.capacity,
      schoolId: data.schoolId,
      id: responseTravels.id,
      isDeleted: false,
    };

    const responseRoute = await createDocument("routes", dataRoute);
    const responseUpdateAuxiliar = await updateDocument(
      "profile",
      data.auxiliar,
      { route: responseRoute.id },
    );
    const responseUpdateDriver = await updateDocument("drivers", data.driver, {
      route: responseRoute.id,
    });
    const responseUpdateUnit = await updateDocument("units", data.unit, {
      route: responseRoute.id,
    });

    return Promise.all([
      responseRoute,
      responseUpdateAuxiliar,
      responseUpdateDriver,
      responseUpdateUnit,
    ])
      .then(() => {
        return { success: true, message: "Ruta creada correctamente" };
      })
      .catch((error) => {
        return { error };
      });
  } catch (error) {
    return { error };
  }
};

const updateRoutesByForm = async (data) => {
  console.log(
    "🚀 ~ file: RoutesServices.js:110 ~ updateRoutesByForm ~ data:",
    data,
  );
  // try {
  //   const response = await updateDocument("routes", dataCopy.id, dataCopy);
  //   if (response?.error) return { error: response.error };
  //   return {
  //     success: true,
  //     message: "Ruta actualizada correctamente",
  //     result: dataCopy,
  //   };
  // } catch (error) {
  //   return { error };
  // }
};

const removeRoutes = async (id) => {
  try {
    const qAuxiliar = query(
      collection(db, "profile"),
      where("route", "==", id),
    );
    const qDriver = query(collection(db, "drivers"), where("route", "==", id));
    const qUnit = query(collection(db, "units"), where("route", "==", id));
    const qStops = query(collection(db, "stops"), where("route", "==", id));

    const getAuxiliar = (await getDocs(qAuxiliar)).docs[0]?.ref;
    const getDriver = (await getDocs(qDriver)).docs[0]?.ref;
    const getUnit = (await getDocs(qUnit)).docs[0]?.ref;
    const getStops = (await getDocs(qStops)).docs.map((el) => el.ref);

    await Promise.all([
      getAuxiliar && updateDoc(getAuxiliar, { route: null }),
      getDriver && updateDoc(getDriver, { route: null }),
      getUnit && updateDoc(getUnit, { route: null }),
      getStops.length > 0 &&
        getStops.map(async (el) => {
          await deleteDoc(el);
        }),
      deleteDocument("travels", id),
      deleteDocument("routes", id),
    ]);

    return { success: true, message: "Ruta eliminada correctamente" };
  } catch (error) {
    return { error };
  }
};

export { createRoutesByForm, updateRoutesByForm, removeRoutes };
