"use server";

import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

const PATHS = {
  WELCOME_USERS: "sendPasswordUsers/index",
  UPDATE_PASSWORD_USERS: "updatePasswordUsers/index",
  WELCOME: "sendPassword/index",
};

async function sendMail(subject, toEmail, context, pathname) {
  if (typeof window !== "undefined") {
    throw new Error("Esta función solo puede ser llamada desde el servidor");
  }

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW,
    },
  });

  const safeContext = JSON.parse(JSON.stringify(context || {}));
  const enrichedContext = {
    ...safeContext,
    year: new Date().getFullYear(),
  };

  transporter.use(
    "compile",
    hbs({
      viewEngine: {
        extName: ".hbs",
        layoutsDir: path.resolve("./src/views/layouts"),
        defaultLayout: false,
        partialsDir: path.resolve("./src/views"),
      },
      viewPath: path.resolve("./src/views"),
      extName: ".hbs",
    }),
  );

  var mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: toEmail,
    subject: subject,
    context: enrichedContext,
    template: PATHS[pathname],
  };

  try {
    const result = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export default sendMail;
