import { Request, Response } from "express";
import { User } from "../models/User";

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
      res.status(201);
      res.send(newUser);
    }
  } catch (e) {
    console.log(e);
    res.send("something went wrong");
  }
};

export const signInUser = (req: Request, res: Response, next: any) => {};

export const verifyUser = async (req: Request, res: Response, next: any) => {
  const { userId, userHash: hash } = req.params;
  const { token } = (await User.verifyUser(userId, hash)) || {};
  if (Object.is(token, hash)) {
    const deltetedRow = await User.deleteVerificationEntry(userId);
    await User.toggleUserVerificationStatus(userId);
    res.status(200);
    res.send(deltetedRow.affectedRows ? "user verified" : "unable to delete");
  } else {
    res.status(406);
    res.send("unable to verify the user");
  }
};
