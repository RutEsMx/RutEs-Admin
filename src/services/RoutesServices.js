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

  Object.keys(students).map((key) => {
    // Inicializar si no existe

    if (!travelsObject[key]) {
      travelsObject[key] = {
        toHome: { students: [] },
        toSchool: { students: [] },
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
  });
  return createDocument("travels", travelsObject);
};
const updateTravels = async (id, students) => {
  Object.keys(students).map((key) => {
    let arrayToHome = [];
    let arrayToSchool = [];
    const refTravel = doc(db, "travels", id);
    students[key]?.toHome?.map((student) => {
      const refStudent = doc(db, "students", student.id);
      arrayToHome.push(refStudent);
    });
    students[key]?.toSchool?.map((student) => {
      const refStudent = doc(db, "students", student.id);
      arrayToSchool.push(refStudent);
    });
    updateDoc(refTravel, {
      [key]: {
        toHome: {
          students: arrayToHome,
        },
        toSchool: {
          students: arrayToSchool,
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
  });
};

const deleteStops = async (studentsToRemove) => {
  if (studentsToRemove === undefined) return;

  try {
    Object.keys(studentsToRemove).map((key) => {
      studentsToRemove[key]?.toHome &&
        studentsToRemove[key].toHome.map((element) => {
          if (element?.stop?.id === undefined) return;
          const qStop = doc(db, "stops", element?.stop?.id);
          deleteDoc(qStop);
        });
      studentsToRemove[key].toSchool &&
        studentsToRemove[key]?.toSchool.map((element) => {
          if (element?.stop?.id === undefined) return;
          const qStop = doc(db, "stops", element?.stop?.id);
          deleteDoc(qStop);
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
          console.log(
            "🚀 ~ file: RoutesServices.js:139 ~ processStudentStops ~ element:",
            element,
          );
          if (element?.stop?.id) {
            const qStop = doc(db, "stops", element?.stop.id);
            updatePromises.push(
              updateDoc(qStop, {
                coords: element?.stop?.coords,
              }),
            );
          } else if (element?.stop?.coords) {
            console.log(
              "🚀 ~ file: RoutesServices.js:148 ~ processStudentStops ~ element:",
              element,
            );
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
    const responseTravels = await createTravels(students);
    await createStops(students, responseTravels.id);
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
  const { routeId, students, studentsToRemove, ...restData } = data;
  try {
    const getOldRoute = await getDoc(doc(db, "routes", routeId));
    const oldRouteData = getOldRoute.data();
    const responseRoute = await updateDocument("routes", routeId, restData);
    const responseUpdateTravels = await updateTravels(routeId, students);
    const responseDeleteStops = await deleteStops(studentsToRemove);
    const responseUpdateStops = await updateStops(students, routeId);

    const updateAuxiliar = updateEntity(
      "profile",
      restData?.auxiliar,
      routeId,
      oldRouteData?.auxiliar,
    );
    const updateDriver = updateEntity(
      "drivers",
      restData?.driver,
      routeId,
      oldRouteData?.driver,
    );
    const updateUnit = updateEntity(
      "units",
      restData?.unit,
      routeId,
      oldRouteData?.unit,
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
    console.log(
      "🚀 ~ file: RoutesServices.js:270 ~ updateRoutesByForm ~ error:",
      error,
    );
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
