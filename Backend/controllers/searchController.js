import Job from "../models/jobModel.js";

export const searchJobs = async (req, res) => {
  const { job, location } = req.query;
  const filter = { isDeleted: false };
  if (job) filter["job.title"] = { $regex: job, $options: "i" };
  if (location)
    filter["job.location.city"] = { $regex: location, $options: "i" };

  try {
    const jobs = await Job.find(filter);
    res.status(200).json({ success: true, data: jobs });
  } catch (err) {
    console.error("Job search failed", err);
    res.status(500).json({ success: false, error: "Search failed" });
  }
};


export const getJobTitleSuggestions = async (req, res) => {
  const { query } = req.query;

  try {
    const jobs = await Job.find({
      "job.title": { $regex: query, $options: "i" },
      isDeleted: false,
    })
      .limit(10)
      .select("job.title");

    const uniqueTitles = [...new Set(jobs.map((job) => job.job.title))];

    res.status(200).json({ success: true, data: uniqueTitles });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching job titles" });
  }
};

export const getLocationSuggestions = async (req, res) => {
  const { query } = req.query;

  try {
    const jobs = await Job.find({
      "job.location.city": { $regex: query, $options: "i" },
      isDeleted: false, // ✅ only active jobs
    })
      .limit(10)
      .select("job.location.city");

    const uniqueCities = [...new Set(jobs.map((job) => job.job.location.city))];

    res.status(200).json({ success: true, data: uniqueCities });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching locations" });
  }
};
