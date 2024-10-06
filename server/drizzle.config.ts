import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

const connectionString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.POSTGRES_DB}`;

export default defineConfig({
  schema: "./src/database/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
  verbose: true,
  strict: true,
});
