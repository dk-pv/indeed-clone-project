// import express from "express";
// import multer from 'multer'
// import {
//   createOrUpdateProfile,
//   getProfile,
//   uploadResume
// } from "../controllers/profileController.js";
// import { verifyToken } from "../middleware/authMiddleware.js";


// const router = express.Router();

// router.post("/update", verifyToken , createOrUpdateProfile);
// router.get("/", verifyToken , getProfile);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/resumes/"),
//   filename: (req, file, cb) =>
//     cb(null, `${Date.now()}-${file.originalname}`),
// });
// const upload = multer({ storage });

// router.post("/upload-resume", verifyToken, upload.single("resume"), uploadResume);

// export default router;


import express from "express";
import multer from "multer";
import fs from "fs";
import {
  createOrUpdateProfile,
  getProfile,
  uploadResume,
} from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create or update profile
router.post("/update", verifyToken, createOrUpdateProfile);

// Get current user's profile
router.get("/", verifyToken, getProfile);

// Resume upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/resumes";
    // ✅ Create folder if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload resume
router.post(
  "/upload-resume",
  verifyToken,
  upload.single("resume"),
  uploadResume
);

export default router;
