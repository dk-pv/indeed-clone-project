import express from "express";
import { searchJobs  , getJobTitleSuggestions , getLocationSuggestions} from "../controllers/searchController.js";

const router = express.Router();

router.get("/search", searchJobs);
router.get("/suggest/job-titles", getJobTitleSuggestions);
router.get("/suggest/locations", getLocationSuggestions);         

export default router;
