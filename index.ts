import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
var bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const mysql = require("mysql2");
const crypto = import("crypto");

const db = mysql.createPool({
  connectionLimit: 100,
  host: "127.0.0.1", //This is your localhost IP
  user: "blogAdmin", // "newuser" created in Step 1(e)
  password: "123456", // password for the new user
  database: "blog", // Database name
  port: "3306",
});

dotenv.config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "blog.verfy@gmail.com",
    pass: "bfjwxdcdtuuhhzbo",
  },
});

const app: Express = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "pug");
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.render("sample");
});

app.post("/", (req: Request, res: Response) => {
  db.getConnection(async (err: any, connection: any) => {
    if (err) console.error(err);
    const sqlInsertUser =
      "INSERT INTO users VALUES (0, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
    const insert_query = mysql.format(sqlInsertUser, [
      req.body.email.split("@")[0],
      req.body.email,
      "",
      0,
      0,
    ]);
    const token = (await crypto).randomBytes(32).toString("hex");
    connection.query(insert_query, (err: any, result: any) => {
      connection.release();
      if (err) return console.error(err);
      const sqlInsertUserVerification =
        "INSERT INTO verification VALUES (0, ?, ?)";
      const insert_query_verification = mysql.format(
        sqlInsertUserVerification,
        [result?.insertId, token]
      );
      let mailOptions = {
        from: '"Verification" <blog.verfy@gmail.com>',
        to: req.body.email,
        subject: "Verify your account",
        html: `<a href="http://localhost:8000/verify/${result?.insertId}/${token}">Click here to verify</a>`,
      };
      transporter.sendMail(
        mailOptions,
        (error: any, info: { messageId: any }) => {
          console.log("sending mail");
          if (error) return console.log(error);
          connection.query(
            insert_query_verification,
            (err: any, result: any) => {
              connection.release();
              if (err) console.error(err);
            }
          );
        }
      );
    });
  });
  res.send();
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
