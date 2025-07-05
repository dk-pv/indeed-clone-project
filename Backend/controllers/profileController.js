import Profile from "../models/profileModel.js";

// @desc   Get user profile
// controllers/profileController.js
export const getProfile = async (req, res) => {
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
    } = req.body;

    // 🔥 Parse JSON fields sent from FormData
    education = JSON.parse(education); // string to array of objects
    skills = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean); // string to array

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
    if (skills.length > 0) completeness += 10;

    const update = {
      user: req.user._id,
      personalInfo: { firstName, lastName, email, phone, location },
      education,
      skills,
      profileCompleteness: completeness,
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
