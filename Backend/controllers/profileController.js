import Profile from "../models/profileModel.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import Company from "../models/companyModel.js";


export const getAProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const upsertProfile = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      email,
      phone,
      location,
      education = "[]",
      skills = "",
      industryPreference,
    } = req.body;

    education = JSON.parse(education);
    skills = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    let resumeData = null;
    if (req.file) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: "raw",
              folder: "resumes",
              public_id: `resume_${req.user._id}_${Date.now()}`, // Unique file name
            },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      const result = await streamUpload(req.file.buffer);
      resumeData = {
        originalName: req.file.originalname,
        filename: result.secure_url,
        previewUrl: result.secure_url, // Same as filename for viewing
        uploadDate: new Date(),
      };
    }

    // Profile completeness calculation
    let completeness = 0;
    if (firstName) completeness += 15;
    if (lastName) completeness += 15;
    if (email) completeness += 15;
    if (phone) completeness += 10;
    if (location) completeness += 10;
    if (resumeData) completeness += 25;
    if (skills.length > 0) completeness += 5;
    if (industryPreference) completeness += 5;

    const update = {
      user: req.user._id,
      personalInfo: { firstName, lastName, email, phone, location },
      education,
      skills,
      profileCompleteness: completeness,
      industryPreference,
    };

    if (resumeData) update.resume = resumeData;

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      update,
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error("Profile Error:", error.message);
    console.error(error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getAllProfiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Step 1: Fetch employer's company profile
    const company = await Company.findOne({ user: req.user._id }).select("field");
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found. Please complete your company profile.",
      });
    }

    // Step 2: Build query for matching profiles
    const query = { industryPreference: company.field };

    // Optional: Add skills and location filtering if provided
    if (req.query.skills) {
      query.skills = { $in: req.query.skills.split(",").map(s => s.trim()) };
    }
    if (req.query.location) {
      query["personalInfo.location"] = { $regex: req.query.location, $options: "i" };
    }

    // Step 3: Fetch matching profiles
    const profiles = await Profile.find(query)
      .populate("user", "email role")
      .skip(skip)
      .limit(limit)
      .select("personalInfo resume skills industryPreference profileCompleteness");

    const total = await Profile.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: profiles,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};