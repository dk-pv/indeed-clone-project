import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  strength: {
    type: String,
    enum: ["0-100", "100-500", "500+"],
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) =>
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
      message: "Invalid email format",
    },
  },

  field: {
    type: String,
    enum: [
      "IT",
      "Healthcare",
      "Finance",
      "Education",
      "Manufacturing",
      "Retail",
      "Construction",
      "Telecommunication",
      "Transportation",
      "Agriculture",
      "Hospitality",
      "Media",
      "Real Estate",
      "Legal",
      "Marketing",
      "Other",
    ],
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Company", companySchema);
