import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
      unique: true, // Ensure one profile per user
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    showNumberOnIndeed: {
      type: Boolean,
      default: true,
    },
    streetAddress: {
      type: String,
      default: "",
    },
    cityState: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      default: "",
    },
    country: {
      label: { type: String },
      value: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Profile", profileSchema);
