// import express from "express";
// import {
//   createJob,
//   updateJob,
//   deleteJob,
//   getAllJobs,
//   getAJob,
//   getEmployerJobs,
//   applyJob,
//   getAppliedJobs ,
//   saveJob , 
//   removeSavedJob,
//   getSavedJobs
// } from "../controllers/jobController.js";
// import { verifyToken, verifyEmployer } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // Employer-only routes
// router.post("/create", verifyToken, verifyEmployer, createJob);
// router.get("/employer/my-jobs", verifyToken, verifyEmployer, getEmployerJobs);
// router.put("/update/:id", verifyToken, verifyEmployer, updateJob);
// router.delete("/delete/:id", verifyToken, verifyEmployer, deleteJob);
// router.get("/all", getAllJobs);
// router.get("/:id", getAJob);


// router.post("/apply/:jobId", verifyToken, applyJob);
// router.get("/applied", verifyToken, getAppliedJobs); 


// router.post("/save/:jobId", verifyToken, saveJob);
// router.delete("/saved/:jobId", verifyToken, removeSavedJob);
// router.get("/save/all", verifyToken, getSavedJobs);



// export default router;



import express from "express";
import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getAJob,
  getEmployerJobs,
  applyJob,
  getAppliedJobs,
  saveJob,
  removeSavedJob,
  getSavedJobs
} from "../controllers/jobController.js";
import { verifyToken, verifyEmployer } from "../middleware/authMiddleware.js";

const router = express.Router();

// Employer-only routes
router.post("/create", verifyToken, verifyEmployer, createJob);
router.get("/employer/my-jobs", verifyToken, verifyEmployer, getEmployerJobs);
router.put("/update/:id", verifyToken, verifyEmployer, updateJob);
router.delete("/delete/:id", verifyToken, verifyEmployer, deleteJob);

// Public or user routes
router.get("/all", getAllJobs);
router.post("/apply/:jobId", verifyToken, applyJob);
router.get("/applied", verifyToken, getAppliedJobs);

router.post("/save/:jobId", verifyToken, saveJob);
router.delete("/saved/:jobId", verifyToken, removeSavedJob);
router.get("/saved", verifyToken, getSavedJobs); // ✅ Correct path

// Keep this LAST to avoid route conflicts
router.get("/:id", getAJob);

export default router;
