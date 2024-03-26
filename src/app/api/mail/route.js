import { NextResponse } from "next/server";
import sendMail from "@/utils/nodemailer";

export async function POST(request) {
  const res = await request.json();
  const { subject, context, toEmail, path } = res;

  try {
    await sendMail(subject, toEmail, context, path);
    return NextResponse.json({ message: "Email Enviado" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
