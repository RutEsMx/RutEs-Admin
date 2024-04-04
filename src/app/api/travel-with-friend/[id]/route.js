import { NextResponse } from "next/server";
import { customInitApp } from "@/firebase/admin";
import { firestore } from "firebase-admin";

customInitApp();

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const response = await firestore()
      .collection("travelsWithFriend")
      .doc(id)
      .get();
    const data = response.data();
    const travelPromise = Object.keys(data).map(async (item) => {
      const responseStudentFriend = await firestore()
        .collection("students")
        .doc(data[item].student)
        .get();
      const studentFriend = responseStudentFriend.data();
      const responseStudentRequest = await firestore()
        .collection("students")
        .doc(id)
        .get();
      const studentRequest = responseStudentRequest.data();
      const responseRoute = await firestore()
        .collection("routes")
        .doc(data[item].route)
        .get();
      const routeData = responseRoute.data();
      return {
        ...data[item],
        studentFriend,
        studentRequest,
        routeData,
      };
    });
    const travel = await Promise.all(travelPromise);

    return NextResponse.json(travel);
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error);
    return NextResponse.json(error);
  }
}
