import { customInitApp } from "@/firebase/admin";
import { firestore } from "firebase-admin";
import { NextResponse } from "next/server";
// Init the Firebase SDK every time the server is called
customInitApp();

export async function GET(request, { params }) {
  const { id } = params;
  const response = await firestore().collection("routes").doc(id).get();

  const responseAuxiliar = await firestore()
    .collection("profile")
    .where("route", "==", id)
    .where("roles", "array-contains-any", ["auxiliar"])
    .get();
  const responseUnits = await firestore()
    .collection("units")
    .where("route", "==", id)
    .get();
  const responseDriver = await firestore()
    .collection("drivers")
    .where("route", "==", id)
    .get();
  return Promise.all([responseAuxiliar, responseUnits, responseDriver]).then(
    (values) => {
      const auxiliars = values[0];
      const units = values[1];
      const drivers = values[2];
      const idAuxiliars = auxiliars.docs.map((doc) => doc.id);
      const idUnits = units.docs.map((doc) => doc.id);
      const idDrivers = drivers.docs.map((doc) => doc.id);

      const data = {
        ...response.data(),
        id: response.id,
        auxiliar: idAuxiliars[0] || null,
        unit: idUnits[0] || null,
        driver: idDrivers[0] || null,
      };
      return NextResponse.json(data);
    },
  );
}
