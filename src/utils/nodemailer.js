import nodemailer from "nodemailer";

async function sendMail(subject, toEmail, otpText) {
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
      return true;
    }
  });
}

export default sendMail;
