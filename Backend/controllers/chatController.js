import Message from "../models/messageModel.js";
import mongoose from "mongoose";

export const sendMessage = async (req, res) => {
  const { senderId, receiverId, content, jobId } = req.body;
  try {
    const message = await Message.create({
      senderId,
      receiverId,
      content,
      jobId,
    });
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getMessages = async (req, res) => {
  const { jobId, senderId, receiverId } = req.params;

  // ✅ Validate ObjectIds
  if (
    !mongoose.Types.ObjectId.isValid(senderId) ||
    !mongoose.Types.ObjectId.isValid(receiverId)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid sender or receiver ID" });
  }

  try {
    // ✅ Base query (sender <-> receiver)
    const query = {
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    };

    // ✅ Include jobId if provided
    if (jobId && jobId !== "null") {
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid job ID" });
      }
      query.jobId = jobId;
    }

    // ✅ Fetch messages + sender/receiver emails
    const messages = await Message.find(query)
      .sort({ createdAt: 1 })
      .populate("senderId", "email")
      .populate("receiverId", "email");

    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    console.error("❌ Error in getMessages:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};




export const getInbox = async (req, res) => {
  const userId = req.params.employerId || req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "email")
      .populate("receiverId", "email");

    const latestConversations = {};
    for (const msg of messages) {
      const otherUser =
        msg.senderId._id.toString() === userId ? msg.receiverId : msg.senderId;

      const key = otherUser._id.toString();

      if (!latestConversations[key]) {
        latestConversations[key] = {
          _id: otherUser._id,
          email: otherUser.email,
          lastMessage: msg,
        };
      }
    }

    res.status(200).json({
      success: true,
      data: Object.values(latestConversations),
    });
  } catch (err) {
    console.error("❌ Inbox error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
