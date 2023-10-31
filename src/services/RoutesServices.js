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
    
    const toHomeStudents = students[key].toHome.map((student) => {
      return doc(db, "students", student.id);
    });
    travelsObject[key].toHome.students = [
      ...travelsObject[key].toHome.students,
      ...toHomeStudents,
    ];

    const toSchoolStudents = students[key].toSchool.map((student) => {
      return doc(db, "students", student.id);
    });
    travelsObject[key].toSchool.students = [
      ...travelsObject[key].toSchool.students,
      ...toSchoolStudents,
    ];
  })
  return createDocument("travels", travelsObject);
};
const updateTravels = async (id, students) => {
  Object.keys(students).map((key) => {
    let arrayToHome = []
    let arrayToSchool = []
    const refTravel = doc(db, "travels", id);
    students[key].toHome.map((student) => {
      const refStudent = doc(db, "students", student.id);
      arrayToHome.push(refStudent)
      
      
    })
    students[key].toSchool.map((student) => {
      const refStudent = doc(db, "students", student.id);
      arrayToSchool.push(refStudent)
    })

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
  })
};

const createStops = async (students, routeId) => {

  Object.keys(students).map((key) => {
    students[key].toHome.map((element) => {
      delete element.value;
      if (element?.stop?.coords?.toHome === undefined) return;
      const stopObject = {
        coords: element?.stop?.coords?.toHome,
        day: key,
        student: element.id,
        route: routeId,
      };
      createDocument("stops", stopObject);
    });
    students[key].toSchool.map((element) => {
      if (element?.stop?.coords?.toSchool === undefined) return;
      delete element.value;
      const stopObject = {
        coords: element?.stop?.coords?.toSchool,
        day: key,
        student: element.id,
        route: routeId,
      };
      createDocument("stops", stopObject);
    });
  });
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
  return { success: true, message: "Ruta creada correctamente" };
  const { students } = data;
  try {
    const responseTravels = await createTravels(students);
    await createStops(data?.students, responseTravels.id);

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
  try {
    const getOldRoute = await getDoc(doc(db, "routes", routeId));
    const oldRouteData = getOldRoute.data();
    const responseRoute = await updateDocument("routes", routeId, restData);
    const responseUpdateTravels = await updateTravels(routeId, students);
    // TODO: update stops
    // const responseStops = Promise.all(
    //   students.map((student) => updateDeleteStops(student, routeId)),
    // );
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
      // responseStops,
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
