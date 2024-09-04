// src/services/AuthService.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../database/models/User";
import dotenv from "dotenv";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../utils/emailService";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not set in the environment variables");
  process.exit(1);
}

export default class AuthService {
  private static readonly SALT_ROUNDS = 10;

  static async register(email: string, password: string): Promise<User | null> {
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error("Email already in use");
      }

      console.log("Registering with password:", password);
      const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
      console.log("Generated hash during registration:", hashedPassword);

      const user = await User.create({
        email,
        password_hash: hashedPassword,
      });
      return user;
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error("Registration failed");
    }
  }

  static async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: Partial<User> } | null> {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    console.log("User found:", user);
    console.log("Provided password:", password);
    console.log("Stored password hash:", user.password_hash);

    try {
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );
      console.log("Password comparison result:", isPasswordValid);

      if (!isPasswordValid) return null;

      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET as string,
        { expiresIn: "12h" }
      );

      const userData: Partial<User> = {
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      };

      return { token, user: userData };
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
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

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      user.password_hash
    );
    if (!isPasswordValid) return false;

    user.password_hash = await bcrypt.hash(newPassword, 10);
    await user.save();
    return true;
  }

  static async resetPasswordRequest(email: string): Promise<void> {
    console.log("Attempting password reset for email:", email);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("User not found for email:", email);
      // Don't reveal that the user doesn't exist
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    console.log("Generated reset token:", resetToken);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    console.log("User updated with reset token");

    // Send resetToken to the user's email
    await sendPasswordResetEmail(email, resetToken);
    console.log("Password reset email sent");
  }

  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      },
    });
    if (!user) return false;

    user.password_hash = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    return true;
  }

  static async verifyEmail(token: string): Promise<boolean> {
    const user = await User.findOne({
      where: { emailVerificationToken: token },
    });
    if (!user) return false;

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await user.save();
    return true;
  }

  static async generateRefreshToken(userId: number): Promise<string> {
    const refreshToken = jwt.sign({ id: userId }, JWT_SECRET as string, {
      expiresIn: "7d",
    });
    // Store the refresh token in the database
    await User.update({ refreshToken }, { where: { id: userId } });
    return refreshToken;
  }

  static async refreshAccessToken(
    refreshToken: string
  ): Promise<string | null> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET as string) as {
        id: number;
      };
      const user = await User.findOne({
        where: { id: decoded.id, refreshToken },
      });
      if (!user) return null;

      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET as string,
        { expiresIn: "1h" }
      );
      return accessToken;
    } catch (error) {
      return null;
    }
  }
}
