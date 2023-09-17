import express, {
  Express,
  NextFunction,
  Request,
  Response,
  response,
} from "express";
import { apiRouter } from "./src/routes/api";
import { verifyRouter } from "./src/routes/verify";
import dotenv from "dotenv";
import path from "path";
import { homeRouter } from "./src/routes/feed";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
const MySQLStore = require("express-mysql-session")(session);
import { authenticateUser } from "./src/middleware";

dotenv.config();

const oneDay = 1000 * 60 * 60 * 24;

const app: Express = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.set("views", "./views");
app.set("view engine", "pug");
const port = process.env.PORT || 8000;

const options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const sessionStore = new MySQLStore(options);

app.use(express.static(path.join(__dirname, "../public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "",
    name: process.env.SESSION_NAME,
    saveUninitialized: false,
    cookie: { maxAge: oneDay },
    resave: false,
    store: sessionStore,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.render("home", { loggedIn: Boolean(req.session.userid) });
});

app.use("/api", apiRouter);
app.use("/verify", verifyRouter);

app.use("/feed", authenticateUser, homeRouter);

app.use("/logout", (req: Request, res: Response) => {
  req.session.destroy((e) => console.log(e));
  res.redirect("/");
});

app.use("/draft", (req: Request, res: Response) => {
  res.render("draft");
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
