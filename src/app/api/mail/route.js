import { sendMail } from "../../../services/MailService";
import { NextResponse } from "next/server";

export async function POST(request) {
  const res = await request.json();
  const { subject, otpText, toEmail } = res;
  try {
    await sendMail(subject, toEmail, otpText);
    return NextResponse.json({ message: "Email Enviado" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
