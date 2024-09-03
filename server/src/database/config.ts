// src/database/config.ts
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Database configuration
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DB_PATH || "./database.sqlite",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  define: {
    underscored: true,
    timestamps: true,
  },
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1); // Exit the process if unable to connect
  }
}

// Initialize the database
async function initializeDatabase(sync: boolean = false) {
  await testConnection();
  if (sync) {
    console.log("Syncing database models...");
    await sequelize.sync({ alter: true });
    console.log("Database models synced successfully.");
  }
}

export { sequelize, initializeDatabase };
