import { Migration } from "../migrationActions/migrationSetup.js";
import { DataTypes } from "sequelize";

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn("users", "email_verification_token", {
    type: DataTypes.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn("users", "is_email_verified", {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  });

  await queryInterface.addColumn("users", "reset_password_token", {
    type: DataTypes.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn("users", "reset_password_expires", {
    type: DataTypes.DATE,
    allowNull: true,
  });

  await queryInterface.addColumn("users", "refresh_token", {
    type: DataTypes.STRING,
    allowNull: true,
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn("users", "email_verification_token");
  await queryInterface.removeColumn("users", "is_email_verified");
  await queryInterface.removeColumn("users", "reset_password_token");
  await queryInterface.removeColumn("users", "reset_password_expires");
  await queryInterface.removeColumn("users", "refresh_token");
};
