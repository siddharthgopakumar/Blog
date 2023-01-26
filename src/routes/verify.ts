import express, { Express, Request, Response } from "express";
import { verifyUser } from "../controllers/UserAuthentication";

const verifyRouter = express.Router();

verifyRouter.route("/:userId/:userHash").get(verifyUser).post();

export { verifyRouter };
