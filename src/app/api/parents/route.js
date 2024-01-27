import { NextResponse } from "next/server";
import { customInitApp } from "@/firebase/admin";
import { auth, firestore } from "firebase-admin";
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
      .collection("profile")
      .where("schoolId", "==", profile.schoolId)
      .where("roles", "array-contains-any", ["user", "tutor"])
      .orderBy("name")
      .get();

    const data = response.docs.map(async (doc) => {
      const studentsArray = [];
      if (doc.data()?.students?.length > 0) {
        for (const student of doc.data().students) {
          const snapshot = await student.get();
          const studentData = snapshot.data();
          studentData.id = snapshot.id;
          if (snapshot.exists) studentsArray.push(studentData);
        }
      }

      const id = doc.id;
      const data = doc.data();
      data.students = studentsArray;
      return { id, ...data };
    });

    return Promise.all(data)
      .then((result) => {
        return NextResponse.json(result);
      })
      .catch((error) => {
        return NextResponse.json({ error: error.message }, { status: 500 });
      });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const data = await request.json();
  const sessionid = cookies().get("sessionid");
  const profile = await getUSer(sessionid?.value);

  if (profile?.error) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  try {
    const promises = Object.keys(data).forEach(async (key) => {
      await firestore().collection("profile").doc(key).delete();
      await auth().deleteUser(key);
    });
    await Promise.all(promises);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
