import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";

async function sendMail(subject, toEmail, context, path) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW,
    },
  });

  transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extName: ".hbs",
        layoutsDir: "./src/views/layouts",
        defaultLayout: "",
      },
      viewPath: "./src/views/",
      extName: ".hbs",
    }),
  );

  var mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: toEmail,
    subject: subject,
    context,
    template: path,
  };

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

export default sendMail;
