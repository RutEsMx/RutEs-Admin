import { customInitApp } from "@/firebase/admin";
import { firestore } from "firebase-admin";
import { NextResponse } from "next/server";
// Init the Firebase SDK every time the server is called
customInitApp();

export async function GET(request, props) {
  const params = await props.params;
  const { id } = params;
  const response = await firestore().collection("schools").doc(id).get();
  const data = response.data();

  return NextResponse.json(data);
}
