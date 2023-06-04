import { Request, Response } from "express";
import { User } from "../models/User";
import crypto from "crypto";
import { sentMail } from "../utils";

declare module "express-session" {
  export interface SessionData {
    userid: string;
  }
}

export const createNewUser = async (req: Request, res: Response, next: any) => {
  try {
    const { email } = req.body;
    const { isReturningUser, userData } = await User.checkReturningUser(email);
    if (isReturningUser) {
      const {
        id: userId,
        full_name: fullName,
        email,
        password,
        is_password_login: isPasswordLogin,
        is_verified: isVerified,
      } = userData;
      if (isVerified) {
        res.status(400);
        res.send("please login");
      } else {
        const { token } = await User.getVerificationToken(userId);
        const emailMessageHtml = `<p>Click the following link to login<p><a target="_blank" href="http://localhost:8000/verify/${userId}/${token}">sign in link</a>`;
        const emailMessage = `use this link to login http://localhost:8000/verify/${userId}/${token}`;
        sentMail(emailMessage, emailMessageHtml, email);
        res.status(200);
        res.send(`resent verification mail ${JSON.stringify(userData)}`);
      }
    } else {
      const tempFullname = email.split("@")[0];
      const user = new User(tempFullname, email, "", 0, 0);
      const newUser = await user.createNewUser();
      const userId = newUser?.["insertId"]; // insertId is returned by mysql after insertion.
      const token = crypto.randomBytes(32).toString("hex");
      await User.createVerificationForUser(userId, token);
      const emailMessageHtml = `<p>Click the following link to login<p><a target="_blank" href="http://localhost:8000/verify/${userId}/${token}">sign in link</a>`;
      const emailMessage = `use this link to login http://localhost:8000/verify/${userId}/${token}`;
      sentMail(emailMessage, emailMessageHtml, email);
      res.status(201);
      res.send(newUser);
    }
  } catch (e) {
    console.log(e);
    res.send("something went wrong");
  }
};

export const signInUser = async (req: Request, res: Response, next: any) => {
  const email = req.body.email;
  const userDetails = await User.getUserDetailsWithEmail(email);
  if (Boolean(userDetails)) {
    const { id: userId, email: userEmail, is_verified } = userDetails;
    const isVerified = Boolean(is_verified);
    const verificationToken = await User.getVerificationToken(userId);
    if (Boolean(verificationToken)) {
      const { token } = verificationToken;
      const emailMessageHtml = `<p>Click the following link to login<p><a target="_blank" href="http://localhost:8000/verify/${userId}/${token}">sign in link</a>`;
      const emailMessage = `use this link to login http://localhost:8000/verify/${userId}/${token}`;
      sentMail(emailMessage, emailMessageHtml, userEmail);
      res.send(userDetails); // "send sign in email with verification token"
    } else {
      const token = crypto.randomBytes(32).toString("hex");
      await User.createVerificationForUser(userId, token);
      const emailMessageHtml = `<p>Click the following link to login<p><a target="_blank" href="http://localhost:8000/verify/${userId}/${token}">sign in link</a>`;
      const emailMessage = `use this link to login http://localhost:8000/verify/${userId}/${token}`;
      sentMail(emailMessage, emailMessageHtml, userEmail);
      res.send(
        `create verification token(${token}) and send sign in email with newly created verification token. user id(${userId})`
      );
    }
  } else {
    res.send("user doesn't exist");
  }
};

export const verifyUser = async (req: Request, res: Response, next: any) => {
  const { userId, userHash: hash } = req.params;
  const { token } = (await User.getVerificationToken(userId)) || {};
  if (Object.is(token, hash)) {
    const deltetedRow = await User.deleteVerificationEntry(userId);
    await User.toggleUserVerificationStatus(userId);
    res.status(200);
    if (deltetedRow.affectedRows) {
      const session = req.session;
      session.userid = userId;
      res.redirect("/feed");
    } else {
      res.send("unable to delete");
    }
  } else {
    res.status(406);
    res.send("unable to verify the user");
  }
};
