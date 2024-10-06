import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const connectionString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.POSTGRES_DB}`;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in the environment variables");
}

console.log("Attempting to connect to database...");
console.log(
  "Connection string:",
  connectionString.replace(/:[^:@]+@/, ":****@")
); // Log the connection string with password masked

const sql = postgres(connectionString, {
  max: 1,
  connect_timeout: 10,
  idle_timeout: 10,
});

export const db = drizzle(sql);

export async function initializeDatabase() {
  let retries = 5;
  while (retries > 0) {
    try {
      await sql`SELECT 1`;
      console.log("Database connected successfully");

      console.log("Running migrations...");
      await migrate(db, { migrationsFolder: "drizzle" });
      console.log("Migrations completed successfully");
      return;
    } catch (error) {
      console.error(
        `Database initialization failed (attempt ${6 - retries}/5):`,
        error
      );
      retries--;
      if (retries === 0) {
        console.error(
          "Failed to connect to the database after multiple attempts"
        );
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
    }
  }
}

export async function ensureDatabaseConnection() {
  try {
    await sql`SELECT 1`;
  } catch (error) {
    console.error("Database connection lost, attempting to reconnect...");
    await initializeDatabase();
  }
}
