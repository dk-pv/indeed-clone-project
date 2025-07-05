import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import path from 'path'

// Routes
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

// Middleware
import errorHandler from "./middleware/errorHandler.js";

// Initialize app
const app = express();

// Connect to DB
connectDB();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

// Serve resume files
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/profile", profileRoutes);

// Error handler (⚠️ always after routes)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
