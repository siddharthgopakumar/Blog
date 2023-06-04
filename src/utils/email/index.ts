import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export const sentMail = (
  email: string,
  emailHTML: string,
  recepient: string,
  sender: string = "blog.verfy@gmail.com",
  subject: string = "Verification",
) => {
  const msg = {
    to: recepient,
    from: sender,
    subject: subject,
    text: email,
    html: emailHTML,
  };
  sgMail
    .send(msg)
    .then(() => console.log("Email sent"))
    .catch((error: any) => console.log(error));
};
