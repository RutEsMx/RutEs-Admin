import { NextResponse } from "next/server";
import { messaging } from "firebase-admin";
import { customInitApp } from "@/firebase/admin";

const app = customInitApp();

export async function POST(request) {
  const res = await request.json();
  try {
    await messaging(app).sendEachForMulticast({
      notification: {
        title: res.title,
        body: res.body,
      },
      data: res.data,
      tokens: res.tokens,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
