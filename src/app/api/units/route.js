import { NextResponse } from "next/server";
import { customInitApp } from "@/firebase/admin";
import { firestore } from "firebase-admin";
import { cookies } from "next/headers";
import { getUSer } from "@/utils/functionsServer";
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

  // if (searchParams.get("all")) {
  //   const passengersNumber = Number(searchParams.get("passengers"));
  //   try {
  //     let getAllUnits;
  //     if (searchParams.get("route") !== "null") {
  //       getAllUnits = await firestore()
  //         .collection("units")
  //         .where("schoolId", "==", profile.schoolId)
  //         .where("route", "==", searchParams.get("route"))
  //         .orderBy("passengers")
  //         .get();
  //     } else {
  //       getAllUnits = await firestore()
  //         .collection("units")
  //         .where("schoolId", "==", profile.schoolId)
  //         .where("passengers", ">=", passengersNumber)
  //         .where("route", "==", null)
  //         .orderBy("passengers")
  //         .get();
  //     }

  //     if (getAllUnits.empty) {
  //       return NextResponse.json(
  //         { error: "No se encontraron unidades" },
  //         { status: 404 },
  //       );
  //     }
  //     const data = getAllUnits.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //       name: doc.data().plate,
  //     }));
  //     return NextResponse.json(data);
  //   } catch (error) {
  //     return NextResponse.json({ error });
  //   }
  // }

  try {

    const response = await firestore()
      .collection("units")
      .where("schoolId", "==", profile.schoolId)
      .orderBy("model")
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
