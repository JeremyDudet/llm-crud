// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./database/config";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Use Sequelize for database connection
sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
