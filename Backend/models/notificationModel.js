import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["application"],
    required: true,
  },
  content: String,
  isRead: {
    type: Boolean,
    default: false,
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Notification", notificationSchema);
