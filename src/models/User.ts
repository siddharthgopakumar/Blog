import db from "../configs/db";
import mysql from "mysql2";

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
    return newUser;
  }

  static async createVerificationForUser(userId: number, token: string) {
    const createVerificationForUser =
      "INSERT INTO verification VALUES (0, ?, ?)";
    const insert_query_verification = mysql.format(createVerificationForUser, [
      userId,
      token,
    ]);
    const [newUserVerifyEntry, __] = await db.execute<any>(
      insert_query_verification
    );
    return newUserVerifyEntry;
  }

  static async checkReturningUser(email: string) {
    const sqlCheckUserQuery = "SELECT * FROM users WHERE email = ?";
    const sql_check_query = mysql.format(sqlCheckUserQuery, email);
    const [rows, _] = await db.query<any>(sql_check_query);
    if (rows.length == 0) return { isReturningUser: false, userData: null };
    else {
      const userData = rows[0];
      return { isReturningUser: true, userData };
    }
  }

  static async getVerificationToken(userId: string) {
    const getUserVerificationId =
      "SELECT token FROM verification WHERE user_id = ?";
    const sql_verify_user_query = mysql.format(getUserVerificationId, userId);
    const [rows, _] = await db.query<any>(sql_verify_user_query);
    return rows[0];
  }

  static async deleteVerificationEntry(userId: string) {
    const dropVerificationRow = "DELETE FROM verification WHERE user_id = ?";
    const sql_drop_verificationEntry = mysql.format(
      dropVerificationRow,
      userId
    );
    const [rows, _] = await db.query<any>(sql_drop_verificationEntry);
    return rows;
  }

  static async toggleUserVerificationStatus(userId: string) {
    const recordUserVerification =
      "UPDATE users SET is_verified = 1 WHERE id = ?";
    const record_user_verification = mysql.format(
      recordUserVerification,
      userId
    );
    const [rows, _] = await db.query<any>(record_user_verification);
    return rows;
  }

  static async getUserDetailsWithEmail(email: string) {
    const userDetails = "SELECT * FROM users WHERE email = ?";
    const get_user_details = mysql.format(userDetails, email);
    const [rows, _] = await db.query<any>(get_user_details);
    return rows[0];
  }

  isUserVerified = () => !!this.isUserVerified;

  resendVerificationMail = () => console.log("resend verification mail");
}

export { User };
