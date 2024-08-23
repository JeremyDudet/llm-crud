// src/services/AuthService.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../database/models/User";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not set in the environment variables");
  process.exit(1);
}

export class AuthService {
  static async login(
    username: string,
    password: string
  ): Promise<string | null> {
    const user = await User.findOne({ where: { username } });
    if (!user) return null;

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return null;

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET as string,
      { expiresIn: "12h" }
    );
    return token;
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET as string);
    } catch (error) {
      return null;
    }
  }

  static async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await User.findByPk(userId);
    if (!user) return false;

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) return false;

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return true;
  }
}

export default AuthService;
