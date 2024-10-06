import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { db } from "./database";
import { sql } from "drizzle-orm";
import { User } from "./database/schema";
import userRoutes from "./routes/users";
import authRoutes from "./routes/authRoutes";
import processCommandRoutes from "./routes/processCommandRoutes";
import transcribeAudioRoutes from "./routes/transcribeAudioRoutes";
import processTextCommandRoutes from "./routes/processTextCommandRoutes";
import itemRoutes from "./routes/items";
import chatRoutes from "./routes/chatThreadRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import { initializeDatabase } from "./database";

dotenv.config();

const app = express();
const port = Number(process.env.PORT);

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://llm-crud.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Database connection check
initializeDatabase()
  .then(() => {
    // Start the server
    const server = app
      .listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      })
      .on("error", (e: NodeJS.ErrnoException) => {
        if (e.code === "EADDRINUSE") {
          console.log(
            `Port ${port} is already in use. Trying port ${port + 1}`
          );
          app.listen(port + 1, () => {
            console.log(`Server is running on http://localhost:${port + 1}`);
          });
        } else {
          console.error("Failed to start server:", e);
        }
      });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM signal received: closing HTTP server");
      server.close(() => {
        console.log("HTTP server closed");
      });
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/process-command", processCommandRoutes);
app.use("/api/transcribe-audio", transcribeAudioRoutes);
app.use("/api/process-text-command", processTextCommandRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/create-checkout-session", paymentRoutes);

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
