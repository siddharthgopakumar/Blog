import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export const sentMail = (
  sender: string,
  recepient: string,
  subject: string,
  email: string,
  emailHTML: string
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
