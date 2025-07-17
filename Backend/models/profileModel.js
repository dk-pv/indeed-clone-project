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
      ref: "User",
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
    industryPreference: {
      type: String,
      enum: [
        "IT", "Healthcare", "Finance", "Education", "Manufacturing", "Retail",
        "Construction", "Telecommunication", "Transportation", "Agriculture",
        "Hospitality", "Media", "Real Estate", "Legal", "Marketing", "Government",
        "Non-profit", "Automotive", "Aerospace", "Biotechnology", "Pharmaceuticals",
        "Energy", "Utilities", "Mining", "FMCG (Fast-moving consumer goods)", 
        "E-commerce", "Logistics", "Food & Beverage", "Entertainment", "Sports",
        "Fashion", "Cybersecurity", "Robotics", "EdTech", "FinTech", "HealthTech",
        "AgriTech", "AI/ML", "Blockchain", "Game Development", "Design & Creative",
        "Consulting", "HR & Staffing", "Research & Development", "Marine", "Insurance",
        "Printing & Publishing", "Event Management", "Recycling & Waste Management",
        "Other",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
