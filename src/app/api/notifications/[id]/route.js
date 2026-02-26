import { customInitApp } from "@/firebase/admin";
import { validateError } from "@/utils/functionsServer";
import { firestore } from "firebase-admin";
import { NextResponse } from "next/server";
// Init the Firebase SDK every time the server is called
customInitApp();

export async function GET(request, props) {
  const params = await props.params;
  const { id } = params;
  const searchParams = request.nextUrl.searchParams;
  const schoolId = searchParams.get("schoolId");
  const limit = Number(searchParams.get("limit")) || 2;
  try {
    if (schoolId) {
      const notification = await firestore()
        .collection("notificationsSchool")
        .doc(schoolId)
        .collection("notifications")
        .where("routeId", "==", id)
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();

      const list = [];

      notification.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return NextResponse.json({ list });
    }
  } catch (error) {
    const errorMessage = validateError(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
