import db from "../configs/db";
import mysql from "mysql2";
import crypto from "crypto";

class User {
  [x: string]: any;
  constructor(
    fullName: any,
    email: any,
    password: any,
    isPasswordLogin: any,
    isVerified: any
  ) {
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.isPasswordLogin = isPasswordLogin;
    this.isVerified = isVerified;
  }

  async createNewUser() {
    let createNewUser =
      "INSERT INTO users VALUES (0, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
    const insert_query = mysql.format(createNewUser, [
      this.fullName,
      this.email,
      this.password,
      this.isPasswordLogin,
      this.isVerified,
    ]);
    const [newUser, _] = await db.execute<any>(insert_query);
    const userId = newUser?.["insertId"];
    const token = await crypto.randomBytes(32).toString("hex");
    const createVerificationForUser =
      "INSERT INTO verification VALUES (0, ?, ?)";
    const insert_query_verification = mysql.format(createVerificationForUser, [
      userId,
      token,
    ]);
    const [newUserVerifyEntry, __] = await db.execute<any>(
      insert_query_verification
    );
    
    return newUser;
  }

  static async checkReturningUser(email: any) {
    const sqlCheckUserQuery = "SELECT * FROM users WHERE email = ?";
    const sql_check_query = mysql.format(sqlCheckUserQuery, email);
    const [rows, fields] = await db.query<any>(sql_check_query);
    if (rows.length == 0) return { isReturningUser: false, userData: null };
    else {
      const userData = rows[0];
      return { isReturningUser: true, userData };
    }
  }

  isUserVerified = () => !!this.isUserVerified;

  resendVerificationMail = () => console.log("resend verification mail");
}

export { User };
