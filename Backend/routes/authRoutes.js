import express from "express";
import {
  requestOTP,
  verifyOTP,
  googleLogin,
  getProfile
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // ✅ fixed here

const router = express.Router();

router.post("/send-otp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/google-login", googleLogin);
router.get("/profile", verifyToken, getProfile);

export default router;
