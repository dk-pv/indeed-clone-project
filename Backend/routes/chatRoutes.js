import express from "express";
import { getMessages, sendMessage } from "../controllers/chatController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; 


const router = express.Router();

router.post("/send", verifyToken , sendMessage); 
router.get("/:jobId/:senderId/:receiverId", verifyToken,getMessages); 

export default router;
