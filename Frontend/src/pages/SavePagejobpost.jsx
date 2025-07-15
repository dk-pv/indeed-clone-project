import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAlert from "../hooks/useAlert";

const SavePagejobpost = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const { showAlert } = useAlert(); // optional
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const res = await axios.get("http://localhost:9999/api/job/saved", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSavedJobs(res.data.savedJobs);
    } catch (err) {
      console.error("Error fetching saved jobs:", err.message);
    }
  };

  const handleRemove = async (jobId) => {
    try {
      await axios.delete(`http://localhost:9999/api/job/saved/${jobId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
      showAlert("Removed from saved jobs", "success");
    } catch (err) {
      console.error("Remove error:", err.message);
      showAlert("Failed to remove", "error");
    }
  };

  const handleJobClick = (jobId) => {
    navigate("/", { state: { selectedJobId: jobId } });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>

      {savedJobs.length === 0 ? (
        <p>No saved jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((jobItem) => (
            <div
              key={jobItem._id}
              className="border p-4 rounded-xl shadow-sm flex justify-between items-start"
              onClick={() => handleJobClick(jobItem._id)}
            >
              <div>
                <h2 className="text-xl font-semibold">{jobItem.job?.title}</h2>
                <p className="text-gray-600">{jobItem.company?.name}</p>
                <p className="text-sm mt-1">
                  Type: {jobItem.jobTypes?.join(", ")}
                </p>
                <p className="text-sm">
                  Schedule: {jobItem.schedules?.join(", ")}
                </p>
                <p className="text-sm">
                  Pay:{" "}
                  {jobItem.payRange.min && jobItem.payRange.max
                    ? `${jobItem.payRange.min} - ${jobItem.payRange.max} ${jobItem.payRange.currency}`
                    : "Not specified"}
                </p>
                <p className="text-sm">
                  Timeline: {jobItem.recruitmentTimeline}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  {jobItem.job?.description?.slice(0, 80)}...
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation(); //  prevent bubbling to card
                  handleRemove(jobItem._id);
                }}
                className="text-red-600 hover:underline ml-4"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavePagejobpost;
