import express from "express";
import { getMessages, sendMessage } from "../controllers/chatController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; // ⬅️ import the middleware


const router = express.Router();

router.post("/send", verifyToken , sendMessage); // Send message
router.get("/:jobId/:senderId/:receiverId", verifyToken,getMessages); // Get chat

export default router;
