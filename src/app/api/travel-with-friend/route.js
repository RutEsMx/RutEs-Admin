import { NextResponse } from "next/server";
import { customInitApp } from "@/firebase/admin";
import { firestore } from "firebase-admin";
import { TRAVEL_WITH_FRIEND_STATUS } from "@/utils/options";

customInitApp();

const getTokensFromParents = async (id) => {
  const studentRef = await firestore().collection("students").doc(id).get();
  const parents = studentRef.data().parents;
  const tutors = studentRef.data().tutors;
  const tokens = [];

  const parentPromises = parents.map(async (parent) => {
    if (!parent?.id) return;
    const parentRef = await firestore()
      .collection("profile")
      .doc(parent?.id)
      .get();
    const parentTokens = parentRef.data().tokens;
    if (parentTokens?.length > 0)
      tokens.push(parentTokens[parentTokens?.length - 1]);
  });

  const tutorPromises = tutors.map(async (tutor) => {
    if (!tutor?.id) return;
    const tutorRef = await firestore()
      .collection("profile")
      .doc(tutor?.id)
      .get();
    const tutorTokens = tutorRef.data().tokens;
    if (tutorTokens?.length > 0)
      tokens.push(tutorTokens[tutorTokens.length - 1]);
  });

  await Promise.all([...parentPromises, ...tutorPromises]);
  const tokensFilter = tokens.filter((token) => token);
  return tokensFilter;
};

export async function PATCH(request) {
  const body = await request.json();
  try {
    // Start a new transaction
    await firestore().runTransaction(async (transaction) => {
      // Get a reference to the travelsWithFriend document and read it
      const travelsWithFriendRef = firestore()
        .collection("travelsWithFriend")
        .doc(body.id);
      const travelsWithFriendDoc = await transaction.get(travelsWithFriendRef);

      // Update travelsWithFriend collection
      transaction.update(travelsWithFriendRef, {
        [`${body.day}.status`]: body.status,
        [`${body.day}.updatedAt`]: new Date(),
      });

      // Get a reference to the travels document
      const travelsRef = firestore().collection("travels").doc(body.route);

      // Determine the type: prefer the saved type, fallback to route data
      const savedType = travelsWithFriendDoc.data()?.[body.day]?.type;
      const routeData = await getRouteData(body.route);
      const type = savedType || (routeData?.workshop ? "workshop" : "toHome");

      // Update travels collection based on the status
      if (body.status === "accepted") {
        const studentRequestRef = firestore()
          .collection("students")
          .doc(body.studentRequest);
        const studentRequestDoc = await transaction.get(studentRequestRef);

        transaction.update(travelsRef, {
          [`${body.day}.${type}.travelWithFriend`]:
            firestore.FieldValue.arrayUnion(body.studentRequest),
        });
        // update statusTravel of the studentRequest
        transaction.update(studentRequestRef, {
          statusTravel: "travelWithFriend",
        });

        // Create a temporary stop for the friend student on this route
        const studentCoords = studentRequestDoc.data()?.address?.coords;
        if (studentCoords) {
          const friendStopId = `${body.studentRequest}_${body.route}_${body.day}_friend`;
          const friendStopRef = firestore()
            .collection("stops")
            .doc(friendStopId);
          transaction.set(friendStopRef, {
            student: body.studentRequest,
            route: body.route,
            day: body.day,
            type,
            coords: studentCoords,
            isTravelWithFriend: true,
          });
        }
      } else {
        const studentRequestRef = firestore()
          .collection("students")
          .doc(body.studentRequest);
        const studentDoc = await transaction.get(studentRequestRef);

        transaction.update(travelsRef, {
          [`${body.day}.${type}.travelWithFriend`]:
            firestore.FieldValue.arrayRemove(body.studentRequest),
        });

        // Only reset statusTravel if it's currently "travelWithFriend"
        if (studentDoc.data()?.statusTravel === "travelWithFriend") {
          transaction.update(studentRequestRef, {
            statusTravel: "",
          });
        }

        // Delete the temporary stop created for travel-with-friend
        const friendStopId = `${body.studentRequest}_${body.route}_${body.day}_friend`;
        const friendStopRef = firestore().collection("stops").doc(friendStopId);
        transaction.delete(friendStopRef);
      }
    });
    const tokens = await getTokensFromParents(body.id);
    // Send a notification after the transaction is completed
    fetch(`${process.env.NEXT_PUBLIC_URL_API}api/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `El viaje con amigo ha sido actualizado`,
        body: `El viaje con amigo de ${body.fullName?.trim()} ha sido actualizado a ${
          TRAVEL_WITH_FRIEND_STATUS[body.status]
        }`,
        data: {
          routeId: body.route,
          schoolId: body.schoolId,
          studentRequest: body.id,
          student: body.student,
        },
        tokens,
        category: "travelWithFriend",
      }),
    });

    return NextResponse.json({
      message: "Viaje actualizado",
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// Function to get the route of a student
async function getStudentRoute(student, day) {
  const stopsRef = await firestore()
    .collection("stops")
    .where("student", "==", student)
    .where("day", "==", day)
    .get();

  let route = null;

  // Si stopsRef viene con type 'workshop' retornar el valor de route de ese documento
  // Si stopsRef viene con type 'toHome' retornar el valor de route de ese documento siempre y y cuando no haya un documento con type 'workshop'
  // Si stopsRef viene con type 'toSchool' ignorar ese documento
  stopsRef.docs.forEach((doc) => {
    if (doc.data().type === "workshop") {
      route = doc.data().route;
    } else if (doc.data().type === "toHome" && !route) {
      route = doc.data().route;
    }
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
async function getTravelData(route, day, isWorkshop = false) {
  const travelRef = await firestore().collection("travels").doc(route).get();
  const type = isWorkshop ? "workshop" : "toHome";
  return travelRef.data()[day]?.[type];
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
  type,
) {
  const data = {
    [day]: {
      route,
      day,
      status: "pending",
      student,
      date,
      type,
    },
  };
  const travelsWithFriendRef = firestore()
    .collection("travelsWithFriend")
    .doc(studentRequest);
  if (!(await travelsWithFriendRef.get()).exists) {
    await travelsWithFriendRef.set(data);
  }
  return await travelsWithFriendRef.update(data);
}

export async function POST(request) {
  const res = await request.json();
  const { student, date, day, studentRequest } = res;

  try {
    const route = await getStudentRoute(student, day);
    const routeData = await getRouteData(route);
    const travel = await getTravelData(route, day, routeData?.workshop);
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

      await createTravelWithFriendRequest(
        route,
        day,
        student,
        studentRequest,
        date,
        routeData?.workshop ? "workshop" : "toHome",
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
            student: student,
          },
          category: "travelWithFriend",
        }),
      });
    }

    return NextResponse.json({ route, travel });
  } catch (error) {
    if (error.message === "Ruta no encontrada") {
      return NextResponse.json(
        { error: "No hay ruta asignada de este estudiante para este día" },
        { status: 404 },
      );
    }
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
