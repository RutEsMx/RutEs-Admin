import { NextResponse } from "next/server";
import { customInitApp } from "@/firebase/admin";
import { auth, firestore } from "firebase-admin";
import { cookies } from "next/headers";
// Init the Firebase SDK every time the server is called
customInitApp();

const getUSer = async (sessionid) => {
  try {
    const verifyIdToken = await auth().verifyIdToken(sessionid, true);
    const profile = await firestore()
      .collection("profile")
      .doc(verifyIdToken?.uid)
      .get();
    return profile?.data();
  } catch (error) {
    return { error: error?.message, code: error?.code };
  }
};

export async function GET(request) {
  const url = new URL(request.url);
  const sessionid = cookies().get("sessionid");
  const searchParams = new URLSearchParams(url.search);
  const profile = await getUSer(sessionid?.value);

  if (profile?.error) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (searchParams.get("all")) {
    try {
      const getAllUnits = await firestore()
        .collection("units")
        .where("schoolId", "==", profile.schoolId)
        .orderBy("model")
        .get();
      if (getAllUnits.empty) {
        return NextResponse.json({ error: "No se encontraron unidades" });
      }
      const data = getAllUnits.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        name: doc.data().plate,
      }));
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ error });
    }
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
        .collection("units")
        .where("schoolId", "==", query.schoolId)
        .orderBy("model")
        .limit(query?.pageIndex * query?.pageSize)
        .get();
      lastVisible =
        lastVisibleSnapshot.docs[lastVisibleSnapshot.docs.length - 1];
    }
    const response = await firestore()
      .collection("units")
      .where("schoolId", "==", query.schoolId)
      .orderBy("model")
      .startAfter(lastVisible)
      .limit(query.pageSize)
      .get();

    const data = response.docs.map((doc) => {
      const id = doc.id;
      const data = doc.data();
      return { id, ...data };
    });
    // get pageCount from firestore
    const responseCount = await firestore()
      .collection("units")
      .where("schoolId", "==", query.schoolId)
      .get();

    const dataTable = {
      rows: data,
      pageCount: Math.ceil(responseCount.size / query.pageSize),
    };

    return NextResponse.json(dataTable);
  } catch (error) {
    console.log("🚀 ~ file: route.js:61 ~ GET ~ error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
