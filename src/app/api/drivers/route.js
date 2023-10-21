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
  //   try {
  //     let getAllDrivers;
  //     if (searchParams.get("route") !== "null") {
  //       getAllDrivers = await firestore()
  //         .collection("drivers")
  //         .where("schoolId", "==", profile.schoolId)
  //         .where("route", "==", searchParams.get("route"))
  //         .orderBy("name")
  //         .get();
  //     } else {
  //       getAllDrivers = await firestore()
  //         .collection("drivers")
  //         .where("schoolId", "==", profile.schoolId)
  //         .where("route", "==", null)
  //         .orderBy("name")
  //         .get();
  //     }
  //     if (getAllDrivers.empty) {
  //       return NextResponse.json(
  //         { error: "No se encontraron conductores" },
  //         { status: 404 },
  //       );
  //     }
  //     const data = getAllDrivers.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //       name: `${doc.data().name} ${doc.data().lastName} ${
  //         doc.data().secondLastName
  //       }`,
  //     }));
  //     return NextResponse.json(data);
  //   } catch (error) {
  //     return NextResponse.json({ error });
  //   }
  // }

  try {
    const response = await firestore()
      .collection("drivers")
      .where("schoolId", "==", profile.schoolId)
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
