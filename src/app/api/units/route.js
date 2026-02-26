import { NextResponse } from "next/server";
import { customInitApp } from "@/firebase/admin";
import { firestore } from "firebase-admin";
import { cookies } from "next/headers";
import { getUSer } from "@/utils/functionsServer";
// Init the Firebase SDK every time the server is called
customInitApp();

export async function GET(request) {
  const sessionid = (await cookies()).get("sessionid");
  const profile = await getUSer(sessionid?.value);

  if (profile?.error) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {

    const response = await firestore()
      .collection("units")
      .where("schoolId", "==", profile.schoolId)
      .orderBy("model")
      .get();

    const data = response.docs.map((doc) => {
      const id = doc.id;
      const data = doc.data();
      return { id, ...data };
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
