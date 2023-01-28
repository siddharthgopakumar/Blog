import express, { Express, Request, Response } from "express";
import { createNewUser, signInUser } from "../controllers/UserAuthentication";

const apiRouter = express.Router();

apiRouter.route("/signup").get().post(createNewUser);

apiRouter.route("/signin").get().post(signInUser);

export { apiRouter };
