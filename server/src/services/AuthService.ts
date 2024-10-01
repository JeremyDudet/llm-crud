// src/services/AuthService.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from "../database";
import { User } from "../database/schema";
import { eq, gt, and } from "drizzle-orm";
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

  static async register(email: string, password: string): Promise<any> {
    try {
      const existingUser = await db
        .select()
        .from(User)
        .where(eq(User.email, email))
        .get();
      if (existingUser) {
        throw new Error("Email already in use");
      }

      const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
      const newUser = await db
        .insert(User)
        .values({
          email,
          passwordHash: hashedPassword,
        })
        .returning()
        .get();

      return newUser;
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error("Registration failed");
    }
  }

  static async login(
    email: string,
    password: string
  ): Promise<{
    token: string;
    user: Partial<typeof User.$inferSelect>;
  } | null> {
    const user = await db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .get();
    if (!user) return null;

    try {
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) return null;

      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET as string,
        { expiresIn: "12h" }
      );

      const userData: Partial<typeof User.$inferSelect> = {
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
    const user = await db.select().from(User).where(eq(User.id, userId)).get();
    if (!user) return false;

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      user.passwordHash
    );
    if (!isPasswordValid) return false;

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await db
      .update(User)
      .set({ passwordHash: newHashedPassword })
      .where(eq(User.id, userId))
      .run();
    return true;
  }

  static async resetPasswordRequest(email: string): Promise<void> {
    const user = await db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .get();
    if (!user) return;

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await db
      .update(User)
      .set({
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry,
      })
      .where(eq(User.id, user.id))
      .run();

    await sendPasswordResetEmail(email, resetToken);
  }

  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await db
      .select()
      .from(User)
      .where(
        and(
          eq(User.resetPasswordToken, token),
          gt(User.resetPasswordExpires, new Date())
        )
      )
      .get();

    if (!user) return false;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db
      .update(User)
      .set({
        passwordHash: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      })
      .where(eq(User.id, user.id))
      .run();

    return true;
  }

  static async verifyEmail(token: string): Promise<boolean> {
    const user = await db
      .select()
      .from(User)
      .where(eq(User.emailVerificationToken, token))
      .get();
    if (!user) return false;

    await db
      .update(User)
      .set({
        isEmailVerified: true,
        emailVerificationToken: null,
      })
      .where(eq(User.id, user.id))
      .run();

    return true;
  }

  static async generateRefreshToken(userId: number): Promise<string> {
    const refreshToken = jwt.sign({ id: userId }, JWT_SECRET as string, {
      expiresIn: "7d",
    });
    await db
      .update(User)
      .set({ refreshToken })
      .where(eq(User.id, userId))
      .run();
    return refreshToken;
  }

  static async refreshAccessToken(
    refreshToken: string
  ): Promise<string | null> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET as string) as {
        id: number;
      };
      const user = await db
        .select()
        .from(User)
        .where(
          and(eq(User.id, decoded.id), eq(User.refreshToken, refreshToken))
        )
        .get();

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
