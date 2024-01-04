import nodemailer from "nodemailer";

async function sendMail(subject, toEmail, otpText) {
  console.log(
    "🚀 ~ file: nodemailer.js:10 ~ sendMail ~ process.env.NODEMAILER_EMAIL:",
    process.env.NODEMAILER_EMAIL,
  );
  console.log(
    "🚀 ~ file: nodemailer.js:10 ~ sendMail ~ process.env.NODEMAILER_PW:",
    process.env.NODEMAILER_PW,
  );
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
      console.log("🚀 ~ file: nodemailer.js:23 ~ error:", error);
      throw new Error(error);
    } else {
      return true;
    }
  });
}

export default sendMail;
