import nodemailer from "nodemailer";
import fs from "fs";

const email = process.env.GOOGLE_EMAIL;
const pass = process.env.GOOGLE_APP_KEY;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass,
  },
});
