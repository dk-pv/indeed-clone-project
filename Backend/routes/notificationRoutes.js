import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} from "../controllers/notificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getNotifications);
router.post("/mark-read", verifyToken, markAsRead);
router.post("/mark-all-read", verifyToken, markAllAsRead);
router.get("/unread-count", verifyToken, getUnreadCount);

export default router;
