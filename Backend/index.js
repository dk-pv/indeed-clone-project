import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import http from "http";
import connectDB from "./config/db.js";
import { setupSocket } from "./config/socket.js";

// Routes  
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import notificationRoutes from './routes/notificationRoutes.js'

// Middleware
import errorHandler from "./middleware/errorHandler.js";

// Init app
const app = express();

// DB connect
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

// Resume static folder
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Create server manually
const server = http.createServer(app);

// Setup socket.io
const io = setupSocket(server);

// ✅ Attach req.io middleware **after io is defined**
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/notifications", notificationRoutes);

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 9999;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
