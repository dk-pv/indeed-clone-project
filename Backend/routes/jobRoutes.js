import express from "express";
import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getAJob,
  getEmployerJobs,
  applyJob,
  getAppliedJobs
} from "../controllers/jobController.js";
import { verifyToken, verifyEmployer } from "../middleware/authMiddleware.js";

const router = express.Router();

// Employer-only routes
router.post("/create", verifyToken, verifyEmployer, createJob);
router.get("/employer/my-jobs", verifyToken, verifyEmployer, getEmployerJobs);
router.put("/update/:id", verifyToken, verifyEmployer, updateJob);
router.delete("/delete/:id", verifyToken, verifyEmployer, deleteJob);

router.post("/apply/:jobId", verifyToken, applyJob);
router.get("/applied", verifyToken, getAppliedJobs); 



router.get("/all", getAllJobs);
router.get("/:id", getAJob);

export default router;
