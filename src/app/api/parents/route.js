import { NextResponse } from "next/server";
import { customInitApp } from "@/firebase/admin";
import { auth, firestore } from "firebase-admin";
import { cookies } from "next/headers";
import { getUSer } from "@/utils/functions";

// Init the Firebase SDK every time the server is called
customInitApp();

export async function GET(request) {
  const url = new URL(request.url);
  const sessionid = cookies().get("sessionid");
  const searchParams = new URLSearchParams(url.search);
  const profile = await getUSer(sessionid?.value);

  if (profile?.error) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    const query = {
      pageIndex: Number(searchParams.get("pageIndex")),
      pageSize: Number(searchParams.get("pageSize")),
      schoolId: profile?.schoolId,
    };

    let lastVisible = 0;
    if (query?.pageIndex > 0) {
      const lastVisibleSnapshot = await firestore()
        .collection("profile")
        .where("schoolId", "==", query.schoolId)
        .where("roles", "array-contains-any", ["user", "tutor"])
        .orderBy("name")
        .limit(query?.pageIndex * query?.pageSize)
        .get();
      lastVisible =
        lastVisibleSnapshot.docs[lastVisibleSnapshot.docs.length - 1];
    }
    const response = await firestore()
      .collection("profile")
      .where("schoolId", "==", query.schoolId)
      .where("roles", "array-contains-any", ["user", "tutor"])
      .orderBy("name")
      .startAfter(lastVisible)
      .limit(query.pageSize)
      .get();

    const data = response.docs.map((doc) => {
      const studentsArray = [];
      if (doc.data()?.students?.length > 0) {
        doc.data().students.forEach(async (student) => {
          const snapshot = await student.get();
          studentsArray.push(snapshot.data());
        });
      }

      const id = doc.id;
      const data = doc.data();
      data.students = studentsArray;
      return { id, ...data };
    });
    const responseCount = await firestore()
      .collection("profile")
      .where("schoolId", "==", query.schoolId)
      .where("roles", "array-contains-any", ["user", "tutor"])
      .get();

    const dataTable = {
      rows: data,
      pageCount: Math.ceil(responseCount.size / query.pageSize),
    };

    return NextResponse.json(dataTable);
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
      await auth().deleteUser(key);
      await firestore().collection("profile").doc(key).delete();
    });
    await Promise.all(promises);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
