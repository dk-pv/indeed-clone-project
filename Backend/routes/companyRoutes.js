import express from "express";
import {
  getCompanyProfile,
  createOrUpdateCompanyProfile,
  checkCompanyProfileExists,
  getCompanyProfileByUserId
} from "../controllers/companyController.js";
import { verifyToken , verifyEmployer } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET and POST /api/company
router
  .route("/")
  .get( verifyToken , verifyEmployer ,getCompanyProfile)
  .post( verifyToken , verifyEmployer ,createOrUpdateCompanyProfile);
router.get("/exists", verifyToken, verifyEmployer, checkCompanyProfileExists);
router.get("/:userId", verifyToken, getCompanyProfileByUserId);

export default router;
