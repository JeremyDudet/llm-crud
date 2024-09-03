import { Sequelize } from "sequelize";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { umzug } from "./migrationSetup.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

async function runMigrations() {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );

    // Execute the migrations using Umzug
    const migrations = await umzug.up();
    console.log(
      "Migrations executed:",
      migrations.map((m) => m.name)
    );
  } catch (error) {
    console.error("Unable to run migrations:", error);
  } finally {
    await sequelize.close();
  }
}

runMigrations();
