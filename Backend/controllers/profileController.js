import Profile from "../models/profileModel.js";

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

// 

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
      resumeData = {
        originalName: req.file.originalname,
        filename: req.file.filename,
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

    const profiles = await Profile.find()
      .populate("user", "email role")
      .skip(skip)
      .limit(limit);

    const total = await Profile.countDocuments();

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

