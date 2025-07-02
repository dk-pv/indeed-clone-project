import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  company: {
    name: { type: String, required: true },
    contactPerson: String,
    phone: String,
    referralSource: {
      type: String,
      enum: [
        "online_video",
        "mail",
        "streaming_audio",
        "tv",
        "word_of_mouth",
        "search_engine",
        "newspaper",
        "radio",
        "billboard",
        "podcast",
        "social_media",
        "other",
      ],
    },
  },

  job: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      city: String,
      area: String,
      pincode: String,
      address: String,
    },
  },

  jobTypes: [
    {
      type: String,
      enum: [
        "Full-time",
        "Permanent",
        "Fresher",
        "Part-time",
        "Internship",
        "Contractual / Temporary",
        "Freelance",
        "Volunteer",
      ],
    },
  ],

  schedules: [
    {
      type: String,
      enum: [
        "Day shift",
        "Morning shift",
        "Rotational shift",
        "Night shift",
        "Monday to Friday",
        "Evening shift",
        "Weekend availability",
        "Fixed shift",
      ],
    },
  ],

  numberOfPeople: {
    type: String,
    enum: ["1", "2-5", "6-10", "11-25", "26-50", "50+"],
  },

  recruitmentTimeline: {
    type: String,
    enum: ["Immediate", "1-2 weeks", "2-4 weeks", "1-2 months", "Flexible"],
    required: true,
  },

  payRange: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: "INR" },
  },

  supplementalPay: [
    {
      type: String,
      enum: [
        "Performance bonus",
        "Yearly bonus",
        "Commission pay",
        "Overtime pay",
        "Quarterly bonus",
        "Shift allowance",
        "Joining bonus",
        "Other",
      ],
    },
  ],

  benefits: [
    {
      type: String,
      enum: [
        "Health insurance",
        "Provident Fund",
        "Cell phone reimbursement",
        "Paid sick time",
        "Work from home",
        "Paid time off",
        "Food provided",
        "Life insurance",
        "Dental insurance",
        "Flexible schedule",
        "Employee discount",
        "Retirement plan",
      ],
    },
  ],

  preferences: {
    email: {
      type: String,
      validate: {
        validator: (v) =>
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
        message: "Please enter a valid email",
      },
    },
    additionalEmails: [String],
    individualEmails: Boolean,
    resumeRequired: { type: Boolean },
    contactCandidates: { type: Boolean },
  },
  isDeleted: {
  type: Boolean,
  default: false
},

  status: {
    type: String,
    enum: ["published", "closed"],
    default: "published",
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update `updatedAt` before save
jobSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
