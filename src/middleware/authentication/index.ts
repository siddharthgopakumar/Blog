import { Request, Response, NextFunction } from "express";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = req.session;
  console.log('request');
  if (!session?.userid) {
    res.redirect("/");
  } else {
    next();
  }
};
