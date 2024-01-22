import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";

async function sendMail(name, email, subject, message) {
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

  const mailOption = {
    from: process.env.GMAIL_USER,
    to: process.env.EMAIL,
    subject: subject,
    // html: `You got a message from
    // Email : ${email}
    // Name: ${name}
    // Message: ${message}`,
    template: "mail-template",
    context: {
      name: name,
      email: email,
      message: message,
    },
  };

  try {
    await transporter.sendMail(mailOption);
    return Promise.resolve("Message Sent Successfully!");
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}
export default sendMail;
