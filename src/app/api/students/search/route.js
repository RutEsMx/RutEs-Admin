import { NextResponse } from "next/server";
import { customInitApp } from "@/firebase/admin";
import { firestore } from "firebase-admin";
import { cookies } from "next/headers";
import { getUSer } from "@/utils/functionsServer";
// Init the Firebase SDK every time the server is called
customInitApp();

export async function GET(request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const sessionid = cookies().get("sessionid");
  const profile = await getUSer(sessionid?.value);

  if (profile?.error) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  const value = searchParams.get("value").split(" ");
  const days = searchParams.get("days").split(",");

  try {
    const studentsSnapshot = await firestore()
      .collection("students")
      .where("fullName", "array-contains-any", value)
      .where("schoolId", "==", profile.schoolId)
      .get();

    const filteredStudents = [];

    for (const doc of studentsSnapshot.docs) {
      const stopsSnapshot = await firestore()
        .collection("stops")
        .where("student", "==", doc.id)
        .get();

      // Obtener los "Stops" como un array de objetos
      const stops = stopsSnapshot.docs.map((stopDoc) => stopDoc.data());
      // Verificar si el estudiante tiene un "Stop" en los días especificados
      const hasStopOnSpecifiedDays =
        days.includes("all") || stops.some((stop) => days.includes(stop.day));

      // Si el estudiante no tiene un "Stop" en los días especificados, añadirlo al array de estudiantes filtrados
      if (!hasStopOnSpecifiedDays) {
        filteredStudents.push({
          id: doc.id,
          ...doc.data(),
        });
      }
    }

    return NextResponse.json(filteredStudents, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
