import { NextResponse } from "next/server";
import { customInitApp } from "@/firebase/admin";
import { firestore } from "firebase-admin";
import { TRAVEL_WITH_FRIEND_STATUS } from "@/utils/options";

customInitApp();

// Documentation
// id
// day
// status
// route
// fullName
// student
// schoolId
// studentRequest

export async function PATCH(request) {
  const body = await request.json();
  try {
    // Start a new transaction
    await firestore().runTransaction(async (transaction) => {
      // Get a reference to the travelsWithFriend document
      const travelsWithFriendRef = await firestore()
        .collection("travelsWithFriend")
        .doc(body.id);

      // Update travelsWithFriend collection
      transaction.update(travelsWithFriendRef, {
        [`${body.day}.status`]: body.status,
        [`${body.day}.updatedAt`]: new Date(),
      });

      // Get a reference to the travels document
      const travelsRef = firestore().collection("travels").doc(body.route);

      // Update travels collection based on the status
      if (body.status === "accepted") {
        transaction.update(travelsRef, {
          [`${body.day}.toHome.travelWithFriend`]:
            firestore.FieldValue.arrayUnion(body.studentRequest),
        });
      } else {
        transaction.update(travelsRef, {
          [`${body.day}.toHome.travelWithFriend`]:
            firestore.FieldValue.arrayRemove(body.studentRequest),
        });
      }
    });

    // Send a notification after the transaction is completed
    fetch(`${process.env.NEXT_PUBLIC_URL_API}api/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `El viaje con amigo ha sido actualizado`,
        body: `El viaje con amigo de ${body.fullName} ha sido actualizado a ${
          TRAVEL_WITH_FRIEND_STATUS[body.status]
        }`,
        data: {
          routeId: body.route,
          schoolId: body.schoolId,
          studentRequest: body.id,
          student: body.student,
        },
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
