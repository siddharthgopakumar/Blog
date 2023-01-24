import express, { Express, Request, Response } from "express";
import { createNewUser } from "../controllers/UserAuthentication";

const verifyRouter = express.Router();

const verifyUser = (req: Request, res: Response, next: any) => {
  res.send(`in verification - ${req.params.userId} - ${req.params.userHash}`);
  
};

verifyRouter.route("/:userId/:userHash").get(verifyUser).post();

export { verifyRouter };
