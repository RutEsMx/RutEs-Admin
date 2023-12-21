import nodemailer from "nodemailer";

export async function sendMail(subject, toEmail, otpText) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW,
    },
  });

  var mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: toEmail,
    subject: subject,
    text: otpText,
  };

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      throw new Error(error);
    } else {
      console.log("Email Sent");
      return true;
    }
  });
}

const sendPassword = async (email, password) => {
  const subject = "Cuenta creada";
  const otpText = `Tu contraseña es: ${password}`;
  const toEmail = email;

  const body = {
    subject,
    otpText,
    toEmail,
  };

  const url = `${process.env.NEXT_PUBLIC_URL_API}api/mail`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};

export { sendPassword };
