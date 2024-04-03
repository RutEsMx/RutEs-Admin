import { NextResponse } from "next/server";
import { customInitApp } from "@/firebase/admin";
import { firestore } from "firebase-admin";

customInitApp();

// Function to get the route of a student
async function getStudentRoute(student, day) {
  const stopsRef = await firestore()
    .collection("stops")
    .where("student", "==", student)
    .where("day", "==", day)
    .get();

  let route = null;
  stopsRef.forEach((doc) => {
    route = doc.data().route;
  });

  if (!route) {
    throw new Error("Ruta no encontrada");
  }

  return route;
}

// Function to get the route data
async function getRouteData(route) {
  const routeRef = await firestore().collection("routes").doc(route).get();
  return routeRef.data();
}

// Function to get the travel data
async function getTravelData(route, day) {
  const travelRef = await firestore().collection("travels").doc(route).get();
  return travelRef.data()[day]?.toHome;
}

// Function to get the unit data
async function getUnitData(unit) {
  const unitRef = await firestore().collection("units").doc(unit).get();
  return unitRef.data();
}

// Function to get the student data
async function getStudentData(studentRequest) {
  const studentRequestRef = await firestore()
    .collection("students")
    .doc(studentRequest)
    .get();
  return studentRequestRef.data();
}

// Function to create a travel with a friend request
async function createTravelWithFriendRequest(
  route,
  day,
  student,
  studentRequest,
  date,
) {
  return await firestore()
    .collection("travelsWithFriend")
    .doc(studentRequest)
    .update({
      [day]: {
        route,
        day,
        status: "pending",
        student,
        date,
      },
    });
}

export async function POST(request) {
  const res = await request.json();
  const { student, date, day, studentRequest, userId } = res;

  try {
    const route = await getStudentRoute(student, day);
    const routeData = await getRouteData(route);
    const travel = await getTravelData(route, day);
    const travelRef = firestore().collection("travels").doc(route);
    const unitData = await getUnitData(routeData?.unit);
    const studentRequestData = await getStudentData(studentRequest);

    const countStudents = Object.keys(travel?.students || {}).length;

    if (countStudents >= unitData?.passengers) {
      return NextResponse.json(
        { error: "No hay espacio en la unidad" },
        { status: 400 },
      );
    }

    if (travel) {
      const fullName = `${studentRequestData?.name || ""} ${
        studentRequestData?.lastName || ""
      } ${studentRequestData?.secondLastName || ""}`;
      travelRef.update({
        [`${day}.toHome.travelWithFriend`]:
          firestore.FieldValue.arrayUnion(studentRequest),
      });
      await createTravelWithFriendRequest(
        route,
        day,
        student,
        studentRequest,
        date,
      );
      fetch(`${process.env.NEXT_PUBLIC_URL_API}api/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Solicitud de viaje con un amigo",
          body: `El estudiante ${fullName} ha solicitado viaje con un amigo`,
          data: {
            routeId: route,
            schoolId: studentRequestData.schoolId,
            studentRequest: studentRequest,
            userId,
            student: student,
          },
          category: "travelWithFriend",
        }),
      });
    }

    return NextResponse.json({ route, travel });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
