import { createDocument, updateDocument } from "@/firebase/crud";
import { doc } from "firebase/firestore";
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
  if (!data?.students?.length)
    return { error: { message: "No se puede crear una ruta sin paradas" } };
  try {
    const responseTravels = await createTravels(data?.students);
    data?.students.map(async (student) => {
      await createStopsIntoStudents(student);
    });

    const dataRoute = {
      name: data.name,
      capacity: data.capacity,
      schoolId: data.schoolId,
      id: responseTravels.id,
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

export { createRoutesByForm, updateRoutesByForm };
