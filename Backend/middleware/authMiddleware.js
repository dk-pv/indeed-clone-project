import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // ✅ Import your User model

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token missing or improperly formatted",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token || token.split(".").length !== 3) {
    return res.status(401).json({
      success: false,
      message: "Malformed token format",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch full user from DB using decoded._id
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user; // ✅ Now req.user has savedJobs and can be saved
    next();
  } catch (error) {
    console.error("JWT Verify Error:", error.message, "| Token:", token);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const verifyEmployer = (req, res, next) => {
  if (req.user && req.user.role === "employer") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Employer privileges required",
    });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required",
    });
  }
};
