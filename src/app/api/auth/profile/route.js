import { customInitApp } from "@/firebase/admin";
import { getAuth } from "firebase-admin/auth";
import { NextResponse } from "next/server";
// Init the Firebase SDK every time the server is called
customInitApp();

export async function POST(request) {
  const res = await request.json();
  const { id, password } = res;
  try {
    return getAuth()
      .updateUser(id, {
        password: password,
      })
      .then((userRecord) => {
        const data = userRecord.toJSON();
        return NextResponse.json({ data }, { status: 200 });
      })
      .catch((error) => {
        return NextResponse.json({ error }, { status: 400 });
      });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
