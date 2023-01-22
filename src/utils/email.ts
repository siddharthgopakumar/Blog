import nodemailer from "nodemailer";

type functionA = (email: string, subject: string, html: string) => any;

const sendEmail: functionA = async (
  email: string,
  subject: string,
  html: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: html,
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent");
    console.error(error);
  }
};

module.exports = sendEmail;
