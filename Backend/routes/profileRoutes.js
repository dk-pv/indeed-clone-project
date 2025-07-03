import express from "express";
import {
  createOrUpdateProfile,
  getProfile,
} from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";


const router = express.Router();
router.post("/update", verifyToken , createOrUpdateProfile);

router.get("/", verifyToken , getProfile);

export default router;
