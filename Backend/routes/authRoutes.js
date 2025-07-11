import express from "express";
import {
  requestOTP,
  verifyOTP,
  googleLogin,
  getUserById
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.post("/send-otp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/google-login", googleLogin);
router.get("/:id", verifyToken, getUserById);

export default router;
