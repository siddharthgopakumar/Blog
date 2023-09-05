import express, { Express, Request, Response } from "express";
import { verifyUser } from "../controllers/UserAuthentication";

const homeRouter = express.Router();

homeRouter
  .route("/")
  .get((req: Request, res: Response) => {
    res.render("feed", { loggedIn: Boolean(req.session.userid) });
  })
  .post();

export { homeRouter };
