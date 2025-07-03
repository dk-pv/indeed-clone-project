// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import jobRoutes from './routes/jobRoutes.js'
// import searchRoutes from './routes/searchRoutes.js'
// import errorHandler from './middleware/errorHandler.js';
// import profileRoutes from './routes/profileRoutes.js'

// connectDB();
// const app = express();
// app.use(errorHandler);

// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true,
// }));

// app.use(express.json());
// app.use('/uploads/resumes', express.static('uploads/resumes'));

// app.use("/api/auth", authRoutes);
// app.use("/api/job", jobRoutes);
// app.use("/api/search", searchRoutes);
// app.use('/api/profile' ,  profileRoutes)



// app.listen(process.env.PORT, () => {
//   console.log(`Server running on http://localhost:${process.env.PORT}`);
// });


import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

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
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

// Serve resume files
app.use('/uploads/resumes', express.static('uploads/resumes'));

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
