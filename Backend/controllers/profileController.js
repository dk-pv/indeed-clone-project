import Profile from "../models/profileModel.js";

export const createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      firstName,
      lastName,
      phone,
      email,
      streetAddress,
      cityState,
      pincode,
      country,
      showNumberOnIndeed,
    } = req.body;

    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      // Update existing profile
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.phone = phone;
      profile.email = email;
      profile.streetAddress = streetAddress;
      profile.cityState = cityState;
      profile.pincode = pincode;
      profile.country = country;
      profile.showNumberOnIndeed = showNumberOnIndeed;
    } else {
      // Create new profile
      profile = new Profile({
        user: userId,
        firstName,
        lastName,
        phone,
        email,
        streetAddress,
        cityState,
        pincode,
        country,
        showNumberOnIndeed,
      });
    }

    const savedProfile = await profile.save();
    res.status(200).json({ success: true, data: savedProfile });
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOne({ user: userId }).populate("user", "email role");

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const uploadResume = async (req, res) => {
  try {
    const filePath = `/uploads/resumes/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      fileUrl: filePath,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Resume upload failed" });
  }
};
