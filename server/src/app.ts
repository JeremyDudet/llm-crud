import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { appRouter } from "./trpc";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createContext } from "./trpc/context";
import { db } from "./database";
import { users } from "./database/schema";
import userRoutes from "./routes/users";
import authRoutes from "./routes/authRoutes";
import processCommandRoutes from "./routes/processCommandRoutes";
import transcribeAudioRoutes from "./routes/transcribeAudioRoutes";
import processTextCommandRoutes from "./routes/processTextCommandRoutes";
import itemRoutes from "./routes/items";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Database connection check
db.select()
  .from(users)
  .limit(1)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });

// tRPC middleware
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Something broke!",
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    details: err instanceof Error ? err : "Unknown error",
  });
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});

export default app;
