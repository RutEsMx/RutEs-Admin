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
      (type === "workshop" && route.workshop) ||
      (type !== "workshop" && !route.workshop)
    ) {
      const responseTravel = await firestore()
        .collection("travels")
        .doc(route.id)
        .get();

      const studentsResponse = await Promise.all(
        responseTravel.data()[day][type].students.map(async (student) => {
          const studentData = await student.get();

          if (studentData.data().status === "inactive") return null;
          return {
            [studentData.id]: {
              statusTravel: studentData.data().statusTravel,
            },
          };
        }),
      );
      travels[route.id] = {
        [type]: {
          students: studentsResponse.filter((student) => student !== null),
        },
      };
    }
  }
  return travels;
};
