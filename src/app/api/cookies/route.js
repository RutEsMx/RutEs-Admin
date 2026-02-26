import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  const cookieStore = await cookies();
  const res = await request.json();
  cookieStore.set({
    name: "sessionid",
    value: res.jwt,
  });
  return NextResponse.json({ message: "Logged in" });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("sessionid");
  return NextResponse.json({ message: "Logged out" });
}
