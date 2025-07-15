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
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Saved Jobs
          </h1>
          <p className="text-gray-600">
            {savedJobs.length} job{savedJobs.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No saved jobs yet
              </h3>
              <p className="text-gray-600">Jobs you save will appear here</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((jobItem) => (
              <div
                key={jobItem._id}
                onClick={() => handleJobClick(jobItem._id)}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
              >
                <div className="p-6">
                  {/* Job Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-1">
                        {jobItem.job?.title}
                      </h2>
                      <p className="text-gray-700 font-medium mb-2">
                        {jobItem.company?.name}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>{jobItem.jobTypes?.join(", ")}</span>
                        <span>•</span>
                        <span>{jobItem.schedules?.join(", ")}</span>
                        <span>•</span>
                        <span>
                          {jobItem.payRange.min && jobItem.payRange.max
                            ? `${jobItem.payRange.min} - ${jobItem.payRange.max} ${jobItem.payRange.currency}`
                            : "Salary not specified"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(jobItem._id);
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline ml-4"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Timeline */}
                  <div className="mb-3">
                    <span className="text-sm text-gray-600">
                      <strong>Timeline:</strong> {jobItem.recruitmentTimeline}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="border-t pt-4">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {jobItem.job?.description?.slice(0, 150)}...
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavePagejobpost;
