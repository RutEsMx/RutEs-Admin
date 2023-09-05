import { auth } from "firebase-admin";
import { NextResponse } from "next/server";
import { customInitApp } from "@/firebase/admin";
import { firestore } from "firebase-admin";
import { cookies } from "next/headers";
import { getUSer } from "@/utils/functionsServer";
// Init the Firebase SDK every time the server is called
customInitApp();

export async function POST(request) {
  const res = await request.json();
  const { email, password } = res;
  try {
    const response = await auth().createUser({
      email: email,
      password: password,
    });
    return NextResponse.json({
      success: true,
      message: "Usuario creado",
      result: response,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
      let getAllAuxiliars;
      if (searchParams.get("route") !== "null") {
        getAllAuxiliars = await firestore()
          .collection("profile")
          .where("schoolId", "==", profile.schoolId)
          .where("roles", "array-contains-any", ["auxiliar"])
          .where("route", "==", searchParams.get("route"))
          .orderBy("name")
          .get();
      } else {
        getAllAuxiliars = await firestore()
          .collection("profile")
          .where("schoolId", "==", profile.schoolId)
          .where("roles", "array-contains-any", ["auxiliar"])
          .where("route", "==", null)
          .orderBy("name")
          .get();
      }

      if (getAllAuxiliars.empty) {
        return NextResponse.json(
          { error: "No se encontraron auxiliares" },
          { status: 404 },
        );
      }
      const data = getAllAuxiliars.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        name: `${doc.data().name} ${doc.data().lastName} ${
          doc.data().secondLastName
        }`,
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
      schoolId: searchParams.get("schoolId"),
    };

    let lastVisible = 0;
    if (query?.pageIndex > 0) {
      const lastVisibleSnapshot = await firestore()
        .collection("profile")
        .where("schoolId", "==", query.schoolId)
        .where("roles", "array-contains-any", ["auxiliar"])
        .orderBy("name")
        .limit(query?.pageIndex * query?.pageSize)
        .get();
      lastVisible =
        lastVisibleSnapshot.docs[lastVisibleSnapshot.docs.length - 1];
    }
    const response = await firestore()
      .collection("profile")
      .where("schoolId", "==", query.schoolId)
      .where("roles", "array-contains-any", ["auxiliar"])
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
      .collection("profile")
      .where("schoolId", "==", query.schoolId)
      .where("roles", "array-contains-any", ["auxiliar"])
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
