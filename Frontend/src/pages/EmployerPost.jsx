import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import useAlert from "../hooks/useAlert";
import AlertMessage from "../components/common/AlertMessage";

const MyPosts = () => {
  const [jobs, setJobs] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({
    visible: false,
    jobId: null,
  });

  const navigate = useNavigate();
  const { alert, showAlert, hideAlert } = useAlert();

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      console.log("📦 Token at fetchJobs:", token); // <--- Add this line

      if (!token) {
        console.error("⛔ No token found in localStorage");
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/job/employer/my-jobs`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setJobs(res.data.data);
      } catch (error) {
        console.error(
          "❌ Error fetching jobs:",
          error?.response?.data?.message || error.message
        );
      }
    };

    fetchJobs();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-700";
      case "paused":
        return "text-orange-600";
      case "closed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const requestDelete = (jobId) => {
    setConfirmDelete({ visible: true, jobId });
  };

  const confirmAndDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/job/delete/${confirmDelete.jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showAlert("success", "Job deleted successfully!");
      setJobs((prev) => prev.filter((j) => j._id !== confirmDelete.jobId));
    } catch (err) {
      console.error(err);
      showAlert("error", "Failed to delete job");
    } finally {
      setConfirmDelete({ visible: false, jobId: null });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-normal text-gray-900 mb-1">
            My job posts
          </h1>
          <div className="text-sm text-gray-600">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""}
          </div>
        </div>

        {alert?.visible && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={hideAlert}
          />
        )}

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No job posts yet
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by posting your first job.
            </p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
              onClick={() => navigate("/post-job")}
            >
              Post a job
            </button>
          </div>
        ) : (
          <div className="space-y-0">
            {jobs.map((job, index) => (
              <div
                key={job._id}
                className={`border-b border-gray-200 py-4 hover:bg-gray-50 ${
                  index === 0 ? "border-t" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Job Title and Location */}
                    <div className="mb-2">
                      <h2 className="text-lg font-medium text-blue-700 hover:underline cursor-pointer mb-1">
                        {job.job?.title || "Untitled Job"}
                      </h2>
                      <div className="text-sm text-gray-600">
                        {job.job?.location?.city || "N/A"},{" "}
                        {job.job?.location?.area || "N/A"}
                      </div>
                    </div>

                    {/* Job Details in One Line */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                      <span>{job.jobTypes?.join(", ") || "N/A"}</span>
                      <span>•</span>
                      <span>{job.schedules?.join(", ") || "N/A"}</span>
                      <span>•</span>
                      <span>
                        ₹{job.payRange?.min?.toLocaleString() || 0} - ₹
                        {job.payRange?.max?.toLocaleString() || 0}
                      </span>
                    </div>

                    {/* Posted Date and Status */}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">
                        Posted {format(new Date(job.createdAt), "MMM d, yyyy")}
                      </span>
                      <span
                        className={`font-medium ${getStatusColor(job.status)}`}
                      >
                        {job.status || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 ml-4">
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      onClick={() => navigate(`/edit-job/${job._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                      onClick={() => requestDelete(job._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      onClick={() => {
                        if (job._id) {
                          navigate(`/job-applicants/${job._id}`);
                        } else {
                          console.error("❌ job._id is missing", job);
                        }
                      }}
                    >
                      View Applicants
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmDelete.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md w-full max-w-md shadow-xl border border-gray-200">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Delete job post
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-6 ml-11">
                Are you sure you want to delete this job post? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded border border-gray-300"
                  onClick={() =>
                    setConfirmDelete({ visible: false, jobId: null })
                  }
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                  onClick={confirmAndDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
