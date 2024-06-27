import { customInitApp } from "@/firebase/admin";
import { firestore } from "firebase-admin";
import { NextResponse } from "next/server";
// Init the Firebase SDK every time the server is called
customInitApp();

/**
 * Retrieves the travel routes based on the provided parameters.
 *
 * @param {Object} request - The HTTP request object.
 * @param {Object} params - The route parameters object.
 * @param {string} params.id - The ID of the auxiliar.
 * @param {Object} request.nextUrl - The URL object.
 * @param {Object} request.nextUrl.searchParams - The search parameters object.
 * @param {string} request.nextUrl.searchParams.day - The specific day of travel (e.g., 'monday').
 * @param {string} request.nextUrl.searchParams.type - The type of travel (e.g., 'workshop').
 * @returns {Promise<Object>} - A promise that resolves to the JSON response containing the travel routes.
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const searchParams = request.nextUrl.searchParams;
    const day = searchParams.get("day");
    const type = searchParams.get("type");
    const response = await firestore()
      .collection("routes")
      .where("auxiliar", "==", id)
      .where("isDeleted", "!=", true)
      .get();
    const routes = response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const travelsToday = await getTravels(routes, day, type);
    return NextResponse.json(travelsToday);
  } catch (error) {
    console.log("Error:", error);
  }
}

/**
 * Retrieves travel data based on the provided routes, day, and type.
 * @param {Array} routes - The array of routes.
 * @param {string} day - The day of the travel.
 * @param {string} type - The type of the travel.
 * @returns {Object} - The travel data.
 */
const getTravels = async (routes, day, type) => {
  const travels = {};

  for (const route of routes) {
    if (
      (type === "workshop" && route?.workshop) ||
      (type !== "workshop" && !route?.workshop)
    ) {
      const responseTravel = await firestore()
        .collection("travels")
        .doc(route.id)
        .get();
      const travelData = responseTravel.data();
      const studentsResponse = await Promise.all(
        travelData[day][type].students.map(async (student) => {
          const studentData = await student.get();

          if (studentData.data().status === "inactive") return null;
          let statusTravel = studentData.data().statusTravel;
          if (type !== "workshop" && type !== "toSchool") {
            statusTravel =
              !studentData.data().statusTravel ||
              studentData.data().statusTravel === "cancelToSchool"
                ? await validateStudentTravelWorkshop(student, day)
                : (studentData.data().statusTravel !== "workshop" &&
                    studentData.data().statusTravel) ||
                  "";
          }
          return {
            [studentData.id]: {
              statusTravel: statusTravel,
            },
          };
        }),
      );
      let travelWithFriend = [];
      if (type === "toHome" || type === "workshop") {
        console.log("🚀 ~ getTravels ~ travelData[day]:", travelData[day]);

        if (travelData[day]?.[type])
          travelWithFriend = await getStudentTravelWithFriend(
            travelData[day][type],
            day,
          );

        if (travelWithFriend.length > 0) {
          const studentsResponseCopy = [...studentsResponse];
          // Agregar a la lista de estudiantes(studentsReponse) el amigo que viaja con el estudiante
          for (const student of studentsResponseCopy) {
            const studentId = Object.keys(student)[0];
            const travelStudent = travelWithFriend.find(
              (item) => item.friendId === studentId,
            );
            if (travelStudent) {
              const friendIndex = travelWithFriend.findIndex(
                (item) => item.friendId === travelStudent?.friendId,
              );
              // Agregarlo en el orden despues del friendIndex
              studentsResponse.splice(friendIndex + 1, 0, {
                [travelStudent?.studentId]: {
                  statusTravel: "accepted",
                  studentFriend: travelStudent?.friendId,
                },
              });
            }
          }
        }
      }
      // Asegúrate de que travels[route.id] esté inicializado
      if (!travels[route.id]) {
        travels[route.id] = {};
      }

      // Asegúrate de que travels[route.id][type] esté inicializado
      if (!travels[route.id][type]) {
        travels[route.id][type] = {};
      }

      // Ahora es seguro asignar la propiedad students
      travels[route.id][type].students = studentsResponse.filter(
        (student) => student !== null,
      );
    }
  }
  return travels;
};

// Validar si el estudiante viaja en algun taller el mismo día
const validateStudentTravelWorkshop = async (student, day) => {
  try {
    const response = await firestore()
      .collection("travels")
      .where(day + ".workshop.students", "array-contains", student)
      .get();
    return response.docs.length > 0 ? "workshop" : "";
  } catch (error) {
    return "";
  }
};

// Obtener el estudiante que viaja con un amigo el mismo día
// Retornar un array con objetos que contiene el id del estudiante y el id del amigo
// Si el status es "accepted"
const getStudentTravelWithFriend = async (travel, day) => {
  const studentsWithFriend = [];
  const travelWithFriend = travel?.travelWithFriend || [];
  for (const student of travelWithFriend) {
    const travelWithFriendData = await firestore()
      .collection("travelsWithFriend")
      .doc(student)
      .get();
    const friend = travelWithFriendData?.data()?.[day]?.student;
    const status = travelWithFriendData?.data()?.[day]?.status;
    if (status === "accepted") {
      studentsWithFriend.push({
        studentId: student,
        friendId: friend,
      });
    }
  }
  return studentsWithFriend;
};
