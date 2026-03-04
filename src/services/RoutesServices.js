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
  deleteField,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/firebase/client";
import { onSnapshot } from "firebase/firestore";
import { setRoutes } from "@/store/useRoutesStore";

const getRouteById = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_API}api/routes/${id}/`,
      {
        cache: "no-store",
      },
    );
    if (!response.ok) return { error: true };
    const data = await response.json();
    data.id = id;
    return data;
  } catch (error) {
    return { error };
  }
};

const createTravels = async (students) => {
  const travelsObject = {};

  Object.keys(students).map((key) => {
    // Inicializar si no existe

    if (!travelsObject[key]) {
      travelsObject[key] = {
        toHome: { students: [] },
        toSchool: { students: [] },
        workshop: { students: [] },
      };
    }

    const toHomeStudents =
      students[key]?.toHome?.map((student) => {
        return doc(db, "students", student.id);
      }) || [];
    travelsObject[key].toHome.students = [
      ...travelsObject[key].toHome.students,
      ...toHomeStudents,
    ];

    const toSchoolStudents =
      students[key]?.toSchool?.map((student) => {
        return doc(db, "students", student.id);
      }) || [];
    travelsObject[key].toSchool.students = [
      ...travelsObject[key].toSchool.students,
      ...toSchoolStudents,
    ];

    const workshopStudents =
      students[key]?.workshop?.map((student) => {
        return doc(db, "students", student.id);
      }) || [];

    travelsObject[key].workshop.students = [
      ...travelsObject[key].workshop.students,
      ...workshopStudents,
    ];
  });
  return createDocument("travels", travelsObject);
};
const updateTravels = async (id, students) => {
  Object.keys(students).map((key) => {
    let arrayToHome = [];
    let arrayToSchool = [];
    let arrayWorkshop = [];

    const refTravel = doc(db, "travels", id);
    students[key]?.toHome?.map((student) => {
      const refStudent = doc(db, "students", student.id);
      arrayToHome.push(refStudent);
    });
    students[key]?.toSchool?.map((student) => {
      const refStudent = doc(db, "students", student.id);
      arrayToSchool.push(refStudent);
    });
    students[key]?.workshop?.map((student) => {
      const refStudent = doc(db, "students", student.id);
      arrayWorkshop.push(refStudent);
    });

    updateDoc(refTravel, {
      [key]: {
        toHome: {
          students: arrayToHome,
        },
        toSchool: {
          students: arrayToSchool,
        },
        workshop: {
          students: arrayWorkshop,
        },
      },
    });
  });
};

const createStops = async (students, routeId) => {
  Object.keys(students).map((key) => {
    students[key]?.toHome?.map((element) => {
      if (element?.stop?.coords === undefined || element?.stop?.coords === null)
        return;
      delete element.value;
      const stopObject = {
        coords: element?.stop?.coords,
        day: key,
        student: element.id,
        route: routeId,
        type: "toHome",
      };
      createDocument("stops", stopObject);
    });
    students[key]?.toSchool?.map((element) => {
      if (element?.stop?.coords === undefined || element?.stop?.coords === null)
        return;
      delete element.value;
      const stopObject = {
        coords: element?.stop?.coords,
        day: key,
        student: element.id,
        route: routeId,
        type: "toSchool",
      };
      createDocument("stops", stopObject);
    });

    students[key]?.workshop?.map((element) => {
      if (element?.stop?.coords === undefined || element?.stop?.coords === null)
        return;
      delete element.value;
      const stopObject = {
        coords: element?.stop?.coords,
        day: key,
        student: element.id,
        route: routeId,
        type: "workshop",
      };
      createDocument("stops", stopObject);
    });
  });
};

const deleteStops = async (studentsToRemove) => {
  if (studentsToRemove === undefined) return;
  try {
    Object.keys(studentsToRemove).forEach((key) => {
      studentsToRemove[key]?.toHome?.forEach(async (element) => {
        if (element?.stop?.id === undefined) return;
        const qStop = doc(db, "stops", element?.stop?.id);
        const route = element?.stop?.route;
        const refTravel = doc(db, "travels", route);
        await updateDoc(refTravel, {
          [key]: {
            toHome: {
              students: arrayRemove(element.id),
            },
          },
        });
        await deleteDoc(qStop);
      });
      studentsToRemove[key]?.toSchool?.forEach(async (element) => {
        if (element?.stop?.id === undefined) return;
        const qStop = doc(db, "stops", element?.stop?.id);
        const route = element?.stop?.route;
        const refTravel = doc(db, "travels", route);
        await updateDoc(refTravel, {
          [key]: {
            toSchool: {
              students: arrayRemove(element.id),
            },
          },
        });
        await deleteDoc(qStop);
      });
      studentsToRemove[key]?.workshop?.forEach(async (element) => {
        if (element?.stop?.id === undefined) return;
        const qStop = doc(db, "stops", element?.stop?.id);
        const route = element?.stop?.route;
        const refTravel = doc(db, "travels", route);
        await updateDoc(refTravel, {
          [key]: {
            workshop: {
              students: arrayRemove(element.id),
            },
          },
        });
        await deleteDoc(qStop);
      });
    });
  } catch (error) {
    return { error };
  }
};

const updateStops = async (students, routeId) => {
  try {
    const updatePromises = [];

    for (const key of Object.keys(students)) {
      const processStudentStops = async (type) => {
        for (const element of students[key][type]) {
          if (element?.stop?.id) {
            const qStop = doc(db, "stops", element?.stop.id);
            updatePromises.push(
              updateDoc(qStop, {
                coords: element?.stop?.coords,
              }),
            );
          } else if (element?.stop?.coords) {
            const stopData = {
              student: element.id,
              route: routeId,
              type: type,
              day: key,
              coords: element?.stop?.coords,
            };
            updatePromises.push(createDocument("stops", stopData));
          }
        }
      };

      if (students[key]?.toHome) {
        await processStudentStops("toHome");
      }
      if (students[key]?.toSchool) {
        await processStudentStops("toSchool");
      }
      if (students[key]?.workshop) {
        await processStudentStops("workshop");
      }
    }
    await Promise.all(updatePromises);
  } catch (error) {
    return { error };
  }
};

// Create a new route
const createRoutesByForm = async (data) => {
  const { students } = data;
  try {
    // Crear los viajes
    const responseTravels = await createTravels(students);
    // Crear paradas y se le asigna el id de la ruta
    await createStops(students, responseTravels.id);

    // Crear el objeto de la ruta
    // Se asigna el id de los viajes a la ruta
    const dataRoute = {
      name: data.name,
      capacity: data.capacity,
      schoolId: data.schoolId,
      id: responseTravels.id,
      isDeleted: false,
      auxiliar: data.auxiliar,
      driver: data.driver,
      unit: data.unit,
      workshop: data.workshop,
    };

    // Crear la ruta
    const responseRoute = await createDocument("routes", dataRoute);

    // Actualizar los perfiles de los auxiliares, conductores y unidades
    const routeToUpdate = data.workshop ? "routeWorkshop" : "route";

    // Actualizar el perfil del auxiliar
    const responseUpdateAuxiliar = await updateDocument(
      "profile",
      data.auxiliar,
      {
        [routeToUpdate]: data.workshop
          ? arrayUnion(responseRoute.id)
          : responseRoute.id,
      },
    );

    // Actualizar el perfil del conductor
    const responseUpdateDriver = await updateDocument("drivers", data.driver, {
      [routeToUpdate]: data.workshop
        ? arrayUnion(responseRoute.id)
        : responseRoute.id,
    });

    // Actualizar el perfil de la unidad
    const responseUpdateUnit = await updateDocument("units", data.unit, {
      [routeToUpdate]: data.workshop
        ? arrayUnion(responseRoute.id)
        : responseRoute.id,
    });

    // Retornar un objeto con el mensaje de éxito
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

const updateEntity = async (
  entityType,
  id,
  routeId,
  oldId = null,
  workshop,
) => {
  const routeToUpdate = workshop ? "routeWorkshop" : "route";
  if (id !== oldId) {
    await updateDocument(entityType, id, {
      [routeToUpdate]: workshop ? arrayUnion(routeId) : routeId,
    });
    if (oldId) {
      await updateDocument(entityType, oldId, {
        [routeToUpdate]: workshop ? arrayRemove(routeId) : null,
      });
    }
  }
};

const updateRoutesByForm = async (data) => {
  const { routeId, students, studentsToRemove, ...restData } = data;
  try {
    const getOldRoute = await getDoc(doc(db, "routes", routeId));
    const oldRouteData = getOldRoute.data();
    const responseRoute = await updateDocument("routes", routeId, restData);
    const responseDeleteStops = await deleteStops(studentsToRemove);
    const responseUpdateTravels = await updateTravels(routeId, students);
    const responseUpdateStops = await updateStops(students, routeId);

    const updateAuxiliar = updateEntity(
      "profile",
      restData?.auxiliar,
      routeId,
      oldRouteData?.auxiliar,
      restData?.workshop,
    );
    const updateDriver = updateEntity(
      "drivers",
      restData?.driver,
      routeId,
      oldRouteData?.driver,
      restData?.workshop,
    );
    const updateUnit = updateEntity(
      "units",
      restData?.unit,
      routeId,
      oldRouteData?.unit,
      restData?.workshop,
    );

    await Promise.all([
      responseRoute,
      responseUpdateTravels,
      responseDeleteStops,
      updateAuxiliar,
      updateDriver,
      updateUnit,
      responseUpdateStops,
    ]);
    return { success: true, message: "Ruta actualizada correctamente" };
  } catch (error) {
    return { error };
  }
};

const removeRoutes = async (id) => {
  try {
    const routeDoc = await getDoc(doc(db, "routes", id));
    if (!routeDoc.exists()) return { error: "Ruta no encontrada" };
    const routeData = routeDoc.data();
    const routeToQuery = routeData?.workshop ? "routeWorkshop" : "route";

    const qAuxiliar = query(
      collection(db, "profile"),
      where(routeToQuery, "array-contains", id),
    );
    // Para retrocompatibilidad por si aún no actualizaron a arrays o todavía hay rutas simples
    const qAuxiliarSimple = query(
      collection(db, "profile"),
      where(routeToQuery, "==", id),
    );

    const qDriver = query(
      collection(db, "drivers"),
      where(routeToQuery, "array-contains", id),
    );
    const qDriverSimple = query(
      collection(db, "drivers"),
      where(routeToQuery, "==", id),
    );

    const qUnit = query(
      collection(db, "units"),
      where(routeToQuery, "array-contains", id),
    );
    const qUnitSimple = query(
      collection(db, "units"),
      where(routeToQuery, "==", id),
    );

    const qStops = query(collection(db, "stops"), where("route", "==", id));

    const [
      auxiliars,
      auxiliarsSimple,
      drivers,
      driversSimple,
      units,
      unitsSimple,
      stops,
    ] = await Promise.all([
      getDocs(qAuxiliar),
      getDocs(qAuxiliarSimple),
      getDocs(qDriver),
      getDocs(qDriverSimple),
      getDocs(qUnit),
      getDocs(qUnitSimple),
      getDocs(qStops),
    ]);

    // Unir queries de array y simples.
    const allAuxiliars = [...auxiliars.docs, ...auxiliarsSimple.docs].filter(
      (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i,
    );
    const allDrivers = [...drivers.docs, ...driversSimple.docs].filter(
      (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i,
    );
    const allUnits = [...units.docs, ...unitsSimple.docs].filter(
      (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i,
    );

    const getStopsRef = stops.docs.map((el) => el.ref);

    const promises = [];
    allAuxiliars.forEach((doc) =>
      promises.push(
        updateDoc(doc.ref, {
          [routeToQuery]: routeData?.workshop ? arrayRemove(id) : null,
        }),
      ),
    );
    allDrivers.forEach((doc) =>
      promises.push(
        updateDoc(doc.ref, {
          [routeToQuery]: routeData?.workshop ? arrayRemove(id) : null,
        }),
      ),
    );
    allUnits.forEach((doc) =>
      promises.push(
        updateDoc(doc.ref, {
          [routeToQuery]: routeData?.workshop ? arrayRemove(id) : null,
        }),
      ),
    );

    if (getStopsRef.length > 0) {
      getStopsRef.forEach((el) => {
        promises.push(deleteDoc(el));
      });
    }

    // Cleanup travelsWithFriend entries referencing this route
    const travelsDoc = await getDoc(doc(db, "travels", id));
    if (travelsDoc.exists()) {
      const travelsData = travelsDoc.data();
      const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
      for (const day of days) {
        const types = ["toHome", "workshop"];
        for (const type of types) {
          const friendStudents =
            travelsData?.[day]?.[type]?.travelWithFriend || [];
          for (const studentId of friendStudents) {
            const friendRef = doc(db, "travelsWithFriend", studentId);
            promises.push(updateDoc(friendRef, { [day]: deleteField() }));
            // Also reset the student's statusTravel if it's "travelWithFriend"
            const studentRef = doc(db, "students", studentId);
            const studentDoc = await getDoc(studentRef);
            if (
              studentDoc.exists() &&
              studentDoc.data()?.statusTravel === "travelWithFriend"
            ) {
              promises.push(updateDoc(studentRef, { statusTravel: "" }));
            }
          }
        }
      }
    }

    promises.push(deleteDocument("travels", id));
    promises.push(deleteDocument("routes", id));

    await Promise.all(promises);

    return { success: true, message: "Ruta eliminada correctamente" };
  } catch (error) {
    return { error };
  }
};

const subscribeRoutes = (schoolId) => {
  if (!schoolId) return;

  const q = query(
    collection(db, "routes"),
    where("schoolId", "==", schoolId),
    where("isDeleted", "==", false),
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const routes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRoutes(routes);
    },
    (error) => {
      console.error("Error subscribing to routes:", error);
    },
  );

  return unsubscribe;
};

export {
  createRoutesByForm,
  updateRoutesByForm,
  removeRoutes,
  getRouteById,
  subscribeRoutes,
};
