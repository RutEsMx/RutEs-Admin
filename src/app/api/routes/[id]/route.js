import { customInitApp } from "@/firebase/admin";
import { el } from "@faker-js/faker";
import { firestore } from "firebase-admin";
import { NextResponse } from "next/server";
// Init the Firebase SDK every time the server is called
customInitApp();

export async function GET(request, { params }) {
  const { id } = params;
  const response = await firestore().collection("routes").doc(id).get();
  const routeData = response.data();

  const responseTravels = await firestore().collection("travels").doc(id).get();

  const [responseAuxiliar, responseUnits, responseDriver] = await Promise.all([
    firestore()
      .collection("profile")
      .where("route", "==", id)
      .where("roles", "array-contains-any", ["auxiliar"])
      .get(),
    firestore().collection("units").where("route", "==", id).get(),
    firestore().collection("drivers").where("route", "==", id).get(),
  ]);
  const auxiliars = responseAuxiliar.docs.map((doc) => doc.id);
  const units = responseUnits.docs.map((doc) => doc.id);
  const drivers = responseDriver.docs.map((doc) => doc.id);

  const students = [];
  const studentIds = new Set(); // to efficiently check for existing students

  const travelData = responseTravels.data();

  if (travelData) {
    for (const day of Object.keys(travelData)) {
      const toHome = travelData[day].toHome;

      // If toSchool will be used in future
      // const toSchool = travelData[day].toSchool;

      for (const key of Object.keys(toHome)) {
        const studentsArray = toHome[key];

        const studentsPromises = studentsArray.map(async (studentElement) => {
          const studentData = (await studentElement.get()).data();
          return {
            id: studentElement.id,
            name: studentData.name,
            lastName: studentData.lastName,
            secondName: studentData.secondLastName,
            stops: studentData.stops,
          };
        });

        const resolvedStudents = await Promise.all(studentsPromises);

        for (const student of resolvedStudents) {
          if (!studentIds.has(student.id)) {
            studentIds.add(student.id);

            let stopsFormat = []; // initialize here, where it is needed
            for (const stop of student.stops) {
              const stopElement = (await stop.get()).data();
              stopsFormat.push(stopElement);
            }

            student.stops = stopsFormat;
            students.push(student);
          }
        }
      }
    }
  }

  const data = {
    ...routeData,
    id: response.id,
    auxiliar: auxiliars[0] || null,
    unit: units[0] || null,
    driver: drivers[0] || null,
    students: students,
  };
  return NextResponse.json(data);
}
