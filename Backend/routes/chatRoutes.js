import express from "express";
import { getMessages, sendMessage  , getInbox} from "../controllers/chatController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; 


const router = express.Router();

router.post("/send", verifyToken , sendMessage); 
router.get("/:jobId/:senderId/:receiverId", verifyToken,getMessages); 
router.get("/inbox/:userId", verifyToken ,getInbox);


export default router;
