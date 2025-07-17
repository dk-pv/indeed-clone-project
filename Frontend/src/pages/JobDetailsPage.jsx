// import React, { useState, useEffect, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   MapPin,
//   Bookmark,
//   Share2,
//   MessageSquare,
// } from "lucide-react";
// import axios from "axios";
// import ConfirmApplyModal from "../components/common/ConfirmApplyModal";
// import { AuthContext } from "../context/AuthContext";

// const API_BASE = "http://localhost:9999/api";

// const JobDetailsPage = () => {
//   const { isLoggedIn } = useContext(AuthContext);
//   const { jobId } = useParams(); // ✅ correct param
//   const navigate = useNavigate();

//   const [jobDetails, setJobDetails] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const [appliedJobs, setAppliedJobs] = useState([]);
//   const [savedJobs, setSavedJobs] = useState([]);

//   const [showApplyModal, setShowApplyModal] = useState(false);

//   useEffect(() => {
//     fetchJob();
//     fetchAppliesAndSaves();
//     // eslint-disable-next-line
//   }, [jobId]);

//   const fetchJob = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axios.get(`${API_BASE}/job/${jobId}`);
//       if (data.success) setJobDetails(data.data);
//     } catch (err) {
//       console.error("Error loading job", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAppliesAndSaves = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const headers = { Authorization: `Bearer ${token}` };

//     try {
//       const [appliedRes, savedRes] = await Promise.all([
//         axios.get(`${API_BASE}/job/applied`, { headers }),
//         axios.get(`${API_BASE}/job/saved`, { headers }),
//       ]);
//       if (appliedRes.data.success) {
//         setAppliedJobs(appliedRes.data.data.map((j) => j._id));
//       }
//       if (savedRes.data.success) {
//         setSavedJobs(savedRes.data.savedJobs.map((j) => j._id));
//       }
//     } catch (err) {
//       console.error("Error fetching user data", err);
//     }
//   };

//   const handleApply = () => setShowApplyModal(true);

//   const confirmApply = async () => {
//     setShowApplyModal(false);
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.post(
//         `${API_BASE}/job/apply/${jobId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (data.success) {
//         setAppliedJobs((prev) => [...prev, jobId]);
//         alert("🎉 Applied successfully!");
//       }
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "❌ Failed to apply");
//     }
//   };

//   const toggleSave = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const headers = { Authorization: `Bearer ${token}` };
//       if (savedJobs.includes(jobId)) {
//         await axios.delete(`${API_BASE}/job/saved/${jobId}`, { headers });
//         setSavedJobs((prev) => prev.filter((jd) => jd !== jobId));
//       } else {
//         await axios.post(`${API_BASE}/job/save/${jobId}`, {}, { headers });
//         setSavedJobs((prev) => [...prev, jobId]);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleShare = async () => {
//     const shareUrl = window.location.href;
//     const shareData = {
//       title: jobDetails?.job?.title,
//       text: `Check out this job at ${jobDetails?.company?.name}`,
//       url: shareUrl,
//     };

//     if (navigator.share) {
//       try {
//         await navigator.share(shareData);
//       } catch {
//         console.error("Share failed");
//       }
//     } else {
//       navigator.clipboard.writeText(shareUrl);
//       alert("🔗 Copied link to clipboard!");
//     }
//   };

//   const handleChat = () => {
//     const employerId = jobDetails?.company?.userId;
//     if (employerId) navigate(`/chat/${employerId}`);
//     else alert("Chat not available");
//   };

//   if (loading) {
//     return (
//       <div className="p-8 text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
//         <p className="mt-4 text-gray-500">Loading...</p>
//       </div>
//     );
//   }

//   if (!jobDetails) {
//     return (
//       <div className="p-8 text-center text-red-500">
//         <p>Job not found</p>
//       </div>
//     );
//   }

//   const hasApplied = appliedJobs.includes(jobId);
//   const hasSaved = savedJobs.includes(jobId);

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <ConfirmApplyModal
//         isOpen={showApplyModal}
//         onConfirm={confirmApply}
//         onCancel={() => setShowApplyModal(false)}
//       />
//       <div className="border-b pb-6 mb-6">
//         <h1 className="text-2xl font-bold">{jobDetails.job.title}</h1>
//         <p className="text-gray-600 mb-2">
//           {jobDetails.company.name} • {jobDetails.job.location.city}
//         </p>
//         <p className="text-gray-600 text-sm">
//           Up to ₹{jobDetails.payRange.max}/month
//         </p>
//         <div className="mt-4 flex gap-3">
//           {isLoggedIn && (
//             <>
//               <button
//                 onClick={handleApply}
//                 disabled={hasApplied}
//                 className={`px-6 py-2 rounded-md font-medium uppercase text-sm transition ${
//                   hasApplied
//                     ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                     : "bg-blue-700 text-white hover:bg-blue-800"
//                 }`}
//               >
//                 {hasApplied ? "✅ Applied" : "Apply now"}
//               </button>
//               <button
//                 onClick={toggleSave}
//                 className={`px-4 py-2 rounded-md border font-semibold transition ${
//                   hasSaved
//                     ? "border-blue-500 text-blue-600"
//                     : "border-gray-300 text-gray-700 hover:border-gray-400"
//                 }`}
//               >
//                 <Bookmark className={`w-4 h-4 ${hasSaved ? "fill-blue-600" : ""}`} />
//               </button>
//               <button
//                 onClick={handleShare}
//                 className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:border-gray-400"
//               >
//                 <Share2 className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={handleChat}
//                 className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
//               >
//                 <MessageSquare className="w-4 h-4" />
//                 Chat
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Job Info */}
//       <div className="space-y-6">
//         <div className="flex flex-wrap gap-4">
//           <div className="flex items-center gap-2">
//             <span className="text-lg">₹</span>{" "}
//             <span>{jobDetails.payRange.min} – {jobDetails.payRange.max} / mo</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span>💼</span>{" "}
//             <span>{jobDetails.jobTypes.join(", ")}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <MapPin className="w-5 h-5 text-gray-600" />{" "}
//             <span>{jobDetails.job.location.city}, {jobDetails.job.location.state}</span>
//           </div>
//         </div>

//         {/* Description */}
//         <div>
//           <h3 className="text-lg font-semibold mb-2">Job Description</h3>
//           <p className="text-gray-700">{jobDetails.job.description}</p>
//         </div>

//         {/* Required Skills */}
//         {jobDetails.requiredSkills?.length > 0 && (
//           <div>
//             <h3 className="text-lg font-semibold mb-2">Skills Required</h3>
//             <div className="flex flex-wrap gap-2">
//               {jobDetails.requiredSkills.map((s, idx) => (
//                 <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                   {s}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default JobDetailsPage;



import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Bookmark,
  Share2,
  MessageSquare,
  Building2,
  DollarSign,
  Clock,
  Users,
  Star,
  Flag,
} from "lucide-react";
import axios from "axios";
import ConfirmApplyModal from "../components/common/ConfirmApplyModal";
import { AuthContext } from "../context/AuthContext";

const API_BASE = "http://localhost:9999/api";

const JobDetailsPage = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const { jobId } = useParams(); // ✅ correct param
  const navigate = useNavigate();

  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    fetchJob();
    fetchAppliesAndSaves();
    // eslint-disable-next-line
  }, [jobId]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/job/${jobId}`);
      if (data.success) setJobDetails(data.data);
    } catch (err) {
      console.error("Error loading job", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliesAndSaves = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [appliedRes, savedRes] = await Promise.all([
        axios.get(`${API_BASE}/job/applied`, { headers }),
        axios.get(`${API_BASE}/job/saved`, { headers }),
      ]);
      if (appliedRes.data.success) {
        setAppliedJobs(appliedRes.data.data.map((j) => j._id));
      }
      if (savedRes.data.success) {
        setSavedJobs(savedRes.data.savedJobs.map((j) => j._id));
      }
    } catch (err) {
      console.error("Error fetching user data", err);
    }
  };

  const handleApply = () => setShowApplyModal(true);

  const confirmApply = async () => {
    setShowApplyModal(false);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_BASE}/job/apply/${jobId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setAppliedJobs((prev) => [...prev, jobId]);
        alert("🎉 Applied successfully!");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Failed to apply");
    }
  };

  const toggleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      if (savedJobs.includes(jobId)) {
        await axios.delete(`${API_BASE}/job/saved/${jobId}`, { headers });
        setSavedJobs((prev) => prev.filter((jd) => jd !== jobId));
      } else {
        await axios.post(`${API_BASE}/job/save/${jobId}`, {}, { headers });
        setSavedJobs((prev) => [...prev, jobId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: jobDetails?.job?.title,
      text: `Check out this job at ${jobDetails?.company?.name}`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        console.error("Share failed");
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("🔗 Copied link to clipboard!");
    }
  };

  const handleChat = () => {
    const employerId = jobDetails?.company?.userId;
    if (employerId) navigate(`/chat/${employerId}`);
    else alert("Chat not available");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-500">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!jobDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-red-500">
            <p className="text-lg font-medium">Job not found</p>
            <p className="text-sm text-gray-500 mt-2">The job you're looking for might have been removed or doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const hasApplied = appliedJobs.includes(jobId);
  const hasSaved = savedJobs.includes(jobId);

  return (
    <div className="min-h-screen bg-gray-50">
      <ConfirmApplyModal
        isOpen={showApplyModal}
        onConfirm={confirmApply}
        onCancel={() => setShowApplyModal(false)}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Header Section */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                      {jobDetails.job.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium text-blue-700 hover:underline cursor-pointer">
                        {jobDetails.company.name}
                      </span>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">4.2</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{jobDetails.job.location.city}, {jobDetails.job.location.state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium text-gray-900">
                        ₹{jobDetails.payRange.min.toLocaleString()} - ₹{jobDetails.payRange.max.toLocaleString()} a month
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  {isLoggedIn && (
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={toggleSave}
                        className={`p-2 rounded-full border transition-colors ${
                          hasSaved
                            ? "border-blue-500 bg-blue-50 text-blue-600"
                            : "border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                        title={hasSaved ? "Remove from saved jobs" : "Save job"}
                      >
                        <Bookmark className={`w-5 h-5 ${hasSaved ? "fill-current" : ""}`} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-2 rounded-full border border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        title="Share job"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 rounded-full border border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        title="Report job"
                      >
                        <Flag className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Type Tags */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {jobDetails.jobTypes.map((type, idx) => (
                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {type}
                    </span>
                  ))}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Posted 2 days ago
                  </span>
                </div>
              </div>

              {/* Job Description */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {jobDetails.job.description}
                  </p>
                </div>

                {/* Required Skills */}
                {jobDetails.requiredSkills?.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {jobDetails.requiredSkills.map((skill, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-800 border border-blue-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Apply Card */}
              {isLoggedIn && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <button
                    onClick={handleApply}
                    disabled={hasApplied}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-colors ${
                      hasApplied
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-300"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    }`}
                  >
                    {hasApplied ? "✅ Applied" : "Apply now"}
                  </button>
                  
                  <button
                    onClick={handleChat}
                    className="w-full mt-3 py-2.5 px-4 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message Employer
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    By applying, you agree to our Terms of Service
                  </p>
                </div>
              )}

              {/* Job Details Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Salary</p>
                      <p className="text-sm text-gray-600">
                        ₹{jobDetails.payRange.min.toLocaleString()} - ₹{jobDetails.payRange.max.toLocaleString()} a month
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Job Type</p>
                      <p className="text-sm text-gray-600">{jobDetails.jobTypes.join(", ")}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-600">
                        {jobDetails.job.location.city}, {jobDetails.job.location.state}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;