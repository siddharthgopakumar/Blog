import express, { Express, Request, Response } from "express";
import { createNewUser } from "../controllers/UserAuthentication";

const apiRouter = express.Router();

apiRouter.route("/signup").get().post(createNewUser);

export { apiRouter };
