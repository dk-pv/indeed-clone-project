// import jwt from "jsonwebtoken";

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader && authHeader.startsWith("Bearer ")) {
//     const token = authHeader.split(" ")[1];

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Set user ID on request object (used in job creation)
//       req.user = {
//         _id: decoded._id, // typically set at login time when creating token
//         email: decoded.email, // if needed
//       };

//       next();
//     } catch (error) {
//       console.error("JWT Verify Error:", error);
//       return res.status(401).json({ message: "Invalid token" });
//     }
//   } else {
//     return res.status(401).json({ message: "No token provided" });
//   }
// };

// export default verifyToken;

import jwt from "jsonwebtoken";

// ✅ Named export: verifyToken
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
        _id: decoded._id,
        email: decoded.email,
        role: decoded.role,
        companyName: decoded.companyName
      };

      next();
    } catch (error) {
      console.error("JWT Verify Error:", error);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Authorization token required"
    });
  }
};

// ✅ Named export: verifyEmployer
export const verifyEmployer = (req, res, next) => {
  if (req.user && req.user.role === 'employer') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Employer privileges required"
    });
  }
};

// ✅ Named export: verifyAdmin
export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required"
    });
  }
};
