import express, { Express, Request, Response } from "express";
import { apiRouter } from "./src/routes/api";
import dotenv from "dotenv";
import path from "path";
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

app.listen(port, () => {
  console.log(path.join(__dirname, "../public"));
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
