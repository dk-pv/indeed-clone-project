import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    degree: String,
    school: String,
    fieldOfStudy: String,
    graduationYear: String,
    gpa: String,
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    originalName: String,
    filename: String,
    uploadDate: Date,
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // You already have this
      required: true,
      unique: true,
    },
    personalInfo: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      location: String,
      profilePicture: String,
    },
    education: [educationSchema],
    skills: [String],
    resume: resumeSchema,
    profileCompleteness: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
