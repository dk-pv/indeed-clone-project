import Company from "../models/companyModel.js";
import asyncHandler from "express-async-handler";


// Get current user's company profile
export const getCompanyProfile = async (req, res) => {
  const company = await Company.findOne({ user: req.user._id });
  if (!company) {
    return res.status(404).json({ success: false, message: "Company profile not found" });
  }
  res.status(200).json({ success: true, data: company });
};




// Create or update company profile
export const createOrUpdateCompanyProfile = async (req, res) => {
  const { name, strength, location, email, field } = req.body;

  let company = await Company.findOne({ user: req.user._id });

  if (company) {
    // Update
    company.name = name;
    company.strength = strength;
    company.location = location;
    company.email = email;
    company.field = field;
    await company.save();
    return res.status(200).json({ success: true, data: company });
  }

  // Create
  company = await Company.create({
    user: req.user._id,
    name,
    strength,
    location,
    email,
    field,
  });

  res.status(201).json({ success: true, data: company });
};




// controllers/companyController.js
export const checkCompanyProfileExists = asyncHandler(async (req, res) => {
  const profile = await Company.findOne({ user: req.user._id });

  if (profile) {
    return res.json({ exists: true });
  } else {
    return res.json({ exists: false });
  }
});
