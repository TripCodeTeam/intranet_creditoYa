import nodemailer from "nodemailer";

const email = process.env.GOOGLE_EMAIL;
const pass = process.env.GOOGLE_APP_KEY;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass,
  },
});
