import express, { Express, Request, Response } from "express";
import { apiRouter } from "./src/routes/api";
import { verifyRouter } from "./src/routes/verify";
import dotenv from "dotenv";
import path from "path";
import { homeRouter } from "./src/routes/feed";
var bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const sendEmail = require("./src/utils/email");
dotenv.config();

const app: Express = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("views", "./views");
app.set("view engine", "pug");
const port = process.env.PORT;

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req: Request, res: Response) => {
  res.render("home", { title: "Pug(u◉ᴥ◉)", message: "Hello World!" });
});

app.use("/api", apiRouter);
app.use("/verify", verifyRouter);

app.use("/feed", homeRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
