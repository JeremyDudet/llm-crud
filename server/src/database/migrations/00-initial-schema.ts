import { Migration } from "../migrationActions/migrationSetup.js";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("users", {
    id: {
      type: "INTEGER",
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: "TEXT",
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: "TEXT",
      allowNull: false,
    },
    first_name: {
      type: "TEXT",
      allowNull: true,
    },
    last_name: {
      type: "TEXT",
      allowNull: true,
    },
    date_of_birth: {
      type: "DATE",
      allowNull: true,
    },
    created_at: {
      type: "DATETIME",
      defaultValue: "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "DATETIME",
      defaultValue: "CURRENT_TIMESTAMP",
    },
    last_login: {
      type: "DATETIME",
      allowNull: true,
    },
    is_active: {
      type: "BOOLEAN",
      defaultValue: true,
    },
    role: {
      type: "TEXT",
      defaultValue: "user",
    },
    emailVerificationToken: {
      type: "TEXT",
      allowNull: true,
    },
    isEmailVerified: {
      type: "BOOLEAN",
      defaultValue: false,
    },
    resetPasswordToken: {
      type: "TEXT",
      allowNull: true,
    },
    resetPasswordExpires: {
      type: "DATE",
      allowNull: true,
    },
    refreshToken: {
      type: "TEXT",
      allowNull: true,
    },
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("users");
};
