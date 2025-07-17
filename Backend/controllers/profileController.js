import Profile from "../models/profileModel.js";

export const getAProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(200).json({
        success: true,
        data: null, // 👈 Handle this in frontend
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
      industryPreference, // 👈 new field
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
    if (industryPreference) completeness += 5; // 👈 new field adds to score

    const update = {
      user: req.user._id,
      personalInfo: { firstName, lastName, email, phone, location },
      education,
      skills,
      profileCompleteness: completeness,
      industryPreference, // 👈 add to update
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


// GET /api/profiles — only for employers
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", "email role");
    res.status(200).json({ success: true, data: profiles });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
