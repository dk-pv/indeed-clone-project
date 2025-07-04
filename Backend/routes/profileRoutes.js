import express from "express";
import { getProfile, upsertProfile } from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

// Storage setup for resume
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/resumes");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) return cb(null, true);
    cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
  }
});

const router = express.Router();

router.get("/", verifyToken, getProfile);
router.post("/", verifyToken, upload.single("resume"), upsertProfile);

export default router;
