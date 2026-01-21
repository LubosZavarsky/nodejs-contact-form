import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import * as dotenv from "dotenv";

dotenv.config();

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.PASSWORD,
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      extname: ".hbs",
      layoutsDir: "views/",
      defaultLayout: false,
      partialsDir: "views/",
    },
    viewPath: "views/",
    extName: ".hbs",
  })
);

async function sendMail(name, email, subject, message) {
  name = escapeHtml(name);
  email = escapeHtml(email);
  subject = escapeHtml(subject);
  message = escapeHtml(message);

  const mailOption = {
    from: process.env.GMAIL_USER,
    to: process.env.EMAIL,
    subject: subject,
    template: "mail-template",
    context: {
      name: name,
      email: email,
      message: message,
    },
  };

  await transporter.sendMail(mailOption);
  return "Message Sent Successfully!";
}

export default sendMail;
