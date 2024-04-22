import { createTransport } from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

//creating transport to send mail
export const transport=createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
      user: process.env.Email,
      pass: process.env.PassWord,
    },
})