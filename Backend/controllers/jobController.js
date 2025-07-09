import Job from "../models/jobModel.js";
import Application from "../models/jobApplicationModel.js";
import Profile from "../models/profileModel.js";
import { sendJobApplicationEmail } from "../utils/sendJobApplicationEmail.js";
import asyncHandler from "express-async-handler";

export const createJob = asyncHandler(async (req, res) => {
  const { company, job, details, payAndBenefits, preferences, status } =
    req.body;

  const newJob = await Job.create({
    employer: req.user._id,
    company: {
      name: company.name,
      contactPerson: company.contactPerson,
      phone: company.phone,
      referralSource: company.referralSource,
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

  // Check if the job belongs to the logged-in employer
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
    "name email companyName"
  );

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  res.status(200).json({
    success: true,
    data: job,
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
      status: "applied",
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

export const getAppliedJobs = async (req, res) => {
  try {
    const applications = await Application.find({
      user: req.user._id,
    }).populate("job");

    const jobIds = applications.map((app) => app.job._id.toString());

    res.status(200).json({
      success: true,
      data: applications,
      jobIds,
    });
  } catch (err) {
    console.error("Error fetching applied jobs:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch applied jobs" });
  }
};
