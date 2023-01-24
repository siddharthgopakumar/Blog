"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_1 = require("./src/routes/api");
const verify_1 = require("./src/routes/verify");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
var bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const sendEmail = require("./src/utils/email");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("views", "./views");
app.set("view engine", "pug");
const port = process.env.PORT;
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.get("/", (req, res) => {
    res.render("home", { title: "Pug(u◉ᴥ◉)", message: "Hello World!" });
});
app.use("/api", api_1.apiRouter);
app.use("/verify", verify_1.verifyRouter);
app.listen(port, () => {
    console.log(path_1.default.join(__dirname, "../public"));
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
