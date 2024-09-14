import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { db } from "./database";
import { users } from "./database/schema";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import transcribeAudioRoutes from "./routes/transcribeAudio";
import voiceCommandRoutes from "./routes/voiceCommandRoutes";

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

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transcribe-audio", transcribeAudioRoutes);
app.use("/api/voice-commands", voiceCommandRoutes);
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
