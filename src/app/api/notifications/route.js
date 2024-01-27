import { NextResponse } from "next/server";
import { messaging } from "firebase-admin";
import { customInitApp } from "@/firebase/admin";

customInitApp();

export async function POST(request) {
  const res = await request.json();
  try {
    const response = await messaging().sendEachForMulticast({
      notification: {
        title: res.title,
        body: res.body,
      },
      data: res.data,
      tokens: res.tokens,
    });
    return NextResponse.json({ success: true, result: response });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
