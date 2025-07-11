import Message from "../models/messageModel.js";
import mongoose from "mongoose";


export const sendMessage = async (req, res) => {
  const { senderId, receiverId, content, jobId } = req.body;
  try {
    const message = await Message.create({ senderId, receiverId, content, jobId });
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getMessages = async (req, res) => {
  const { jobId, senderId, receiverId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
    return res.status(400).json({ success: false, message: "Invalid sender or receiver ID" });
  }

  try {
    const query = {
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    };

    if (jobId !== "null") {
      query.jobId = jobId;
    }

    const messages = await Message.find(query).sort({ createdAt: 1});
    res.status(200).json({ success: true, data: messages });

  } catch (err) {
    console.error("❌ Error in getMessages:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};