import express from "express";
import * as dotenv from "dotenv";
import sendMail from "./mailSender.js";
import { rateLimiterUsingThirdParty } from "./middleware/rateLimiter.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiterUsingThirdParty);

const __dirname = new URL(".", import.meta.url).pathname;
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.status(200).send("✅");
});

app.get("/contact", (req, res) => {
  res.sendFile(__dirname + "views/contact.html");
});

app.post("/contact", async (req, res) => {
  const { yourname, youremail, yoursubject, yourmessage } = req.body;

  try {
    await sendMail(yourname, youremail, yoursubject, yourmessage);

    // res.redirect("/contact");
    // console.log("Mail sent!");

    res.status(200).json("Message Successfully Sent!");
  } catch (error) {
    res.status(400).json("Message Could not be Sent");
  }
});

app.listen(PORT, console.log(`Server started on port ${PORT}`));
