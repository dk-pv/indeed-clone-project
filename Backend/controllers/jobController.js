import Job from "../models/jobModel.js";
import Application from "../models/jobApplicationModel.js";
import Profile from "../models/profileModel.js";
import { sendJobApplicationEmail } from "../utils/sendJobApplicationEmail.js";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import sendStatusUpdateEmail from "../utils/statusUpdateMailer.js";
import Company from "../models/companyModel.js"; // ✅ Add this



export const createJob = asyncHandler(async (req, res) => {
  const { job, details, payAndBenefits, preferences, status } = req.body;

  // ✅ Step 1: Get employer's company profile
  const companyProfile = await Company.findOne({ user: req.user._id });

  if (!companyProfile) {
    return res.status(400).json({
      success: false,
      message: "Please complete your company profile before posting a job.",
    });
  }

  const newJob = await Job.create({
    employer: req.user._id,
    company: {
      name: companyProfile.name, // ✅ Auto-filled
      contactPerson: req.body.company?.contactPerson || "",
      phone: req.body.company?.phone || "",
      referralSource: req.body.company?.referralSource || "",
    },

    job: {
      title: job.title,
      description: job.description,
      location: job.location,
    },

    jobTypes: details.jobTypes,
    schedules: details.schedules,
    numberOfPeople: details.hiringCount,
    recruitmentTimeline: details.timeline,
    requiredSkills: details.requiredSkills || [],
    graduateRequired: details.graduateRequired || false,

    payRange: {
      min: payAndBenefits.minSalary,
      max: payAndBenefits.maxSalary,
      currency: payAndBenefits.currency || "INR",
    },
    supplementalPay: payAndBenefits.supplementalPay,
    benefits: payAndBenefits.benefits,

    preferences,
    status,
  });

  res.status(201).json({
    success: true,
    data: newJob,
  });
});

export const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ status: "published", isDeleted: false })
    .populate("employer", "name email companyName")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

export const getEmployerJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({
    employer: req.user._id,
    isDeleted: false,
  }).sort("-createdAt");

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

export const updateJob = asyncHandler(async (req, res) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }
  
  if (job.employer.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this job");
  }

  if (req.body.employer) {
    delete req.body.employer;
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: job,
  });
});

export const getAJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate(
    "employer",
    "_id name email companyName"
  );

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const jobData = job.toObject();

  jobData.company = {
    ...jobData.company,
    userId: job.employer._id,
  };

  res.status(200).json({
    success: true,
    data: jobData,
  });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.employer.toString() !== req.user._id) {
    res.status(401);
    throw new Error("Not authorized to delete this job");
  }

  job.isDeleted = true;
  await job.save();

  res.status(200).json({
    success: true,
    message: "Job soft-deleted successfully",
  });
});







///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






// apply job

export const applyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId).populate("employer", "name email");
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(400).json({
        success: false,
        message: "Please complete your profile before applying",
        redirectTo: "/profile",
      });
    }

    if (!profile.skills || profile.skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please update your profile with skills before applying",
        redirectTo: "/profile",
      });
    }

    // Check skill match
    const jobSkills = job.requiredSkills.map((s) => s.toLowerCase());
    const userSkills = profile.skills.map((s) => s.toLowerCase());
    const hasMatchingSkill = jobSkills.some((skill) =>
      userSkills.includes(skill)
    );

    if (!hasMatchingSkill) {
      return res.status(400).json({
        success: false,
        message: "Your profile does not match the required skills",
      });
    }

    // Already applied check
    const alreadyApplied = await Application.findOne({
      job: jobId,
      user: req.user._id,
    });
    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job",
      });
    }

    // Create application
    await Application.create({
      user: req.user._id,
      job: jobId,
      status: "pending",
    });

    // Extract name/phone/email from profile.personalInfo
    const name =
      profile.personalInfo?.firstName ||
      "" + " " + profile.personalInfo?.lastName ||
      "";
    const email = profile.personalInfo?.email || "Not provided";
    const phone = profile.personalInfo?.phone || "Not provided";

    // Build resume URL
    const resumePath = profile.resume?.filename
      ? `http://localhost:9999/uploads/resumes/${profile.resume.filename}`
      : "";

    // Send email to employer
    if (job.employer?.email) {
      await sendJobApplicationEmail({
        to: job.employer.email,
        jobTitle: job.job.title,
        applicantName: name || "Not available",
        applicantEmail: email,
        applicantPhone: phone,
        resumeLink: resumePath,
      });
    }

    res.status(200).json({
      success: true,
      message: "🎉 Job application submitted successfully!",
    });
  } catch (error) {
    console.error("Error applying to job:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


export const getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log("📌 Job ID:", jobId);
    console.log("🔐 Logged in user:", req.user._id);

    const job = await Job.findById(jobId);
    if (!job) {
      console.log("❌ Job not found");
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      console.log("🚫 Unauthorized employer");
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const applications = await Application.find({ job: jobId })
   
  .populate("user", "email _id") // ✅ include _id explicitly
  .lean();


    console.log("📝 Applications found:", applications.length);

    const enriched = await Promise.all(
      applications.map(async (app) => {
        console.log("🔎 Fetching profile for user:", app.user._id);
        const profile = await Profile.findOne({ user: app.user._id });

        const name = `${profile?.personalInfo?.firstName || ""} ${profile?.personalInfo?.lastName || ""}`.trim();
        const email = profile?.personalInfo?.email || app.user.email || "N/A";
        const phone = profile?.personalInfo?.phone || "N/A";
        const resumeUrl = profile?.resume?.filename
          ? `http://localhost:9999/uploads/resumes/${profile.resume.filename}`
          : "";

        return {
          _id: app._id,
          user: {
            _id: app.user._id,
            name,
            email,
            phone,
            resumeUrl,
          },
          status: app.status,
        };
      })
    );

    console.log("✅ Returning enriched applicants");

    res.status(200).json({ success: true, data: enriched });
  } catch (err) {
    console.error("❌ Error in getApplicantsByJob:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching applicants",
    });
  }
};





export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "reject", "finalist", "ready for interview"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const application = await Application.findById(applicationId).populate("user", "_id");
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    application.status = status;
    await application.save();

    // Send email only for non-pending statuses
    if (status !== "pending") {
      const profile = await Profile.findOne({ user: application.user._id });
      const job = await Job.findById(application.job);

      const name = `${profile?.personalInfo?.firstName || "Applicant"}`;
      const email = profile?.personalInfo?.email;

      if (email && job?.job?.title) {
        await sendStatusUpdateEmail({
          to: email,
          applicantName: name,
          jobTitle: job.job.title,
          newStatus: status,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Status updated and email sent",
      data: application,
    });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};




export const getAppliedJobs = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).populate("job");
    const appliedJobs = applications.map(app => app.job);
    res.status(200).json({ success: true, data: appliedJobs });
  } catch (err) {
    console.error("❌ Error in getAppliedJobs:", err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};










///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





// Save a job
export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = req.user;

    if (!jobId) {
      return res
        .status(400)
        .json({ success: false, message: "Job ID is required" });
    }

    // Already saved check
    if (user.savedJobs.includes(jobId)) {
      return res
        .status(400)
        .json({ success: false, message: "Job already saved" });
    }

    user.savedJobs.push(jobId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Job saved successfully",
      savedJobs: user.savedJobs,
    });
  } catch (err) {
    console.error("Save Job Error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Remove a saved job
export const removeSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = req.user;

    if (!jobId) {
      return res
        .status(400)
        .json({ success: false, message: "Job ID is required" });
    }

    user.savedJobs = user.savedJobs.filter(
      (savedId) => savedId.toString() !== jobId.toString()
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Job removed from saved list",
      savedJobs: user.savedJobs,
    });
  } catch (err) {
    console.error("Remove Saved Job Error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




export const getSavedJobs = async (req, res) => {
  try {
    console.log("✅ Getting saved jobs for user:", req.user);

    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user" });
    }

    const user = await User.findById(req.user._id).populate("savedJobs");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      savedJobs: user.savedJobs,
    });
  } catch (err) {
    console.error("❌ Get Saved Jobs Error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
