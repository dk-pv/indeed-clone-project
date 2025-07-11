import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" }, // optional
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
