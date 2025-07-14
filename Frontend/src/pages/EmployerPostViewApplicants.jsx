import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const STATUS_OPTIONS = ["pending", "reject", "finalist", "ready for interview"];

const EmployerPostViewApplicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    console.log("📦 Job ID:", jobId); // ✅ Confirm jobId is NOT undefined
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:9999/api/job/applicants/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("📥 Applicants fetched:", res.data.data); // ✅ See what comes back
      setApplications(res.data.data);
    } catch (err) {
      console.error("❌ Failed to fetch applicants", err);
    }
  };

  const updateStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:9999/api/job/update-status/${applicationId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error("❌ Failed to update status", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-6">Applied Users</h1>

      {applications.length === 0 ? (
        <p className="text-gray-600">No applicants yet for this job.</p>
      ) : (
        <div className="w-full flex flex-col gap-6 items-center">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-md shadow-md w-4/5 h-[350px] p-6 border border-gray-300"
            >
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-medium text-gray-900">
                  {app.user?.name || "Unnamed User"}
                </h2>
                <select
                  className="border rounded px-3 py-1 text-sm"
                  value={app.status || "pending"}
                  onChange={(e) => updateStatus(app._id, e.target.value)}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {app.user?.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {app.user?.phone}
                </p>
                <p>
                  <span className="font-medium">Resume:</span>{" "}
                  <a
                    href={app.user?.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View Resume
                  </a>
                </p>
              </div>

              <p className="text-gray-600 text-sm">
                Status:{" "}
                <span className="font-semibold capitalize">
                  {app.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerPostViewApplicants;
