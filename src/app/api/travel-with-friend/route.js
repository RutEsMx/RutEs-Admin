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

export async function PATCH(request) {
  const body = await request.json();
  try {
    // Update travelsWithFriend collection
    const response = await firestore()
      .collection("travelsWithFriend")
      .doc(body.id)
      .update({
        [`${body.day}.status`]: body.status,
        [`${body.day}.updatedAt`]: new Date(),
      });
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
    return NextResponse.json(response);
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error);
    return NextResponse.json(error);
  }
}
