import { auth } from "firebase-admin";
import { NextResponse } from "next/server";
import { customInitApp } from "@/firebase/admin";
import { firestore } from "firebase-admin";
import { cookies } from "next/headers";
import { getUSer } from "@/utils/functionsServer";

// revalidate
export const revalidate = 1;
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
  const sessionid = cookies().get("sessionid");
  const profile = await getUSer(sessionid?.value);

  if (profile?.error) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  try {
    const rolesQuery = () => {
      const array = ["user-school", "admin", "minor-user"];
      if (profile?.roles?.includes("admin-rutes")) {
        array.unshift("admin-rutes");
        return array;
      } else if (profile?.roles?.includes("admin")) {
        return array;
      } else {
        return ["user-school"];
      }
    };
    const roles = rolesQuery();
    const response = await firestore()
      .collection("profile")
      .where("schoolId", "==", profile.schoolId)
      .where("roles", "array-contains-any", roles)
      .orderBy("name")
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
