import { NextResponse } from "next/server";
import { firestore, messaging } from "firebase-admin";
import { customInitApp } from "@/firebase/admin";

const app = customInitApp();

// Categoria
// - bus
// Salida de camion
// Entrada de camion
// Student abarca las siguientes categorias
// - parents
// Estudiante subio a camion
// Estudiante salio de la escuela
// Estudiante bajo de camion o fue entregado
// Estudiante llego a la escuela
// - status
// Cambio de estados
// Viaje con un amigo
// - general
// Notificaciones generales
// - emergency
// Notificaciones de emergencia

const validateError = (error) => {
  let message = "Error desconocido";
  switch (error?.code) {
    case "messaging/invalid-argument":
      message = "Argumentos inválidos";
      break;
    default:
      break;
  }
  return message;
};

export async function POST(request) {
  try {
    const res = await request.json();
    const notificationData = {
      notification: {
        title: res?.title,
        body: res?.body,
      },
      data: res?.data,
      tokens: res?.tokens,
      createdAt: new Date(),
      category: res?.category || "general",
    };
    const schoolId = res?.data?.schoolId;

    await messaging(app).sendEachForMulticast({
      ...notificationData,
    });

    // eslint-disable-next-line
    const { tokens, data, ...restNotification } = notificationData;

    const saveData = {
      ...restNotification,
      ...data,
    };

    await firestore()
      .collection("notificationsSchool")
      .doc(schoolId)
      .collection("notifications")
      .add({
        ...saveData,
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = validateError(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const schoolId = searchParams.get("schoolId");
  const userId = searchParams.get("userId");

  try {
    if (schoolId) {
      const notification = await firestore()
        .collection("notificationsSchool")
        .doc(schoolId)
        .collection("notifications")
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();

      const list = [];

      notification.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return NextResponse.json({ list });
    }
    return NextResponse.json({ userId });
  } catch (error) {
    const errorMessage = validateError(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
