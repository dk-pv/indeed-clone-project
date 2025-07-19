import express from "express";
import {
  getAProfile,
  upsertProfile,
  getAllProfiles,
} from "../controllers/profileController.js";
import { verifyToken, verifyEmployer } from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
  },
});

const router = express.Router();

router.get("/", verifyToken, getAProfile);
router.post("/", verifyToken, upload.single("resume"), upsertProfile);
router.get("/all-profiles", verifyToken, verifyEmployer, getAllProfiles);

export default router;