import { NextResponse } from "next/server";
import sendMail from "@/utils/nodemailer";

export async function POST(request) {
  const res = await request.json();
  const { subject, context, toEmail, path } = res;

  try {
    const result = await sendMail(subject, toEmail, context, path);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      message: "Email enviado correctamente",
      messageId: result.messageId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "Error al enviar el correo",
      },
      { status: 500 },
    );
  }
}
