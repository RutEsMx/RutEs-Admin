import { NextResponse } from "next/server";
import { customInitApp } from "@/firebase/admin";
import { firestore } from "firebase-admin";

// Init the Firebase SDK every time the server is called
customInitApp();

export async function GET(request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const query = {
    pageIndex: Number(searchParams.get("pageIndex")),
    pageSize: Number(searchParams.get("pageSize")),
    schoolId: searchParams.get("schoolId"),
  };
  if (!query)
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  try {
    let lastVisible = 0;
    if (query?.pageIndex > 0) {
      const lastVisibleSnapshot = await firestore()
        .collection("students")
        .where("schoolId", "==", query.schoolId)
        .orderBy("name")
        .limit(query?.pageIndex * query?.pageSize)
        .get();
      lastVisible =
        lastVisibleSnapshot.docs[lastVisibleSnapshot.docs.length - 1];
    }
    const response = await firestore()
      .collection("students")
      .where("schoolId", "==", query.schoolId)
      .orderBy("name")
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
      .collection("students")
      .where("schoolId", "==", query.schoolId)
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
