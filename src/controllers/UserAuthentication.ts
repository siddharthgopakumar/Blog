import { Request, Response } from "express";
import { User } from "../models/User";
import crypto from "crypto";

declare module "express-session" {
  export interface SessionData {
    userid: string;
  }
}

export const checkReturningUser = async (
  req: Request,
  res: Response,
  next: any
) => {
  res.send("Check if user already exists");
};

export const createNewUser = async (req: Request, res: Response, next: any) => {
  try {
    const { email } = req.body;
    const { isReturningUser, userData } = await User.checkReturningUser(email);
    if (isReturningUser) {
      const {
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
        const user = new User(
          fullName,
          email,
          password,
          isPasswordLogin,
          isVerified
        );
        user.resendVerificationMail();
        res.status(200);
        res.send("resent verification mail");
      }
    } else {
      const tempFullname = email.split("@")[0];
      const user = new User(tempFullname, email, "", 0, 0);
      const newUser = await user.createNewUser();
      const userId = newUser?.["insertId"]; // insertId is returned by mysql after insertion.
      const token = crypto.randomBytes(32).toString("hex");
      await User.createVerificationForUser(userId, token);
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
  console.log(Boolean(userDetails));
  if (Boolean(userDetails)) {
    const { id: userId, is_verified } = userDetails;
    const isVerified = Boolean(is_verified);
    const verificationToken = await User.getVerificationToken(userId);
    if (Boolean(verificationToken)) {
      if (isVerified) {
        res.send("send sign in email with verification token");
      } else {
        res.send("send sign up email with verification token");
      }
    } else {
      if (isVerified) {
        res.send(
          "create verification token and send sign in email with newly created verification token"
        );
      } else {
        res.send(
          "create verification token and send sign up email with newly created verification token"
        );
      }
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
  console.log("session details", req.session);
};
