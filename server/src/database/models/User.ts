// src/models/User.ts
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config";
import bcrypt from "bcrypt";
import crypto from "crypto";

class User extends Model {
  public id!: number;
  public email!: string;
  public password_hash!: string;
  public isActive!: boolean;
  public role!: string;
  public emailVerificationToken!: string | null;
  public isEmailVerified!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public resetPasswordToken!: string | null;
  public resetPasswordExpires!: Date | null;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password_hash);
  }

  public generateVerificationToken(): string {
    return crypto.randomBytes(20).toString("hex");
  }

  public generatePasswordResetToken(): string {
    return crypto.randomBytes(20).toString("hex");
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100], // password length between 8 and 100 characters
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    indexes: [{ unique: true, fields: ["email"] }],
  }
);

export default User;
