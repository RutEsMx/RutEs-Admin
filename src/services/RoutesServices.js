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
  getDoc,
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
const updateTravels = async (id, students) => {
  students?.map((student) => {
    const refStudent = doc(db, "students", student.id);
    student?.stops?.map(async (stop) => {
      if (stop?.isDelete) {
        const qTravel = doc(db, "travels", id);
        const getTravel = await getDoc(qTravel);
        const travelData = getTravel.data();
        const travelToRemove = {
          toHome: {},
          toSchool: {},
        };
        if (stop?.coords?.toSchool) {
          const filterArrayToSchool = travelData[stop.day]["toSchool"][
            "students"
          ].filter((el) => el === refStudent);
          travelToRemove["toSchool"]["students"] = filterArrayToSchool;
        }
        if (stop?.coords?.toHome) {
          const filterArrayToHome = travelData[stop.day]["toHome"][
            "students"
          ].filter((el) => el === refStudent);
          travelToRemove["toHome"]["students"] = filterArrayToHome;
        }
        await updateDocument("travels", id, {
          [stop.day]: {
            ...travelToRemove,
          },
        });
        return;
      }
    });
  });
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

const updateDeleteStops = async (student) => {
  try {
    return student?.stops.map(async (stop) => {
      if (stop?.isDelete) {
        const qStop = doc(db, "stops", stop.id);
        return deleteDoc(qStop);
      } else {
        if (stop.id) {
          const qStop = doc(db, "stops", stop.id);
          return updateDoc(qStop, {
            coords: {
              toSchool: stop.coords.toSchool,
              toHome: stop.coords.toHome,
            },
          });
        }
        stop.student = student.id;
        return createDocument("stops", stop);
      }
    });
  } catch (error) {
    return { error };
  }
};

// Create a new route
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
      auxiliar: data.auxiliar,
      driver: data.driver,
      unit: data.unit,
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

const updateEntity = async (entityType, id, routeId, oldId = null) => {
  if (id !== oldId) {
    await updateDocument(entityType, id, { route: routeId });
    if (oldId) {
      await updateDocument(entityType, oldId, { route: null });
    }
  }
};

const updateRoutesByForm = async (data) => {
  const { routeId, students, ...restData } = data;
  if (!data?.students?.length)
    return { error: { message: "No se puede crear una ruta sin paradas" } };

  try {
    const getOldRoute = await getDoc(doc(db, "routes", routeId));
    const oldRoute = getOldRoute.data();
    const responseRoute = await updateDocument("routes", routeId, restData);
    const responseUpdateTravels = await updateTravels(routeId, students);
    const responseStops = Promise.all(
      students.map((student) => updateDeleteStops(student, routeId)),
    );
    const updateAuxiliar = updateEntity(
      "profile",
      restData?.auxiliar,
      routeId,
      oldRoute?.auxiliar,
    );
    const updateDriver = updateEntity(
      "drivers",
      restData?.driver,
      routeId,
      oldRoute?.driver,
    );
    const updateUnit = updateEntity(
      "units",
      restData?.unit,
      routeId,
      oldRoute?.unit,
    );
    await Promise.all([
      responseRoute,
      responseUpdateTravels,
      responseStops,
      updateAuxiliar,
      updateDriver,
      updateUnit,
    ]);
    return { success: true, message: "Ruta actualizada correctamente" };
  } catch (error) {
    return { error };
  }
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
