import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  role: text("role").notNull().default("user"),
  emailVerificationToken: text("email_verification_token"),
  isEmailVerified: integer("is_email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: integer("reset_password_expires", {
    mode: "timestamp",
  }),
  refreshToken: text("refresh_token"),
});

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", { enum: ["pending", "completed"] }).default("pending"),
});

export const inventory = sqliteTable("inventory", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  quantity: integer("quantity").notNull(),
  unit: text("unit"),
});
