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

  const rolesQuery = () => {
    const array = ["user-school", "admin", "minor-user"];
    if (profile?.roles?.includes("admin")) {
      return array;
    } else if (profile?.roles?.includes("admin-rutes")) {
      array.push("admin-rutes");
      return array;
    } else {
      return ["user-school"];
    }
  };
  const roles = rolesQuery();
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
        .where("roles", "array-contains-any", roles)
        .orderBy("name")
        .limit(query?.pageIndex * query?.pageSize)
        .get();
      lastVisible =
        lastVisibleSnapshot.docs[lastVisibleSnapshot.docs.length - 1];
    }
    const response = await firestore()
      .collection("profile")
      .where("schoolId", "==", query.schoolId)
      .where("roles", "array-contains-any", roles)
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
      .where("roles", "array-contains-any", roles)
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
