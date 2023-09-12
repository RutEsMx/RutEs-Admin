import { customInitApp } from "@/firebase/admin";
import { firestore } from "firebase-admin";
import { NextResponse } from "next/server";
// Init the Firebase SDK every time the server is called
customInitApp();

export async function GET(request, { params }) {
  const { id } = params;
  const response = await firestore().collection("routes").doc(id).get();
  const routeData = response.data();

  const [
    responseAuxiliar,
    responseUnits,
    responseDriver,
    responseStopsStudents,
  ] = await Promise.all([
    firestore()
      .collection("profile")
      .where("route", "==", id)
      .where("roles", "array-contains-any", ["auxiliar"])
      .get(),
    firestore().collection("units").where("route", "==", id).get(),
    firestore().collection("drivers").where("route", "==", id).get(),
    firestore().collection("stops").where("route", "==", id).get(),
  ]);

  const auxiliars = responseAuxiliar.docs.map((doc) => doc.id);
  const units = responseUnits.docs.map((doc) => doc.id);
  const drivers = responseDriver.docs.map((doc) => doc.id);

  const students = [];
  //
  if (responseStopsStudents.docs.length > 0) {
    const stops = responseStopsStudents.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      return data;
    });

    const responseStudents = stops.map(async (stop) => {
      const getStudent = await firestore()
        .collection("students")
        .doc(stop.student)
        .get();
      const studentData = getStudent.data();
      studentData.id = getStudent.id;
      const student = students.find((student) => student.id === stop.student);
      if (student) {
        student.stops.push(stop);
      } else {
        students.push({
          ...studentData,
          stops: [stop],
        });
      }
    });
    await Promise.all(responseStudents);
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
