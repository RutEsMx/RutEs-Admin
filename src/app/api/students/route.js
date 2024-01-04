import { NextResponse } from "next/server";
import { customInitApp } from "@/firebase/admin";
import { firestore } from "firebase-admin";
import { cookies } from "next/headers";
import { getUSer } from "@/utils/functionsServer";
// Init the Firebase SDK every time the server is called
customInitApp();

export async function GET(request) {
  const sessionid = cookies().get("sessionid");
  const profile = await getUSer(sessionid?.value);

  if (profile?.error) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    const response = await firestore()
      .collection("students")
      .where("schoolId", "==", profile.schoolId)
      .where("status", "==", "active")
      .orderBy("name")
      .get();

    const data = response.docs.map((doc) => {
      const id = doc.id;
      const data = doc.data();
      // const fullName = `${data.name || ""} ${data.lastName || ""} ${data.secondLastName || ""}}`
      // data.fullName = fullName;
      return { id, ...data };
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT() {
  const students = await firestore().collection("students").get();
  students.docs.forEach(async (doc) => {
    const data = doc.data();
    const fullName = [
      data.name?.toLowerCase(),
      data.lastName.toLowerCase(),
      data.secondLastName.toLowerCase(),
    ];
    await firestore().collection("students").doc(doc.id).update({ fullName });
  });
  return NextResponse.json({ message: "ok" });
}
