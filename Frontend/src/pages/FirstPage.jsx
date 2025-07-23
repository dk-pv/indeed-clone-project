// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import {
//   Search,
//   MapPin,
//   ChevronUp,
//   ChevronDown,
//   Bookmark,
//   Share2,
//   User,
//   MessageSquare,
//   Briefcase,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import mainImg from "../assets/main.png";
// import FirstFooter from "../components/FirstFooter";
// import { AuthContext } from "../context/AuthContext";
// import axiosInstance from "../../utils/axiosInstance";
// import { useNavigate } from "react-router-dom";
// import ConfirmApplyModal from "../components/common/ConfirmApplyModal";

// // API endpoints
// const API_BASE = "http://localhost:9999/api";

// const FirstPage = () => {
//   // Search and UI state
//   const [jobQuery, setJobQuery] = useState("");
//   const [locationQuery, setLocationQuery] = useState("");
//   const [isOpen, setIsOpen] = useState(false);

//   // Job data state
//   const [jobList, setJobList] = useState([]);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [selectedJobDetails, setSelectedJobDetails] = useState(null);
//   const [loadingJobDetails, setLoadingJobDetails] = useState(false);
//   // Pagination for jobs
//   const [jobPage, setJobPage] = useState(1);
//   const [jobTotalPages, setJobTotalPages] = useState(1);

//   // Auth context
//   const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

//   const [jobSuggestions, setJobSuggestions] = useState([]);
//   const [locationSuggestions, setLocationSuggestions] = useState([]);

//   const [userRole, setUserRole] = useState(null);
//   const [profileList, setProfileList] = useState([]);
//   // Pagination for profiles
//   const [profilePage, setProfilePage] = useState(1);
//   const [profileTotalPages, setProfileTotalPages] = useState(1);

//   const [appliedJobIds, setAppliedJobIds] = useState([]);
//   const [showApplyModal, setShowApplyModal] = useState(false);
//   const [selectedJobIdToApply, setSelectedJobIdToApply] = useState(null);
//   const [savedJobIds, setSavedJobIds] = useState([]);

//   const navigate = useNavigate();

//   const confirmApplyHandler = async () => {
//     setShowApplyModal(false);

//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.post(
//         `http://localhost:9999/api/job/apply/${selectedJobIdToApply}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         alert("🎉 Application submitted!");
//         setAppliedJobIds((prev) => [...prev, selectedJobIdToApply]);
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || "Something went wrong";
//       alert("⚠️ " + message);

//       const redirectTo = error.response?.data?.redirectTo;
//       if (redirectTo) {
//         navigate(redirectTo);
//       }
//     }
//   };

//   const handleApplyJob = (jobId) => {
//     setSelectedJobIdToApply(jobId);
//     setShowApplyModal(true);
//   };

//   const fetchAppliedJobs = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const res = await axios.get("http://localhost:9999/api/job/applied", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.data.success) {
//         setAppliedJobIds(res.data.data.map((job) => job._id) || []);
//       }
//     } catch (err) {
//       console.error("❌ Failed to fetch applied jobs", err);
//     }
//   };

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (jobQuery.trim()) {
//         axios
//           .get(`${API_BASE}/search/suggest/job-titles?query=${jobQuery}`)
//           .then((res) => setJobSuggestions(res.data.data || []))
//           .catch(() => setJobSuggestions([]));
//       } else {
//         setJobSuggestions([]);
//       }
//     }, 300);

//     return () => clearTimeout(delayDebounce);
//   }, [jobQuery]);

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (locationQuery.trim()) {
//         axios
//           .get(`${API_BASE}/search/suggest/locations?query=${locationQuery}`)
//           .then((res) => setLocationSuggestions(res.data.data || []))
//           .catch(() => setLocationSuggestions([]));
//       } else {
//         setLocationSuggestions([]);
//       }
//     }, 300);

//     return () => clearTimeout(delayDebounce);
//   }, [locationQuery]);

//   // Detect user role from localStorage
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const user = JSON.parse(storedUser);
//         setIsLoggedIn(true);
//         setUserRole(user?.role);
//       } catch (error) {
//         localStorage.removeItem("user");
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (isLoggedIn && userRole === "employer") {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         try {
//           const user = JSON.parse(storedUser);
//           if (user.token) {
//             fetchAllProfiles(user.token, profilePage);
//           } else {
//             console.warn("⚠️ Token missing in stored user.");
//           }
//         } catch (err) {
//           console.error("⚠️ Failed to parse user from localStorage:", err);
//         }
//       }
//     }
//   }, [isLoggedIn, userRole, profilePage]);

//   const fetchAllProfiles = async (token, page = 1) => {
//     try {
//       const response = await axiosInstance.get(
//         `/profile/all-profiles?page=${page}&limit=10`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       console.log("Fetched profiles from API:", response.data);

//       if (response.data.success) {
//         setProfileList(response.data.data);
//         setProfileTotalPages(response.data.pages || 1);
//       }
//     } catch (error) {
//       console.error("Failed to fetch profiles:", error);
//     }
//   };

//   const fetchSavedJobs = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const res = await axios.get("http://localhost:9999/api/job/saved", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.data.success && Array.isArray(res.data.savedJobs)) {
//         const ids = res.data.savedJobs.map((job) => job._id);
//         setSavedJobIds(ids);
//       }
//     } catch (err) {
//       console.error("⚠️ Error fetching saved jobs", err);
//     }
//   };

//   const toggleSaveJob = async (jobId) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const isSaved = savedJobIds.includes(jobId);

//     try {
//       if (isSaved) {
//         await axios.delete(`http://localhost:9999/api/job/saved/${jobId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
//       } else {
//         await axios.post(
//           `http://localhost:9999/api/job/save/${jobId}`,
//           {},
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setSavedJobIds((prev) => [...prev, jobId]);
//       }
//     } catch (err) {
//       console.error("⚠️ Error saving/removing job", err);
//     }
//   };

//   useEffect(() => {
//     checkAuthStatus();
//     fetchAllJobs(jobPage);
//     if (isLoggedIn) fetchAppliedJobs();
//   }, [jobPage]);

//   useEffect(() => {
//     if (isLoggedIn && userRole !== "employer") {
//       fetchSavedJobs();
//     }
//   }, [isLoggedIn, userRole]);

//   const filteredProfiles = profileList.filter((profile) => {
//     const titleMatch = (profile?.skills || []).some((s) =>
//       s.toLowerCase().includes(jobQuery.toLowerCase())
//     );
//     const locationMatch = profile?.personalInfo?.location
//       ?.toLowerCase()
//       .includes(locationQuery.toLowerCase());

//     return (!jobQuery || titleMatch) && (!locationQuery || locationMatch);
//   });

//   useEffect(() => {
//     if (jobQuery.trim() === "" && locationQuery.trim() === "") {
//       fetchAllJobs(jobPage);
//     }
//   }, [jobQuery, locationQuery, jobPage]);

//   const checkAuthStatus = () => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const user = JSON.parse(storedUser);
//         setIsLoggedIn(true);
//         setUserRole(user?.role);
//         if (user?.token && user?.role === "employer") {
//           fetchAllProfiles(user.token, profilePage);
//         }
//       } catch (error) {
//         console.error("Failed to parse stored user:", error);
//         localStorage.removeItem("user");
//       }
//     }
//   };

//   const fetchAllJobs = async (page = 1) => {
//     try {
//       const response = await axios.get(
//         `${API_BASE}/job/all-jobs?page=${page}&limit=10`
//       );
//       if (response.data.success && response.data.data) {
//         setJobList(response.data.data);
//         setJobTotalPages(response.data.pages || 1);
//         // Auto-select first job if available and user is logged in
//         if (response.data.data.length > 0 && isLoggedIn) {
//           handleJobClick(response.data.data[0]);
//         }
//       }
//     } catch (error) {
//       console.error("Failed to fetch jobs:", error);
//     }
//   };

//   const handleJobClick = async (job) => {
//     if (!job?._id) return;

//     setSelectedJob(job);
//     setLoadingJobDetails(true);

//     try {
//       const response = await axios.get(`${API_BASE}/job/${job._id}`);
//       if (response.data.success) {
//         setSelectedJobDetails(response.data.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch job details:", error);
//       setSelectedJobDetails(null);
//     } finally {
//       setLoadingJobDetails(false);
//     }
//   };

//   // Handle search
//   const handleSearch = async () => {
//     if (!jobQuery.trim() && !locationQuery.trim()) {
//       fetchAllJobs(jobPage);
//       return;
//     }

//     try {
//       const response = await axios.get(`${API_BASE}/search/search`, {
//         params: {
//           job: jobQuery,
//           location: locationQuery,
//           page: jobPage,
//           limit: 10,
//         },
//       });

//       if (response.data.success) {
//         setJobList(response.data.data);
//         setJobTotalPages(response.data.pages || 1);
//         // Auto-select first result if available
//         if (response.data.data.length > 0) {
//           handleJobClick(response.data.data[0]);
//         } else {
//           setSelectedJob(null);
//           setSelectedJobDetails(null);
//         }
//       }
//     } catch (error) {
//       console.error("Search failed:", error);
//     }
//   };

//   const handleShareJob = async (jobId) => {
//     if (!jobId) return;

//     const shareUrl = `${window.location.origin}/job-details/${jobId}`;
//     const shareData = {
//       title: selectedJobDetails?.job?.title || "Job Opportunity",
//       text: `Check out this job: ${selectedJobDetails?.job?.title} at ${selectedJobDetails?.company?.name}`,
//       url: shareUrl,
//     };

//     try {
//       if (navigator.share) {
//         // Use Web Share API if available
//         await navigator.share(shareData);
//       } else {
//         // Fallback: Copy URL to clipboard
//         await navigator.clipboard.writeText(shareUrl);
//         alert("🔗 Job link copied to clipboard!");
//       }
//     } catch (err) {
//       console.error("⚠️ Failed to share job:", err);
//       alert("⚠️ Failed to share job. Please try again.");
//     }
//   };

//   // Handle key press
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       setJobPage(1); // Reset to first page on new search
//       handleSearch();
//     }
//   };

//   // Pagination Handlers
//   const handleJobPageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= jobTotalPages) {
//       setJobPage(newPage);
//     }
//   };

//   const handleProfilePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= profileTotalPages) {
//       setProfilePage(newPage);
//     }
//   };

//   // Trending data
//   const trendingData = {
//     "Trending Searches": ["Account Mumbai, Maharashtra"],
//     "Trending Jobs": [
//       "Net Remote",
//       "Fresher Tamil Nadu",
//       "Content Writer Remote",
//     ],
//     "Popular Cities": ["Ludhiana, Punjab", "Kolkata, West Bengal"],
//     "Popular Companies": ["American Express"],
//   };

//   // Toggle trending dropdown
//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
//       <ConfirmApplyModal
//         isOpen={showApplyModal}
//         onConfirm={confirmApplyHandler}
//         onCancel={() => setShowApplyModal(false)}
//       />

//       {/* Main Content */}
//       <div className="w-full max-w-6xl mx-auto px-4 py-8 flex-grow">
//         {/* Search Bar - Only for logged-in non-employer users */}
//         {isLoggedIn && userRole !== "employer" && (
//           <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-visible mb-8 relative">
//             <div className="flex flex-col md:flex-row">
//               {/* Job Title Input */}
//               <div className="flex-1 relative">
//                 <div className="flex items-center px-4 py-4 border-b md:border-b-0 md:border-r border-gray-200">
//                   <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
//                   <input
//                     type="text"
//                     value={jobQuery}
//                     onChange={(e) => setJobQuery(e.target.value)}
//                     placeholder="Job title, keywords, or company"
//                     onKeyPress={handleKeyPress}
//                     className="w-full text-gray-700 placeholder-gray-500 bg-transparent border-none outline-none text-base"
//                   />
//                 </div>
//                 {/* Job Suggestions Dropdown */}
//                 {jobSuggestions.length > 0 && (
//                   <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl z-[100] max-h-64 overflow-y-auto rounded-b-md">
//                     {jobSuggestions.map((item, idx) => (
//                       <div
//                         key={idx}
//                         onClick={() => {
//                           setJobQuery(item);
//                           setJobSuggestions([]);
//                         }}
//                         className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
//                       >
//                         <Search className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
//                         <span className="text-gray-700 text-sm">{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Location Input */}
//               <div className="flex-1 relative">
//                 <div className="flex items-center px-4 py-4 border-b md:border-b-0 md:border-r border-gray-200">
//                   <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
//                   <input
//                     type="text"
//                     value={locationQuery}
//                     onChange={(e) => setLocationQuery(e.target.value)}
//                     placeholder="City or location"
//                     onKeyPress={handleKeyPress}
//                     className="w-full text-gray-700 placeholder-gray-500 bg-transparent border-none outline-none text-base"
//                   />
//                 </div>
//                 {/* Location Suggestions Dropdown */}
//                 {locationSuggestions.length > 0 && (
//                   <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl z-[100] max-h-64 overflow-y-auto rounded-b-md">
//                     {locationSuggestions.map((city, idx) => (
//                       <div
//                         key={idx}
//                         onClick={() => {
//                           setLocationQuery(city);
//                           setLocationSuggestions([]);
//                         }}
//                         className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
//                       >
//                         <MapPin className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
//                         <span className="text-gray-700 text-sm">{city}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Search Button */}
//               <div className="flex-shrink-0">
//                 <button
//                   onClick={() => {
//                     setJobPage(1); // Reset to first page on new search
//                     handleSearch();
//                   }}
//                   className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                 >
//                   Find jobs
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Welcome Page for Non-Logged In Users */}
//         {!isLoggedIn && (
//           <>
//             <div className="w-full mb-8">
//               <img
//                 src={mainImg}
//                 alt="Main Visual"
//                 className="max-w-full h-auto mx-auto"
//               />
//             </div>

//             <div className="text-center mb-8">
//               <h1 className="text-4xl font-bold text-gray-800 mb-4">
//                 Welcome to Indeed!
//               </h1>
//               <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//                 Create an account or sign in to see your personalised job
//                 recommendations.
//               </p>

//               <Link to="/signin">
//                 <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 mb-8 inline-flex items-center">
//                   Get Started
//                   <svg
//                     className="w-5 h-5 ml-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </button>
//               </Link>

//               <div className="space-y-4 text-gray-600">
//                 <div>
//                   <a
//                     href="#"
//                     className="text-blue-600 hover:text-blue-700 underline font-medium"
//                   >
//                     Post your resume
//                   </a>
//                   <span className="text-gray-500">
//                     {" "}
//                     - It only takes a few seconds
//                   </span>
//                 </div>
//                 <div>
//                   <Link
//                     to="/postJob"
//                     className="text-blue-600 hover:text-blue-700 underline font-medium"
//                   >
//                     Post a job on Indeed
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {isLoggedIn && userRole === "employer" && (
//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//             {/* Profile Cards (Left) */}
//             <div className="lg:col-span-2 space-y-4 max-h-screen overflow-y-auto">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                 Matched Candidates
//               </h2>

//               {filteredProfiles.length > 0 ? (
//                 filteredProfiles.map((profile) => (
//                   <div
//                     key={profile._id}
//                     onClick={() => setSelectedJob(profile)}
//                     className={`bg-white border rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
//                       selectedJob?._id === profile._id
//                         ? "border-blue-500 bg-blue-50"
//                         : "border-gray-200 hover:border-gray-300"
//                     }`}
//                   >
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
//                         {profile.personalInfo?.firstName}{" "}
//                         {profile.personalInfo?.lastName}
//                       </h3>
//                       <User className="w-5 h-5 text-gray-400" />
//                     </div>

//                     <p className="text-gray-600 text-sm mb-2">
//                       {profile.personalInfo?.location}
//                     </p>

//                     <div className="flex justify-between items-center text-sm text-gray-500">
//                       <span>{profile.skills?.length || 0} skills</span>
//                       <span>{profile.education?.[0]?.degree || "—"}</span>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center text-gray-500 py-20">
//                   No matching profiles found.
//                 </div>
//               )}

//               {/* Pagination for Profiles */}
//               {filteredProfiles.length > 0 && profileTotalPages > 1 && (
//                 <div className="flex justify-center items-center gap-2 mt-4">
//                   <button
//                     onClick={() => handleProfilePageChange(profilePage - 1)}
//                     disabled={profilePage === 1}
//                     className={`px-4 py-2 rounded-md ${
//                       profilePage === 1
//                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                         : "bg-blue-600 text-white hover:bg-blue-700"
//                     }`}
//                   >
//                     Previous
//                   </button>
//                   {[...Array(profileTotalPages).keys()].map((num) => (
//                     <button
//                       key={num + 1}
//                       onClick={() => handleProfilePageChange(num + 1)}
//                       className={`px-4 py-2 rounded-md ${
//                         profilePage === num + 1
//                           ? "bg-blue-600 text-white"
//                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                       }`}
//                     >
//                       {num + 1}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => handleProfilePageChange(profilePage + 1)}
//                     disabled={profilePage === profileTotalPages}
//                     className={`px-4 py-2 rounded-md ${
//                       profilePage === profileTotalPages
//                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                         : "bg-blue-600 text-white hover:bg-blue-700"
//                     }`}
//                   >
//                     Next
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Profile Details (Right) - Show only when profiles exist */}
//             {filteredProfiles.length > 0 && (
//               <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200">
//                 {selectedJob ? (
//                   <div className="p-6">
//                     <h1 className="text-2xl font-bold text-gray-800 mb-2">
//                       {selectedJob.personalInfo?.firstName}{" "}
//                       {selectedJob.personalInfo?.lastName}
//                     </h1>
//                     <br />
//                     <p className="text-gray-600 mb-2">
//                       {selectedJob.personalInfo?.email}{" "}
//                     </p>

//                     <p className="text-gray-600 mb-2">
//                       {selectedJob.personalInfo?.location}
//                     </p>
//                     <p className="text-gray-600 text-sm mb-4">
//                       {selectedJob.personalInfo?.phone}
//                     </p>
//                     <br />
//                     {selectedJob.skills?.length > 0 && (
//                       <div className="mb-6">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                           Skills
//                         </h3>
//                         <div className="flex flex-wrap gap-2">
//                           {selectedJob.skills.map((skill, index) => (
//                             <span
//                               key={index}
//                               className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
//                             >
//                               {skill}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     <br />
//                     {selectedJob.education?.length > 0 && (
//                       <div className="mb-6">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                           Education
//                         </h3>
//                         {selectedJob.education.map((edu, idx) => (
//                           <div key={idx} className="text-sm text-gray-700 mb-1">
//                             🎓 {edu.degree}, {edu.school} ({edu.graduationYear})
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                     {selectedJob.industryPreference && (
//                       <div className="mb-6">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                           <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
//                           Industry Preference
//                         </h3>
//                         <p className="text-gray-600">
//                           {selectedJob.industryPreference}
//                         </p>
//                       </div>
//                     )}
//                     <br />
//                     {selectedJob.resume?.previewUrl && (
//                       <div className="mt-4">
//                         📄 Resume:{" "}
//                         <a
//                           href={`https://docs.google.com/viewer?url=${encodeURIComponent(
//                             selectedJob.resume.previewUrl
//                           )}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 underline"
//                         >
//                           View Resume
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="p-8 text-center text-gray-500">
//                     <p>Select a candidate to view profile</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Job List and Details for Logged In Users */}
//         {isLoggedIn && userRole !== "employer" && (
//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//             {/* Job List */}
//             <div className="lg:col-span-2 space-y-4 max-h-screen overflow-y-auto">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                 Jobs for you
//               </h2>
//               {jobList.length > 0 ? (
//                 jobList.map((job) => (
//                   <div
//                     key={job._id}
//                     onClick={() => handleJobClick(job)}
//                     className={`bg-white border rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
//                       selectedJob?._id === job._id
//                         ? "border-blue-500 bg-blue-50"
//                         : "border-gray-200 hover:border-gray-300"
//                     }`}
//                   >
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
//                         {job.job?.title}
//                       </h3>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation(); // prevent job select on click
//                           toggleSaveJob(job._id);
//                         }}
//                       >
//                         {savedJobIds.includes(job._id) ? (
//                           <Bookmark className="w-5 h-5 text-blue-600 fill-blue-600" />
//                         ) : (
//                           <Bookmark className="w-5 h-5 text-gray-400 hover:text-gray-600" />
//                         )}
//                       </button>
//                     </div>

//                     <p className="text-gray-600 text-sm mb-2">
//                       {job.company?.name}
//                     </p>

//                     <p className="text-gray-600 text-sm mb-2 flex items-center">
//                       <MapPin className="w-4 h-4 mr-1" />
//                       {job.job?.location?.city}
//                     </p>
//                     <p className="text-gray-700 text-sm mb-3 line-clamp-2">
//                       {job.job?.description}
//                     </p>

//                     <div className="flex justify-between items-center text-sm text-gray-500">
//                       <span>
//                         ₹{job.payRange?.min} - ₹{job.payRange?.max}
//                       </span>
//                       <span>{job.jobTypes?.join(", ")}</span>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center text-gray-500 py-20">
//                   No job postings found.
//                 </div>
//               )}

//               {/* Pagination for Jobs */}
//               {jobList.length > 0 && jobTotalPages > 1 && (
//                 <div className="flex justify-center items-center gap-2 mt-4">
//                   <button
//                     onClick={() => handleJobPageChange(jobPage - 1)}
//                     disabled={jobPage === 1}
//                     className={`px-4 py-2 rounded-md ${
//                       jobPage === 1
//                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                         : "bg-blue-600 text-white hover:bg-blue-700"
//                     }`}
//                   >
//                     Previous
//                   </button>
//                   {[...Array(jobTotalPages).keys()].map((num) => (
//                     <button
//                       key={num + 1}
//                       onClick={() => handleJobPageChange(num + 1)}
//                       className={`px-4 py-2 rounded-md ${
//                         jobPage === num + 1
//                           ? "bg-blue-600 text-white"
//                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                       }`}
//                     >
//                       {num + 1}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => handleJobPageChange(jobPage + 1)}
//                     disabled={jobPage === jobTotalPages}
//                     className={`px-4 py-2 rounded-md ${
//                       jobPage === jobTotalPages
//                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                         : "bg-blue-600 text-white hover:bg-blue-700"
//                     }`}
//                   >
//                     Next
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Job Details */}
//             <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200">
//               {loadingJobDetails ? (
//                 <div className="p-8 text-center">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                   <p className="text-gray-500 mt-4">Loading job details...</p>
//                 </div>
//               ) : selectedJobDetails ? (
//                 <div className="p-6">
//                   {/* Job Header */}
//                   <div className="border-b border-gray-200 pb-6 mb-6">
//                     <h1 className="text-2xl font-bold text-gray-800 mb-2">
//                       {selectedJobDetails.job?.title}
//                     </h1>
//                     <p className="text-gray-600 mb-2">
//                       {selectedJobDetails.company?.name} •{" "}
//                       {selectedJobDetails.job?.location?.city}
//                     </p>
//                     <p className="text-gray-600 text-sm mb-4">
//                       Up to ₹{selectedJobDetails.payRange?.max} a month
//                     </p>

//                     {/* Action Buttons */}
//                     <div className="flex gap-3">
//                       <button
//                         disabled={
//                           !selectedJobDetails?._id ||
//                           appliedJobIds.includes(selectedJobDetails._id)
//                         }
//                         onClick={() => handleApplyJob(selectedJobDetails._id)}
//                         className={`${
//                           !selectedJobDetails?._id ||
//                           appliedJobIds.includes(selectedJobDetails._id)
//                             ? "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300"
//                             : "bg-blue-700 hover:bg-blue-800 text-white border border-blue-700 hover:border-blue-800 shadow-sm hover:shadow-md"
//                         } font-medium px-8 py-3 rounded-md transition-all duration-200 text-sm uppercase tracking-wide min-w-[140px]`}
//                       >
//                         {appliedJobIds.includes(selectedJobDetails._id)
//                           ? "✅ Applied"
//                           : "Apply now"}
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleSaveJob(selectedJobDetails._id);
//                         }}
//                         className={`border font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${
//                           savedJobIds.includes(selectedJobDetails._id)
//                             ? "border-blue-500 text-blue-600"
//                             : "border-gray-300 text-gray-700 hover:border-gray-400"
//                         }`}
//                       >
//                         <Bookmark
//                           className={`w-4 h-4 ${
//                             savedJobIds.includes(selectedJobDetails._id)
//                               ? "fill-blue-600"
//                               : ""
//                           }`}
//                         />
//                       </button>
//                       <button
//                         onClick={() => handleShareJob(selectedJobDetails._id)}
//                         className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
//                       >
//                         <Share2 className="w-4 h-4" />
//                       </button>

//                       <button
//                         className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
//                         onClick={() => {
//                           const employerId = selectedJobDetails.company?.userId;
//                           if (employerId) {
//                             navigate(`/chat/${employerId}`);
//                           } else {
//                             console.error(
//                               "❌ Employer ID not found in job details"
//                             );
//                             alert("Chat unavailable: Employer info missing");
//                           }
//                         }}
//                       >
//                         <svg
//                           className="w-4 h-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
//                           />
//                         </svg>
//                         Contact Employer
//                       </button>
//                     </div>
//                   </div>

//                   {/* Job Details */}
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                         Job details
//                       </h3>

//                       {/* Pay */}
//                       <div className="flex items-start gap-3 mb-4">
//                         <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <span className="text-gray-600 text-sm">₹</span>
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800">Pay</p>
//                           <p className="text-gray-600">
//                             ₹{selectedJobDetails.payRange?.min} - ₹
//                             {selectedJobDetails.payRange?.max} a month
//                           </p>
//                         </div>
//                       </div>

//                       {/* Job Type */}
//                       <div className="flex items-start gap-3 mb-4">
//                         <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <span className="text-gray-600 text-sm">💼</span>
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800">Job type</p>
//                           <div className="flex gap-2 mt-1">
//                             {selectedJobDetails.jobTypes?.map((type, index) => (
//                               <span
//                                 key={index}
//                                 className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
//                               >
//                                 ✓ {type}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Location */}
//                       <div className="flex items-start gap-3 mb-4">
//                         <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <MapPin className="w-4 h-4 text-gray-600" />
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800">Location</p>
//                           <p className="text-gray-600">
//                             {selectedJobDetails.job?.location?.city},{" "}
//                             {selectedJobDetails.job?.location?.state}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Job Description */}
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                         Job Description
//                       </h3>
//                       <div className="prose prose-sm max-w-none text-gray-700">
//                         <p>{selectedJobDetails.job?.description}</p>
//                       </div>
//                     </div>
//                     {/* Required Skills */}
//                     {selectedJobDetails.requiredSkills?.length > 0 && (
//                       <div className="flex items-start gap-3 mb-4">
//                         <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <span className="text-gray-600 text-sm">🛠</span>
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800">
//                             Required Skills
//                           </p>
//                           <div className="flex flex-wrap gap-2 mt-1">
//                             {selectedJobDetails.requiredSkills.map(
//                               (skill, index) => (
//                                 <span
//                                   key={index}
//                                   className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
//                                 >
//                                   {skill}
//                                 </span>
//                               )
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* Graduate Requirement */}
//                     <div className="flex items-start gap-3 mb-4">
//                       <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                         🎓
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-800">
//                           Graduate Required
//                         </p>
//                         <p className="text-gray-600">
//                           {selectedJobDetails.graduateRequired ? "Yes" : "No"}
//                         </p>
//                       </div>
//                     </div>

//                     <Link
//                       to={`/company/user/${selectedJobDetails.employer?._id}`}
//                       className="text-blue-600 hover:text-blue-800 underline"
//                     >
//                       View Company Details
//                     </Link>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="p-8 text-center text-gray-500">
//                   <p>Select a job to view details</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Trending Section (Non-Logged In Users Only) */}
//       {!isLoggedIn && (
//         <div className="bg-gray-50 py-12">
//           <div className="w-full max-w-6xl mx-auto px-4">
//             <div className="text-center mb-8">
//               <button
//                 onClick={toggleDropdown}
//                 className="inline-flex items-center gap-2 text-xl font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
//               >
//                 What's trending on Indeed
//                 {isOpen ? (
//                   <ChevronUp className="w-5 h-5" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5" />
//                 )}
//               </button>
//             </div>

//             {isOpen && (
//               <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 animate-in slide-in-from-top-2 duration-300">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//                   {Object.entries(trendingData).map(([category, items]) => (
//                     <div key={category} className="space-y-4">
//                       <h3 className="font-semibold text-gray-900 text-lg border-b border-gray-200 pb-2">
//                         {category}
//                       </h3>
//                       <div className="space-y-3">
//                         {items.map((item, index) => (
//                           <a
//                             key={index}
//                             href="#"
//                             className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
//                           >
//                             {item}
//                           </a>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <FirstFooter />
//     </div>
//   );
// };

// export default FirstPage;


// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import {
//   Search,
//   MapPin,
//   ChevronUp,
//   ChevronDown,
//   Bookmark,
//   Share2,
//   User,
//   MessageSquare,
//   Briefcase,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import mainImg from "../assets/main.png";
// import FirstFooter from "../components/FirstFooter";
// import { AuthContext } from "../context/AuthContext";
// import axiosInstance from "../../utils/axiosInstance";
// import { useNavigate } from "react-router-dom";
// import ConfirmApplyModal from "../components/common/ConfirmApplyModal";

// // API endpoints
// const API_BASE = "http://localhost:9999/api";

// // Skeleton Card Component
// const SkeletonCard = () => (
//   <div className="bg-white border rounded-lg shadow-sm p-4 animate-pulse">
//     <div className="flex justify-between items-start mb-2">
//       <div className="h-5 bg-gray-200 rounded w-3/4"></div>
//       <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
//     </div>
//     <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
//     <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
//     <div className="flex justify-between items-center">
//       <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//       <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//     </div>
//   </div>
// );

// const FirstPage = () => {
//   // Search and UI state
//   const [jobQuery, setJobQuery] = useState("");
//   const [locationQuery, setLocationQuery] = useState("");
//   const [isOpen, setIsOpen] = useState(false);

//   // Job data state
//   const [jobList, setJobList] = useState([]);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [selectedJobDetails, setSelectedJobDetails] = useState(null);
//   const [loadingJobDetails, setLoadingJobDetails] = useState(false);
//   // Loading state for job list
//   const [loadingJobs, setLoadingJobs] = useState(false);
//   // Pagination for jobs
//   const [jobPage, setJobPage] = useState(1);
//   const [jobTotalPages, setJobTotalPages] = useState(1);

//   // Auth context
//   const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

//   const [jobSuggestions, setJobSuggestions] = useState([]);
//   const [locationSuggestions, setLocationSuggestions] = useState([]);

//   const [userRole, setUserRole] = useState(null);
//   const [profileList, setProfileList] = useState([]);
//   // Loading state for profile list
//   const [loadingProfiles, setLoadingProfiles] = useState(false);
//   // Pagination for profiles
//   const [profilePage, setProfilePage] = useState(1);
//   const [profileTotalPages, setProfileTotalPages] = useState(1);

//   const [appliedJobIds, setAppliedJobIds] = useState([]);
//   const [showApplyModal, setShowApplyModal] = useState(false);
//   const [selectedJobIdToApply, setSelectedJobIdToApply] = useState(null);
//   const [savedJobIds, setSavedJobIds] = useState([]);

//   const navigate = useNavigate();

//   const confirmApplyHandler = async () => {
//     setShowApplyModal(false);

//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.post(
//         `http://localhost:9999/api/job/apply/${selectedJobIdToApply}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         alert("🎉 Application submitted!");
//         setAppliedJobIds((prev) => [...prev, selectedJobIdToApply]);
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || "Something went wrong";
//       alert("⚠️ " + message);

//       const redirectTo = error.response?.data?.redirectTo;
//       if (redirectTo) {
//         navigate(redirectTo);
//       }
//     }
//   };

//   const handleApplyJob = (jobId) => {
//     setSelectedJobIdToApply(jobId);
//     setShowApplyModal(true);
//   };

//   const fetchAppliedJobs = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const res = await axios.get("http://localhost:9999/api/job/applied", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.data.success) {
//         setAppliedJobIds(res.data.data.map((job) => job._id) || []);
//       }
//     } catch (err) {
//       console.error("❌ Failed to fetch applied jobs", err);
//     }
//   };

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (jobQuery.trim()) {
//         axios
//           .get(`${API_BASE}/search/suggest/job-titles?query=${jobQuery}`)
//           .then((res) => setJobSuggestions(res.data.data || []))
//           .catch(() => setJobSuggestions([]));
//       } else {
//         setJobSuggestions([]);
//       }
//     }, 300);

//     return () => clearTimeout(delayDebounce);
//   }, [jobQuery]);

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (locationQuery.trim()) {
//         axios
//           .get(`${API_BASE}/search/suggest/locations?query=${locationQuery}`)
//           .then((res) => setLocationSuggestions(res.data.data || []))
//           .catch(() => setLocationSuggestions([]));
//       } else {
//         setLocationSuggestions([]);
//       }
//     }, 300);

//     return () => clearTimeout(delayDebounce);
//   }, [locationQuery]);

//   // Detect user role from localStorage
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const user = JSON.parse(storedUser);
//         setIsLoggedIn(true);
//         setUserRole(user?.role);
//       } catch (error) {
//         localStorage.removeItem("user");
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (isLoggedIn && userRole === "employer") {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         try {
//           const user = JSON.parse(storedUser);
//           if (user.token) {
//             fetchAllProfiles(user.token, profilePage);
//           } else {
//             console.warn("⚠️ Token missing in stored user.");
//           }
//         } catch (err) {
//           console.error("⚠️ Failed to parse user from localStorage:", err);
//         }
//       }
//     }
//   }, [isLoggedIn, userRole, profilePage]);

//   const fetchAllProfiles = async (token, page = 1) => {
//     setLoadingProfiles(true);
//     try {
//       const response = await axiosInstance.get(
//         `/profile/all-profiles?page=${page}&limit=10`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       console.log("Fetched profiles from API:", response.data);

//       if (response.data.success) {
//         setProfileList(response.data.data);
//         setProfileTotalPages(response.data.pages || 1);
//       }
//     } catch (error) {
//       console.error("Failed to fetch profiles:", error);
//     } finally {
//       setLoadingProfiles(false);
//     }
//   };

//   const fetchSavedJobs = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const res = await axios.get("http://localhost:9999/api/job/saved", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.data.success && Array.isArray(res.data.savedJobs)) {
//         const ids = res.data.savedJobs.map((job) => job._id);
//         setSavedJobIds(ids);
//       }
//     } catch (err) {
//       console.error("⚠️ Error fetching saved jobs", err);
//     }
//   };

//   const toggleSaveJob = async (jobId) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const isSaved = savedJobIds.includes(jobId);

//     try {
//       if (isSaved) {
//         await axios.delete(`http://localhost:9999/api/job/saved/${jobId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
//       } else {
//         await axios.post(
//           `http://localhost:9999/api/job/save/${jobId}`,
//           {},
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setSavedJobIds((prev) => [...prev, jobId]);
//       }
//     } catch (err) {
//       console.error("⚠️ Error saving/removing job", err);
//     }
//   };

//   useEffect(() => {
//     checkAuthStatus();
//     fetchAllJobs(jobPage);
//     if (isLoggedIn) fetchAppliedJobs();
//   }, [jobPage]);

//   useEffect(() => {
//     if (isLoggedIn && userRole !== "employer") {
//       fetchSavedJobs();
//     }
//   }, [isLoggedIn, userRole]);

//   const filteredProfiles = profileList.filter((profile) => {
//     const titleMatch = (profile?.skills || []).some((s) =>
//       s.toLowerCase().includes(jobQuery.toLowerCase())
//     );
//     const locationMatch = profile?.personalInfo?.location
//       ?.toLowerCase()
//       .includes(locationQuery.toLowerCase());

//     return (!jobQuery || titleMatch) && (!locationQuery || locationMatch);
//   });

//   useEffect(() => {
//     if (jobQuery.trim() === "" && locationQuery.trim() === "") {
//       fetchAllJobs(jobPage);
//     }
//   }, [jobQuery, locationQuery, jobPage]);

//   const checkAuthStatus = () => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const user = JSON.parse(storedUser);
//         setIsLoggedIn(true);
//         setUserRole(user?.role);
//         if (user?.token && user?.role === "employer") {
//           fetchAllProfiles(user.token, profilePage);
//         }
//       } catch (error) {
//         console.error("Failed to parse stored user:", error);
//         localStorage.removeItem("user");
//       }
//     }
//   };

//   const fetchAllJobs = async (page = 1) => {
//     setLoadingJobs(true);
//     try {
//       const response = await axios.get(
//         `${API_BASE}/job/all-jobs?page=${page}&limit=10`
//       );
//       if (response.data.success && response.data.data) {
//         setJobList(response.data.data);
//         setJobTotalPages(response.data.pages || 1);
//         // Auto-select first job if available and user is logged in
//         if (response.data.data.length > 0 && isLoggedIn) {
//           handleJobClick(response.data.data[0]);
//         }
//       }
//     } catch (error) {
//       console.error("Failed to fetch jobs:", error);
//     } finally {
//       setLoadingJobs(false);
//     }
//   };

//   const handleJobClick = async (job) => {
//     if (!job?._id) return;

//     setSelectedJob(job);
//     setLoadingJobDetails(true);

//     try {
//       const response = await axios.get(`${API_BASE}/job/${job._id}`);
//       if (response.data.success) {
//         setSelectedJobDetails(response.data.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch job details:", error);
//       setSelectedJobDetails(null);
//     } finally {
//       setLoadingJobDetails(false);
//     }
//   };

//   // Handle search
//   const handleSearch = async () => {
//     if (!jobQuery.trim() && !locationQuery.trim()) {
//       fetchAllJobs(jobPage);
//       return;
//     }

//     setLoadingJobs(true);
//     try {
//       const response = await axios.get(`${API_BASE}/search/search`, {
//         params: {
//           job: jobQuery,
//           location: locationQuery,
//           page: jobPage,
//           limit: 10,
//         },
//       });

//       if (response.data.success) {
//         setJobList(response.data.data);
//         setJobTotalPages(response.data.pages || 1);
//         // Auto-select first result if available
//         if (response.data.data.length > 0) {
//           handleJobClick(response.data.data[0]);
//         } else {
//           setSelectedJob(null);
//           setSelectedJobDetails(null);
//         }
//       }
//     } catch (error) {
//       console.error("Search failed:", error);
//     } finally {
//       setLoadingJobs(false);
//     }
//   };

//   const handleShareJob = async (jobId) => {
//     if (!jobId) return;

//     const shareUrl = `${window.location.origin}/job-details/${jobId}`;
//     const shareData = {
//       title: selectedJobDetails?.job?.title || "Job Opportunity",
//       text: `Check out this job: ${selectedJobDetails?.job?.title} at ${selectedJobDetails?.company?.name}`,
//       url: shareUrl,
//     };

//     try {
//       if (navigator.share) {
//         // Use Web Share API if available
//         await navigator.share(shareData);
//       } else {
//         // Fallback: Copy URL to clipboard
//         await navigator.clipboard.writeText(shareUrl);
//         alert("🔗 Job link copied to clipboard!");
//       }
//     } catch (err) {
//       console.error("⚠️ Failed to share job:", err);
//       alert("⚠️ Failed to share job. Please try again.");
//     }
//   };

//   // Handle key press
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       setJobPage(1); // Reset to first page on new search
//       handleSearch();
//     }
//   };

//   // Pagination Handlers
//   const handleJobPageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= jobTotalPages) {
//       setJobPage(newPage);
//     }
//   };

//   const handleProfilePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= profileTotalPages) {
//       setProfilePage(newPage);
//     }
//   };

//   // Trending data
//   const trendingData = {
//     "Trending Searches": ["Account Mumbai, Maharashtra"],
//     "Trending Jobs": [
//       "Net Remote",
//       "Fresher Tamil Nadu",
//       "Content Writer Remote",
//     ],
//     "Popular Cities": ["Ludhiana, Punjab", "Kolkata, West Bengal"],
//     "Popular Companies": ["American Express"],
//   };

//   // Toggle trending dropdown
//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
//       <ConfirmApplyModal
//         isOpen={showApplyModal}
//         onConfirm={confirmApplyHandler}
//         onCancel={() => setShowApplyModal(false)}
//       />

//       {/* Main Content */}
//       <div className="w-full max-w-6xl mx-auto px-4 py-8 flex-grow">
//         {/* Search Bar - Only for logged-in non-employer users */}
//         {isLoggedIn && userRole !== "employer" && (
//           <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-visible mb-8 relative">
//             <div className="flex flex-col md:flex-row">
//               {/* Job Title Input */}
//               <div className="flex-1 relative">
//                 <div className="flex items-center px-4 py-4 border-b md:border-b-0 md:border-r border-gray-200">
//                   <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
//                   <input
//                     type="text"
//                     value={jobQuery}
//                     onChange={(e) => setJobQuery(e.target.value)}
//                     placeholder="Job title, keywords, or company"
//                     onKeyPress={handleKeyPress}
//                     className="w-full text-gray-700 placeholder-gray-500 bg-transparent border-none outline-none text-base"
//                   />
//                 </div>
//                 {/* Job Suggestions Dropdown */}
//                 {jobSuggestions.length > 0 && (
//                   <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl z-[100] max-h-64 overflow-y-auto rounded-b-md">
//                     {jobSuggestions.map((item, idx) => (
//                       <div
//                         key={idx}
//                         onClick={() => {
//                           setJobQuery(item);
//                           setJobSuggestions([]);
//                         }}
//                         className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
//                       >
//                         <Search className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
//                         <span className="text-gray-700 text-sm">{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Location Input */}
//               <div className="flex-1 relative">
//                 <div className="flex items-center px-4 py-4 border-b md:border-b-0 md:border-r border-gray-200">
//                   <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
//                   <input
//                     type="text"
//                     value={locationQuery}
//                     onChange={(e) => setLocationQuery(e.target.value)}
//                     placeholder="City or location"
//                     onKeyPress={handleKeyPress}
//                     className="w-full text-gray-700 placeholder-gray-500 bg-transparent border-none outline-none text-base"
//                   />
//                 </div>
//                 {/* Location Suggestions Dropdown */}
//                 {locationSuggestions.length > 0 && (
//                   <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl z-[100] max-h-64 overflow-y-auto rounded-b-md">
//                     {locationSuggestions.map((city, idx) => (
//                       <div
//                         key={idx}
//                         onClick={() => {
//                           setLocationQuery(city);
//                           setLocationSuggestions([]);
//                         }}
//                         className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
//                       >
//                         <MapPin className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
//                         <span className="text-gray-700 text-sm">{city}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Search Button */}
//               <div className="flex-shrink-0">
//                 <button
//                   onClick={() => {
//                     setJobPage(1); // Reset to first page on new search
//                     handleSearch();
//                   }}
//                   className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                 >
//                   Find jobs
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Welcome Page for Non-Logged In Users */}
//         {!isLoggedIn && (
//           <>
//             <div className="w-full mb-8">
//               <img
//                 src={mainImg}
//                 alt="Main Visual"
//                 className="max-w-full h-auto mx-auto"
//               />
//             </div>

//             <div className="text-center mb-8">
//               <h1 className="text-4xl font-bold text-gray-800 mb-4">
//                 Welcome to Indeed!
//               </h1>
//               <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//                 Create an account or sign in to see your personalised job
//                 recommendations.
//               </p>

//               <Link to="/signin">
//                 <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 mb-8 inline-flex items-center">
//                   Get Started
//                   <svg
//                     className="w-5 h-5 ml-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </button>
//               </Link>

//               <div className="space-y-4 text-gray-600">
//                 <div>
//                   <a
//                     href="#"
//                     className="text-blue-600 hover:text-blue-700 underline font-medium"
//                   >
//                     Post your resume
//                   </a>
//                   <span className="text-gray-500">
//                     {" "}
//                     - It only takes a few seconds
//                   </span>
//                 </div>
//                 <div>
//                   <Link
//                     to="/postJob"
//                     className="text-blue-600 hover:text-blue-700 underline font-medium"
//                   >
//                     Post a job on Indeed
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {isLoggedIn && userRole === "employer" && (
//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//             {/* Profile Cards (Left) */}
//             <div className="lg:col-span-2 space-y-4 max-h-screen overflow-y-auto">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                 Matched Candidates
//               </h2>

//               {loadingProfiles ? (
//                 <div className="space-y-4">
//                   {[...Array(3)].map((_, index) => (
//                     <SkeletonCard key={index} />
//                   ))}
//                 </div>
//               ) : filteredProfiles.length > 0 ? (
//                 filteredProfiles.map((profile) => (
//                   <div
//                     key={profile._id}
//                     onClick={() => setSelectedJob(profile)}
//                     className={`bg-white border rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
//                       selectedJob?._id === profile._id
//                         ? "border-blue-500 bg-blue-50"
//                         : "border-gray-200 hover:border-gray-300"
//                     }`}
//                   >
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
//                         {profile.personalInfo?.firstName}{" "}
//                         {profile.personalInfo?.lastName}
//                       </h3>
//                       <User className="w-5 h-5 text-gray-400" />
//                     </div>

//                     <p className="text-gray-600 text-sm mb-2">
//                       {profile.personalInfo?.location}
//                     </p>

//                     <div className="flex justify-between items-center text-sm text-gray-500">
//                       <span>{profile.skills?.length || 0} skills</span>
//                       <span>{profile.education?.[0]?.degree || "—"}</span>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center text-gray-500 py-20">
//                   No matching profiles found.
//                 </div>
//               )}

//               {/* Pagination for Profiles */}
//               {filteredProfiles.length > 0 && profileTotalPages > 1 && (
//                 <div className="flex justify-center items-center gap-2 mt-4">
//                   <button
//                     onClick={() => handleProfilePageChange(profilePage - 1)}
//                     disabled={profilePage === 1}
//                     className={`px-4 py-2 rounded-md ${
//                       profilePage === 1
//                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                         : "bg-blue-600 text-white hover:bg-blue-700"
//                     }`}
//                   >
//                     Previous
//                   </button>
//                   {[...Array(profileTotalPages).keys()].map((num) => (
//                     <button
//                       key={num + 1}
//                       onClick={() => handleProfilePageChange(num + 1)}
//                       className={`px-4 py-2 rounded-md ${
//                         profilePage === num + 1
//                           ? "bg-blue-600 text-white"
//                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                       }`}
//                     >
//                       {num + 1}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => handleProfilePageChange(profilePage + 1)}
//                     disabled={profilePage === profileTotalPages}
//                     className={`px-4 py-2 rounded-md ${
//                       profilePage === profileTotalPages
//                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                         : "bg-blue-600 text-white hover:bg-blue-700"
//                     }`}
//                   >
//                     Next
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Profile Details (Right) - Show only when profiles exist */}
//             {filteredProfiles.length > 0 && (
//               <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200">
//                 {selectedJob ? (
//                   <div className="p-6">
//                     <h1 className="text-2xl font-bold text-gray-800 mb-2">
//                       {selectedJob.personalInfo?.firstName}{" "}
//                       {selectedJob.personalInfo?.lastName}
//                     </h1>
//                     <br />
//                     <p className="text-gray-600 mb-2">
//                       {selectedJob.personalInfo?.email}{" "}
//                     </p>

//                     <p className="text-gray-600 mb-2">
//                       {selectedJob.personalInfo?.location}
//                     </p>
//                     <p className="text-gray-600 text-sm mb-4">
//                       {selectedJob.personalInfo?.phone}
//                     </p>
//                     <br />
//                     {selectedJob.skills?.length > 0 && (
//                       <div className="mb-6">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                           Skills
//                         </h3>
//                         <div className="flex flex-wrap gap-2">
//                           {selectedJob.skills.map((skill, index) => (
//                             <span
//                               key={index}
//                               className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
//                             >
//                               {skill}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     <br />
//                     {selectedJob.education?.length > 0 && (
//                       <div className="mb-6">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                           Education
//                         </h3>
//                         {selectedJob.education.map((edu, idx) => (
//                           <div key={idx} className="text-sm text-gray-700 mb-1">
//                             🎓 {edu.degree}, {edu.school} ({edu.graduationYear})
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                     {selectedJob.industryPreference && (
//                       <div className="mb-6">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                           <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
//                           Industry Preference
//                         </h3>
//                         <p className="text-gray-600">
//                           {selectedJob.industryPreference}
//                         </p>
//                       </div>
//                     )}
//                     <br />
//                     {selectedJob.resume?.previewUrl && (
//                       <div className="mt-4">
//                         📄 Resume:{" "}
//                         <a
//                           href={`https://docs.google.com/viewer?url=${encodeURIComponent(
//                             selectedJob.resume.previewUrl
//                           )}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 underline"
//                         >
//                           View Resume
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="p-8 text-center text-gray-500">
//                     <p>Select a candidate to view profile</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Job List and Details for Logged In Users */}
//         {isLoggedIn && userRole !== "employer" && (
//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//             {/* Job List */}
//             <div className="lg:col-span-2 space-y-4 max-h-screen overflow-y-auto">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                 Jobs for you
//               </h2>
//               {loadingJobs ? (
//                 <div className="space-y-4">
//                   {[...Array(3)].map((_, index) => (
//                     <SkeletonCard key={index} />
//                   ))}
//                 </div>
//               ) : jobList.length > 0 ? (
//                 jobList.map((job) => (
//                   <div
//                     key={job._id}
//                     onClick={() => handleJobClick(job)}
//                     className={`bg-white border rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
//                       selectedJob?._id === job._id
//                         ? "border-blue-500 bg-blue-50"
//                         : "border-gray-200 hover:border-gray-300"
//                     }`}
//                   >
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
//                         {job.job?.title}
//                       </h3>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation(); // prevent job select on click
//                           toggleSaveJob(job._id);
//                         }}
//                       >
//                         {savedJobIds.includes(job._id) ? (
//                           <Bookmark className="w-5 h-5 text-blue-600 fill-blue-600" />
//                         ) : (
//                           <Bookmark className="w-5 h-5 text-gray-400 hover:text-gray-600" />
//                         )}
//                       </button>
//                     </div>

//                     <p className="text-gray-600 text-sm mb-2">
//                       {job.company?.name}
//                     </p>

//                     <p className="text-gray-600 text-sm mb-2 flex items-center">
//                       <MapPin className="w-4 h-4 mr-1" />
//                       {job.job?.location?.city}
//                     </p>
//                     <p className="text-gray-700 text-sm mb-3 line-clamp-2">
//                       {job.job?.description}
//                     </p>

//                     <div className="flex justify-between items-center text-sm text-gray-500">
//                       <span>
//                         ₹{job.payRange?.min} - ₹{job.payRange?.max}
//                       </span>
//                       <span>{job.jobTypes?.join(", ")}</span>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center text-gray-500 py-20">
//                   No job postings found.
//                 </div>
//               )}

//               {/* Pagination for Jobs */}
//               {jobList.length > 0 && jobTotalPages > 1 && (
//                 <div className="flex justify-center items-center gap-2 mt-4">
//                   <button
//                     onClick={() => handleJobPageChange(jobPage - 1)}
//                     disabled={jobPage === 1}
//                     className={`px-4 py-2 rounded-md ${
//                       jobPage === 1
//                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                         : "bg-blue-600 text-white hover:bg-blue-700"
//                     }`}
//                   >
//                     Previous
//                   </button>
//                   {[...Array(jobTotalPages).keys()].map((num) => (
//                     <button
//                       key={num + 1}
//                       onClick={() => handleJobPageChange(num + 1)}
//                       className={`px-4 py-2 rounded-md ${
//                         jobPage === num + 1
//                           ? "bg-blue-600 text-white"
//                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                       }`}
//                     >
//                       {num + 1}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => handleJobPageChange(jobPage + 1)}
//                     disabled={jobPage === jobTotalPages}
//                     className={`px-4 py-2 rounded-md ${
//                       jobPage === jobTotalPages
//                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                         : "bg-blue-600 text-white hover:bg-blue-700"
//                     }`}
//                   >
//                     Next
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Job Details */}
//             <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200">
//               {loadingJobDetails ? (
//                 <div className="p-8 text-center">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                   <p className="text-gray-500 mt-4">Loading job details...</p>
//                 </div>
//               ) : selectedJobDetails ? (
//                 <div className="p-6">
//                   {/* Job Header */}
//                   <div className="border-b border-gray-200 pb-6 mb-6">
//                     <h1 className="text-2xl font-bold text-gray-800 mb-2">
//                       {selectedJobDetails.job?.title}
//                     </h1>
//                     <p className="text-gray-600 mb-2">
//                       {selectedJobDetails.company?.name} •{" "}
//                       {selectedJobDetails.job?.location?.city}
//                     </p>
//                     <p className="text-gray-600 text-sm mb-4">
//                       Up to ₹{selectedJobDetails.payRange?.max} a month
//                     </p>

//                     {/* Action Buttons */}
//                     <div className="flex gap-3">
//                       <button
//                         disabled={
//                           !selectedJobDetails?._id ||
//                           appliedJobIds.includes(selectedJobDetails._id)
//                         }
//                         onClick={() => handleApplyJob(selectedJobDetails._id)}
//                         className={`${
//                           !selectedJobDetails?._id ||
//                           appliedJobIds.includes(selectedJobDetails._id)
//                             ? "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300"
//                             : "bg-blue-700 hover:bg-blue-800 text-white border border-blue-700 hover:border-blue-800 shadow-sm hover:shadow-md"
//                         } font-medium px-8 py-3 rounded-md transition-all duration-200 text-sm uppercase tracking-wide min-w-[140px]`}
//                       >
//                         {appliedJobIds.includes(selectedJobDetails._id)
//                           ? "✅ Applied"
//                           : "Apply now"}
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleSaveJob(selectedJobDetails._id);
//                         }}
//                         className={`border font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${
//                           savedJobIds.includes(selectedJobDetails._id)
//                             ? "border-blue-500 text-blue-600"
//                             : "border-gray-300 text-gray-700 hover:border-gray-400"
//                         }`}
//                       >
//                         <Bookmark
//                           className={`w-4 h-4 ${
//                             savedJobIds.includes(selectedJobDetails._id)
//                               ? "fill-blue-600"
//                               : ""
//                           }`}
//                         />
//                       </button>
//                       <button
//                         onClick={() => handleShareJob(selectedJobDetails._id)}
//                         className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
//                       >
//                         <Share2 className="w-4 h-4" />
//                       </button>

//                       <button
//                         className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
//                         onClick={() => {
//                           const employerId = selectedJobDetails.company?.userId;
//                           if (employerId) {
//                             navigate(`/chat/${employerId}`);
//                           } else {
//                             console.error(
//                               "❌ Employer ID not found in job details"
//                             );
//                             alert("Chat unavailable: Employer info missing");
//                           }
//                         }}
//                       >
//                         <svg
//                           className="w-4 h-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
//                           />
//                         </svg>
//                         Contact Employer
//                       </button>
//                     </div>
//                   </div>

//                   {/* Job Details */}
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                         Job details
//                       </h3>

//                       {/* Pay */}
//                       <div className="flex items-start gap-3 mb-4">
//                         <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <span className="text-gray-600 text-sm">₹</span>
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800">Pay</p>
//                           <p className="text-gray-600">
//                             ₹{selectedJobDetails.payRange?.min} - ₹
//                             {selectedJobDetails.payRange?.max} a month
//                           </p>
//                         </div>
//                       </div>

//                       {/* Job Type */}
//                       <div className="flex items-start gap-3 mb-4">
//                         <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <span className="text-gray-600 text-sm">💼</span>
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800">Job type</p>
//                           <div className="flex gap-2 mt-1">
//                             {selectedJobDetails.jobTypes?.map((type, index) => (
//                               <span
//                                 key={index}
//                                 className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
//                               >
//                                 ✓ {type}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Location */}
//                       <div className="flex items-start gap-3 mb-4">
//                         <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <MapPin className="w-4 h-4 text-gray-600" />
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800">Location</p>
//                           <p className="text-gray-600">
//                             {selectedJobDetails.job?.location?.city},{" "}
//                             {selectedJobDetails.job?.location?.state}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Job Description */}
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                         Job Description
//                       </h3>
//                       <div className="prose prose-sm max-w-none text-gray-700">
//                         <p>{selectedJobDetails.job?.description}</p>
//                       </div>
//                     </div>
//                     {/* Required Skills */}
//                     {selectedJobDetails.requiredSkills?.length > 0 && (
//                       <div className="flex items-start gap-3 mb-4">
//                         <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <span className="text-gray-600 text-sm">🛠</span>
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800">
//                             Required Skills
//                           </p>
//                           <div className="flex flex-wrap gap-2 mt-1">
//                             {selectedJobDetails.requiredSkills.map(
//                               (skill, index) => (
//                                 <span
//                                   key={index}
//                                   className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
//                                 >
//                                   {skill}
//                                 </span>
//                               )
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* Graduate Requirement */}
//                     <div className="flex items-start gap-3 mb-4">
//                       <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                         🎓
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-800">
//                           Graduate Required
//                         </p>
//                         <p className="text-gray-600">
//                           {selectedJobDetails.graduateRequired ? "Yes" : "No"}
//                         </p>
//                       </div>
//                     </div>

//                     <Link
//                       to={`/company/user/${selectedJobDetails.employer?._id}`}
//                       className="text-blue-600 hover:text-blue-800 underline"
//                     >
//                       View Company Details
//                     </Link>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="p-8 text-center text-gray-500">
//                   <p>Select a job to view details</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Trending Section (Non-Logged In Users Only) */}
//       {!isLoggedIn && (
//         <div className="bg-gray-50 py-12">
//           <div className="w-full max-w-6xl mx-auto px-4">
//             <div className="text-center mb-8">
//               <button
//                 onClick={toggleDropdown}
//                 className="inline-flex items-center gap-2 text-xl font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
//               >
//                 What's trending on Indeed
//                 {isOpen ? (
//                   <ChevronUp className="w-5 h-5" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5" />
//                 )}
//               </button>
//             </div>

//             {isOpen && (
//               <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 animate-in slide-in-from-top-2 duration-300">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//                   {Object.entries(trendingData).map(([category, items]) => (
//                     <div key={category} className="space-y-4">
//                       <h3 className="font-semibold text-gray-900 text-lg border-b border-gray-200 pb-2">
//                         {category}
//                       </h3>
//                       <div className="space-y-3">
//                         {items.map((item, index) => (
//                           <a
//                             key={index}
//                             href="#"
//                             className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
//                           >
//                             {item}
//                           </a>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <FirstFooter />
//     </div>
//   );
// };

// export default FirstPage;


// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import {
//   Search,
//   MapPin,
//   ChevronUp,
//   ChevronDown,
//   Bookmark,
//   Share2,
//   User,
//   MessageSquare,
//   Briefcase,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import mainImg from "../assets/main.png";
// import FirstFooter from "../components/FirstFooter";
// import { AuthContext } from "../context/AuthContext";
// import axiosInstance from "../../utils/axiosInstance";
// import { useNavigate } from "react-router-dom";
// import ConfirmApplyModal from "../components/common/ConfirmApplyModal";

// // API endpoints
// const API_BASE = "http://localhost:9999/api";

// // Skeleton Card Component
// const SkeletonCard = () => (
//   <div className="bg-white border rounded-lg shadow-sm p-4 animate-pulse">
//     <div className="flex justify-between items-start mb-2">
//       <div className="h-5 bg-gray-200 rounded w-3/4"></div>
//       <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
//     </div>
//     <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
//     <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
//     <div className="flex justify-between items-center">
//       <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//       <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//     </div>
//   </div>
// );

// const FirstPage = () => {
//   // Search and UI state
//   const [jobQuery, setJobQuery] = useState("");
//   const [locationQuery, setLocationQuery] = useState("");
//   const [isOpen, setIsOpen] = useState(false);

//   // Job data state
//   const [jobList, setJobList] = useState([]);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [selectedJobDetails, setSelectedJobDetails] = useState(null);
//   const [loadingJobDetails, setLoadingJobDetails] = useState(false);
//   // Loading state for job list
//   const [loadingJobs, setLoadingJobs] = useState(false);
//   // Pagination for jobs
//   const [jobPage, setJobPage] = useState(1);
//   const [jobTotalPages, setJobTotalPages] = useState(1);

//   // Auth context
//   const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

//   const [jobSuggestions, setJobSuggestions] = useState([]);
//   const [locationSuggestions, setLocationSuggestions] = useState([]);

//   const [userRole, setUserRole] = useState(null);
//   const [profileList, setProfileList] = useState([]);
//   // Loading state for profile list
//   const [loadingProfiles, setLoadingProfiles] = useState(false);
//   // Pagination for profiles
//   const [profilePage, setProfilePage] = useState(1);
//   const [profileTotalPages, setProfileTotalPages] = useState(1);

//   const [appliedJobIds, setAppliedJobIds] = useState([]);
//   const [showApplyModal, setShowApplyModal] = useState(false);
//   const [selectedJobIdToApply, setSelectedJobIdToApply] = useState(null);
//   const [savedJobIds, setSavedJobIds] = useState([]);

//   const navigate = useNavigate();

//   const confirmApplyHandler = async () => {
//     setShowApplyModal(false);

//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.post(
//         `http://localhost:9999/api/job/apply/${selectedJobIdToApply}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         alert("🎉 Application submitted!");
//         setAppliedJobIds((prev) => [...prev, selectedJobIdToApply]);
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || "Something went wrong";
//       alert("⚠️ " + message);

//       const redirectTo = error.response?.data?.redirectTo;
//       if (redirectTo) {
//         navigate(redirectTo);
//       }
//     }
//   };

//   const handleApplyJob = (jobId) => {
//     setSelectedJobIdToApply(jobId);
//     setShowApplyModal(true);
//   };

//   const fetchAppliedJobs = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const res = await axios.get("http://localhost:9999/api/job/applied", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.data.success) {
//         setAppliedJobIds(res.data.data.map((job) => job._id) || []);
//       }
//     } catch (err) {
//       console.error("❌ Failed to fetch applied jobs", err);
//     }
//   };

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (jobQuery.trim()) {
//         axios
//           .get(`${API_BASE}/search/suggest/job-titles?query=${jobQuery}`)
//           .then((res) => setJobSuggestions(res.data.data || []))
//           .catch(() => setJobSuggestions([]));
//       } else {
//         setJobSuggestions([]);
//       }
//     }, 300);

//     return () => clearTimeout(delayDebounce);
//   }, [jobQuery]);

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (locationQuery.trim()) {
//         axios
//           .get(`${API_BASE}/search/suggest/locations?query=${locationQuery}`)
//           .then((res) => setLocationSuggestions(res.data.data || []))
//           .catch(() => setLocationSuggestions([]));
//       } else {
//         setLocationSuggestions([]);
//       }
//     }, 300);

//     return () => clearTimeout(delayDebounce);
//   }, [locationQuery]);

//   // Detect user role from localStorage
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const user = JSON.parse(storedUser);
//         setIsLoggedIn(true);
//         setUserRole(user?.role);
//       } catch (error) {
//         localStorage.removeItem("user");
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (isLoggedIn && userRole === "employer") {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         try {
//           const user = JSON.parse(storedUser);
//           if (user.token) {
//             fetchAllProfiles(user.token, profilePage);
//           } else {
//             console.warn("⚠️ Token missing in stored user.");
//           }
//         } catch (err) {
//           console.error("⚠️ Failed to parse user from localStorage:", err);
//         }
//       }
//     }
//   }, [isLoggedIn, userRole, profilePage, jobQuery, locationQuery]);

//   const fetchAllProfiles = async (token, page = 1) => {
//     setLoadingProfiles(true);
//     try {
//       const response = await axiosInstance.get(
//         `/profile/all-profiles?page=${page}&limit=10${jobQuery ? `&skills=${jobQuery}` : ''}${locationQuery ? `&location=${locationQuery}` : ''}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       console.log("Fetched profiles from API:", response.data);

//       if (response.data.success) {
//         setProfileList(response.data.data);
//         setProfileTotalPages(response.data.pages || 1);
//         // Auto-select first profile if available
//         if (response.data.data.length > 0 && !selectedJob) {
//           setSelectedJob(response.data.data[0]);
//         }
//       } else {
//         alert(response.data.message || "Failed to fetch profiles");
//       }
//     } catch (error) {
//       console.error("Failed to fetch profiles:", error);
//       alert("Error fetching profiles. Update you company info");
//       navigate('/update-company-profile')
//     } finally {
//       setLoadingProfiles(false);
//     }
//   };

//   const fetchSavedJobs = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const res = await axios.get("http://localhost:9999/api/job/saved", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.data.success && Array.isArray(res.data.savedJobs)) {
//         const ids = res.data.savedJobs.map((job) => job._id);
//         setSavedJobIds(ids);
//       }
//     } catch (err) {
//       console.error("⚠️ Error fetching saved jobs", err);
//     }
//   };

//   const toggleSaveJob = async (jobId) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const isSaved = savedJobIds.includes(jobId);

//     try {
//       if (isSaved) {
//         await axios.delete(`http://localhost:9999/api/job/saved/${jobId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
//       } else {
//         await axios.post(
//           `http://localhost:9999/api/job/save/${jobId}`,
//           {},
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setSavedJobIds((prev) => [...prev, jobId]);
//       }
//     } catch (err) {
//       console.error("⚠️ Error saving/removing job", err);
//     }
//   };

//   useEffect(() => {
//     checkAuthStatus();
//     fetchAllJobs(jobPage);
//     if (isLoggedIn) fetchAppliedJobs();
//   }, [jobPage]);

//   useEffect(() => {
//     if (isLoggedIn && userRole !== "employer") {
//       fetchSavedJobs();
//     }
//   }, [isLoggedIn, userRole]);

//   useEffect(() => {
//     if (jobQuery.trim() === "" && locationQuery.trim() === "") {
//       fetchAllJobs(jobPage);
//     }
//   }, [jobQuery, locationQuery, jobPage]);

//   const checkAuthStatus = () => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const user = JSON.parse(storedUser);
//         setIsLoggedIn(true);
//         setUserRole(user?.role);
//         if (user?.token && user?.role === "employer") {
//           fetchAllProfiles(user.token, profilePage);
//         }
//       } catch (error) {
//         console.error("Failed to parse stored user:", error);
//         localStorage.removeItem("user");
//       }
//     }
//   };

//   const fetchAllJobs = async (page = 1) => {
//     setLoadingJobs(true);
//     try {
//       const response = await axios.get(
//         `${API_BASE}/job/all-jobs?page=${page}&limit=10`
//       );
//       if (response.data.success && response.data.data) {
//         setJobList(response.data.data);
//         setJobTotalPages(response.data.pages || 1);
//         // Auto-select first job if available and user is logged in
//         if (response.data.data.length > 0 && isLoggedIn) {
//           handleJobClick(response.data.data[0]);
//         }
//       }
//     } catch (error) {
//       console.error("Failed to fetch jobs:", error);
//     } finally {
//       setLoadingJobs(false);
//     }
//   };

//   const handleJobClick = async (job) => {
//     if (!job?._id) return;

//     setSelectedJob(job);
//     setLoadingJobDetails(true);

//     try {
//       const response = await axios.get(`${API_BASE}/job/${job._id}`);
//       if (response.data.success) {
//         setSelectedJobDetails(response.data.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch job details:", error);
//       setSelectedJobDetails(null);
//     } finally {
//       setLoadingJobDetails(false);
//     }
//   };

//   // Handle search
//   const handleSearch = async () => {
//     if (!jobQuery.trim() && !locationQuery.trim()) {
//       fetchAllJobs(jobPage);
//       return;
//     }

//     setLoadingJobs(true);
//     try {
//       const response = await axios.get(`${API_BASE}/search/search`, {
//         params: {
//           job: jobQuery,
//           location: locationQuery,
//           page: jobPage,
//           limit: 10,
//         },
//       });

//       if (response.data.success) {
//         setJobList(response.data.data);
//         setJobTotalPages(response.data.pages || 1);
//         // Auto-select first result if available
//         if (response.data.data.length > 0) {
//           handleJobClick(response.data.data[0]);
//         } else {
//           setSelectedJob(null);
//           setSelectedJobDetails(null);
//         }
//       }
//     } catch (error) {
//       console.error("Search failed:", error);
//     } finally {
//       setLoadingJobs(false);
//     }
//   };

//   const handleShareJob = async (jobId) => {
//     if (!jobId) return;

//     const shareUrl = `${window.location.origin}/job-details/${jobId}`;
//     const shareData = {
//       title: selectedJobDetails?.job?.title || "Job Opportunity",
//       text: `Check out this job: ${selectedJobDetails?.job?.title} at ${selectedJobDetails?.company?.name}`,
//       url: shareUrl,
//     };

//     try {
//       if (navigator.share) {
//         // Use Web Share API if available
//         await navigator.share(shareData);
//       } else {
//         // Fallback: Copy URL to clipboard
//         await navigator.clipboard.writeText(shareUrl);
//         alert("🔗 Job link copied to clipboard!");
//       }
//     } catch (err) {
//       console.error("⚠️ Failed to share job:", err);
//       alert("⚠️ Failed to share job. Please try again.");
//     }
//   };

//   // Handle key press
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       setJobPage(1); // Reset to first page on new search
//       if (userRole === "employer") {
//         setProfilePage(1); // Reset profile page for employer search
//         fetchAllProfiles(localStorage.getItem("token"), 1);
//       } else {
//         handleSearch();
//       }
//     }
//   };

//   // Pagination Handlers
//   const handleJobPageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= jobTotalPages) {
//       setJobPage(newPage);
//     }
//   };

//   const handleProfilePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= profileTotalPages) {
//       setProfilePage(newPage);
//     }
//   };

//   // Trending data
//   const trendingData = {
//     "Trending Searches": ["Account Mumbai, Maharashtra"],
//     "Trending Jobs": [
//       "Net Remote",
//       "Fresher Tamil Nadu",
//       "Content Writer Remote",
//     ],
//     "Popular Cities": ["Ludhiana, Punjab", "Kolkata, West Bengal"],
//     "Popular Companies": ["American Express"],
//   };

//   // Toggle trending dropdown
//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
//       <ConfirmApplyModal
//         isOpen={showApplyModal}
//         onConfirm={confirmApplyHandler}
//         onCancel={() => setShowApplyModal(false)}
//       />

//       {/* Main Content */}
//       <div className="w-full max-w-6xl mx-auto px-4 py-8 flex-grow">
//         {/* Search Bar - Visible for all logged-in users */}
//         {isLoggedIn && (
//           <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-visible mb-8 relative">
//             <div className="flex flex-col md:flex-row">
//               {/* Job Title/Skills Input */}
//               <div className="flex-1 relative">
//                 <div className="flex items-center px-4 py-4 border-b md:border-b-0 md:border-r border-gray-200">
//                   <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
//                   <input
//                     type="text"
//                     value={jobQuery}
//                     onChange={(e) => setJobQuery(e.target.value)}
//                     placeholder={
//                       userRole === "employer"
//                         ? "Search by skills (e.g., JavaScript, Python)"
//                         : "Job title, keywords, or company"
//                     }
//                     onKeyPress={handleKeyPress}
//                     className="w-full text-gray-700 placeholder-gray-500 bg-transparent border-none outline-none text-base"
//                   />
//                 </div>
//                 {/* Job Suggestions Dropdown */}
//                 {jobSuggestions.length > 0 && (
//                   <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl z-[100] max-h-64 overflow-y-auto rounded-b-md">
//                     {jobSuggestions.map((item, idx) => (
//                       <div
//                         key={idx}
//                         onClick={() => {
//                           setJobQuery(item);
//                           setJobSuggestions([]);
//                         }}
//                         className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
//                       >
//                         <Search className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
//                         <span className="text-gray-700 text-sm">{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Location Input */}
//               <div className="flex-1 relative">
//                 <div className="flex items-center px-4 py-4 border-b md:border-b-0 md:border-r border-gray-200">
//                   <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
//                   <input
//                     type="text"
//                     value={locationQuery}
//                     onChange={(e) => setLocationQuery(e.target.value)}
//                     placeholder="City or location"
//                     onKeyPress={handleKeyPress}
//                     className="w-full text-gray-700 placeholder-gray-500 bg-transparent border-none outline-none text-base"
//                   />
//                 </div>
//                 {/* Location Suggestions Dropdown */}
//                 {locationSuggestions.length > 0 && (
//                   <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl z-[100] max-h-64 overflow-y-auto rounded-b-md">
//                     {locationSuggestions.map((city, idx) => (
//                       <div
//                         key={idx}
//                         onClick={() => {
//                           setLocationQuery(city);
//                           setLocationSuggestions([]);
//                         }}
//                         className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
//                       >
//                         <MapPin className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
//                         <span className="text-gray-700 text-sm">{city}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Search Button */}
//               <div className="flex-shrink-0">
//                 <button
//                   onClick={() => {
//                     setJobPage(1); // Reset to first page on new search
//                     if (userRole === "employer") {
//                       setProfilePage(1); // Reset profile page for employer search
//                       fetchAllProfiles(localStorage.getItem("token"), 1);
//                     } else {
//                       handleSearch();
//                     }
//                   }}
//                   className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                 >
//                   {userRole === "employer" ? "Search Candidates" : "Find jobs"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Welcome Page for Non-Logged In Users */}
//         {!isLoggedIn && (
//           <>
//             <div className="w-full mb-8">
//               <img
//                 src={mainImg}
//                 alt="Main Visual"
//                 className="max-w-full h-auto mx-auto"
//               />
//             </div>

//             <div className="text-center mb-8">
//               <h1 className="text-4xl font-bold text-gray-800 mb-4">
//                 Welcome to Indeed!
//               </h1>
//               <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//                 Create an account or sign in to see your personalised job
//                 recommendations.
//               </p>

//               <Link to="/signin">
//                 <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 mb-8 inline-flex items-center">
//                   Get Started
//                   <svg
//                     className="w-5 h-5 ml-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </button>
//               </Link>

//               <div className="space-y-4 text-gray-600">
//                 <div>
//                   <a
//                     href="#"
//                     className="text-blue-600 hover:text-blue-700 underline font-medium"
//                   >
//                     Post your resume
//                   </a>
//                   <span className="text-gray-500">
//                     {" "}
//                     - It only takes a few seconds
//                   </span>
//                 </div>
//                 <div>
//                   <Link
//                     to="/postJob"
//                     className="text-blue-600 hover:text-blue-700 underline font-medium"
//                   >
//                     Post a job on Indeed
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}

//         {isLoggedIn && userRole === "employer" && (
//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//             {/* Profile Cards (Left) */}
//             <div className="lg:col-span-2 space-y-4 max-h-screen overflow-y-auto">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                 Matched Candidates
//               </h2>

//               {loadingProfiles ? (
//                 <div className="space-y-4">
//                   {[...Array(3)].map((_, index) => (
//                     <SkeletonCard key={index} />
//                   ))}
//                 </div>
//               ) : profileList.length > 0 ? (
//                 profileList.map((profile) => (
//                   <div
//                     key={profile._id}
//                     onClick={() => setSelectedJob(profile)}
//                     className={`bg-white border rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
//                       selectedJob?._id === profile._id
//                         ? "border-blue-500 bg-blue-50"
//                         : "border-gray-200 hover:border-gray-300"
//                     }`}
//                   >
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
//                         {profile.personalInfo?.firstName || "N/A"}{" "}
//                         {profile.personalInfo?.lastName || ""}
//                       </h3>
//                       <User className="w-5 h-5 text-gray-400" />
//                     </div>

//                     <p className="text-gray-600 text-sm mb-2">
//                       {profile.personalInfo?.location || "Location not specified"}
//                     </p>

//                     <div className="flex justify-between items-center text-sm text-gray-500">
//                       <span>{profile.skills?.length || 0} skills</span>
//                       <span>{profile.education?.[0]?.degree || "No education listed"}</span>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center text-gray-500 py-20">
//                   No matching profiles found.
//                 </div>
//               )}

//               {/* Pagination for Profiles */}
//               {profileList.length > 0 && profileTotalPages > 1 && (
//                 <div className="flex justify-center items-center gap-2 mt-4">
//                   <button
//                     onClick={() => handleProfilePageChange(profilePage - 1)}
//                     disabled={profilePage === 1}
//                     className={`px-4 py-2 rounded-md ${
//                       profilePage === 1
//                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                         : "bg-blue-600 text-white hover:bg-blue-700"
//                     }`}
//                   >
//                     Previous
//                   </button>
//                   {[...Array(profileTotalPages).keys()].map((num) => (
//                     <button
//                       key={num + 1}
//                       onClick={() => handleProfilePageChange(num + 1)}
//                       className={`px-4 py-2 rounded-md ${
//                         profilePage === num + 1
//                           ? "bg-blue-600 text-white"
//                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                       }`}
//                     >
//                       {num + 1}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => handleProfilePageChange(profilePage + 1)}
//                     disabled={profilePage === profileTotalPages}
//                     className={`px-4 py-2 rounded-md ${
//                       profilePage === profileTotalPages
//                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                         : "bg-blue-600 text-white hover:bg-blue-700"
//                     }`}
//                   >
//                     Next
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Profile Details (Right) - Show only when profiles exist */}
//             {profileList.length > 0 && (
//               <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200">
//                 {selectedJob ? (
//                   <div className="p-6">
//                     <h1 className="text-2xl font-bold text-gray-800 mb-2">
//                       {selectedJob.personalInfo?.firstName || "N/A"}{" "}
//                       {selectedJob.personalInfo?.lastName || ""}
//                     </h1>
//                     <p className="text-gray-600 mb-2">
//                       {selectedJob.personalInfo?.email || "Email not specified"}
//                     </p>
//                     <p className="text-gray-600 mb-2">
//                       {selectedJob.personalInfo?.location || "Location not specified"}
//                     </p>
//                     <p className="text-gray-600 text-sm mb-4">
//                       {selectedJob.personalInfo?.phone || "Phone not specified"}
//                     </p>
//                     {selectedJob.skills?.length > 0 && (
//                       <div className="mb-6">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                           Skills
//                         </h3>
//                         <div className="flex flex-wrap gap-2">
//                           {selectedJob.skills.map((skill, index) => (
//                             <span
//                               key={index}
//                               className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
//                             >
//                               {skill}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     {selectedJob.education?.length > 0 && (
//                       <div className="mb-6">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                           Education
//                         </h3>
//                         {selectedJob.education.map((edu, idx) => (
//                           <div key={idx} className="text-sm text-gray-700 mb-1">
//                             🎓 {edu.degree}, {edu.school} ({edu.graduationYear})
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                     {selectedJob.industryPreference && (
//                       <div className="mb-6">
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                           <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
//                           Industry Preference
//                         </h3>
//                         <p className="text-gray-600">
//                           {selectedJob.industryPreference}
//                         </p>
//                       </div>
//                     )}
//                     {selectedJob.resume?.previewUrl && (
//                       <div className="mt-4">
//                         📄 Resume:{" "}
//                         <a
//                           href={`https://docs.google.com/viewer?url=${encodeURIComponent(
//                             selectedJob.resume.previewUrl
//                           )}`}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-blue-600 underline"
//                         >
//                           View Resume
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="p-8 text-center text-gray-500">
//                     <p>Select a candidate to view profile</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Job List and Details for Logged In Users */}
//         {isLoggedIn && userRole !== "employer" && (
//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//             {/* Job List */}
//             <div className="lg:col-span-2 space-y-4 max-h-screen overflow-y-auto">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                 Jobs for you
//               </h2>
//               {loadingJobs ? (
//                 <div className="space-y-4">
//                   {[...Array(3)].map((_, index) => (
//                     <SkeletonCard key={index} />
//                   ))}
//                 </div>
//               ) : jobList.length > 0 ? (
//                 jobList.map((job) => (
//                   <div
//                     key={job._id}
//                     onClick={() => handleJobClick(job)}
//                     className={`bg-white border rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
//                       selectedJob?._id === job._id
//                         ? "border-blue-500 bg-blue-50"
//                         : "border-gray-200 hover:border-gray-300"
//                     }`}
//                   >
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
//                         {job.job?.title}
//                       </h3>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation(); // prevent job select on click
//                           toggleSaveJob(job._id);
//                         }}
//                       >
//                         {savedJobIds.includes(job._id) ? (
//                           <Bookmark className="w-5 h-5 text-blue-600 fill-blue-600" />
//                         ) : (
//                           <Bookmark className="w-5 h-5 text-gray-400 hover:text-gray-600" />
//                         )}
//                       </button>
//                     </div>

//                     <p className="text-gray-600 text-sm mb-2">
//                       {job.company?.name}
//                     </p>

//                     <p className="text-gray-600 text-sm mb-2 flex items-center">
//                       <MapPin className="w-4 h-4 mr-1" />
//                       {job.job?.location?.city}
//                     </p>
//                     <p className="text-gray-700 text-sm mb-3 line-clamp-2">
//                       {job.job?.description}
//                     </p>

//                     <div className="flex justify-between items-center text-sm text-gray-500">
//                       <span>
//                         ₹{job.payRange?.min} - ₹{job.payRange?.max}
//                       </span>
//                       <span>{job.jobTypes?.join(", ")}</span>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center text-gray-500 py-20">
//                   No job postings found.
//                 </div>
//               )}

//               {/* Pagination for Jobs */}
//               {jobList.length > 0 && jobTotalPages > 1 && (
//                 <div className="flex justify-center items-center gap-2 mt-4">
//                   <button
//                     onClick={() => handleJobPageChange(jobPage - 1)}
//                     disabled={jobPage === 1}
//                     className={`px-4 py-2 rounded-md ${
//                       jobPage === 1
//                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                         : "bg-blue-600 text-white hover:bg-blue-700"
//                     }`}
//                   >
//                     Previous
//                   </button>
//                   {[...Array(jobTotalPages).keys()].map((num) => (
//                     <button
//                       key={num + 1}
//                       onClick={() => handleJobPageChange(num + 1)}
//                       className={`px-4 py-2 rounded-md ${
//                         jobPage === num + 1
//                           ? "bg-blue-600 text-white"
//                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                       }`}
//                     >
//                       {num + 1}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => handleJobPageChange(jobPage + 1)}
//                     disabled={jobPage === jobTotalPages}
//                     className={`px-4 py-2 rounded-md ${
//                       jobPage === jobTotalPages
//                         ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                         : "bg-blue-600 text-white hover:bg-blue-700"
//                     }`}
//                   >
//                     Next
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Job Details */}
//             <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200">
//               {loadingJobDetails ? (
//                 <div className="p-8 text-center">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                   <p className="text-gray-500 mt-4">Loading job details...</p>
//                 </div>
//               ) : selectedJobDetails ? (
//                 <div className="p-6">
//                   {/* Job Header */}
//                   <div className="border-b border-gray-200 pb-6 mb-6">
//                     <h1 className="text-2xl font-bold text-gray-800 mb-2">
//                       {selectedJobDetails.job?.title}
//                     </h1>
//                     <p className="text-gray-600 mb-2">
//                       {selectedJobDetails.company?.name} •{" "}
//                       {selectedJobDetails.job?.location?.city}
//                     </p>
//                     <p className="text-gray-600 text-sm mb-4">
//                       Up to ₹{selectedJobDetails.payRange?.max} a month
//                     </p>

//                     {/* Action Buttons */}
//                     <div className="flex gap-3">
//                       <button
//                         disabled={
//                           !selectedJobDetails?._id ||
//                           appliedJobIds.includes(selectedJobDetails._id)
//                         }
//                         onClick={() => handleApplyJob(selectedJobDetails._id)}
//                         className={`${
//                           !selectedJobDetails?._id ||
//                           appliedJobIds.includes(selectedJobDetails._id)
//                             ? "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300"
//                             : "bg-blue-700 hover:bg-blue-800 text-white border border-blue-700 hover:border-blue-800 shadow-sm hover:shadow-md"
//                         } font-medium px-8 py-3 rounded-md transition-all duration-200 text-sm uppercase tracking-wide min-w-[140px]`}
//                       >
//                         {appliedJobIds.includes(selectedJobDetails._id)
//                           ? "✅ Applied"
//                           : "Apply now"}
//                       </button>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleSaveJob(selectedJobDetails._id);
//                         }}
//                         className={`border font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${
//                           savedJobIds.includes(selectedJobDetails._id)
//                             ? "border-blue-500 text-blue-600"
//                             : "border-gray-300 text-gray-700 hover:border-gray-400"
//                         }`}
//                       >
//                         <Bookmark
//                           className={`w-4 h-4 ${
//                             savedJobIds.includes(selectedJobDetails._id)
//                               ? "fill-blue-600"
//                               : ""
//                           }`}
//                         />
//                       </button>
//                       <button
//                         onClick={() => handleShareJob(selectedJobDetails._id)}
//                         className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
//                       >
//                         <Share2 className="w-4 h-4" />
//                       </button>

//                       <button
//                         className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
//                         onClick={() => {
//                           const employerId = selectedJobDetails.company?.userId;
//                           if (employerId) {
//                             navigate(`/chat/${employerId}`);
//                           } else {
//                             console.error(
//                               "❌ Employer ID not found in job details"
//                             );
//                             alert("Chat unavailable: Employer info missing");
//                           }
//                         }}
//                       >
//                         <svg
//                           className="w-4 h-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
//                           />
//                         </svg>
//                         Contact Employer
//                       </button>
//                     </div>
//                   </div>

//                   {/* Job Details */}
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                         Job details
//                       </h3>

//                       {/* Pay */}
//                       <div className="flex items-start gap-3 mb-4">
//                         <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <span className="text-gray-600 text-sm">₹</span>
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800">Pay</p>
//                           <p className="text-gray-600">
//                             ₹{selectedJobDetails.payRange?.min} - ₹
//                             {selectedJobDetails.payRange?.max} a month
//                           </p>
//                         </div>
//                       </div>

//                       {/* Job Type */}
//                       <div className="flex items-start gap-3 mb-4">
//                         <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <span className="text-gray-600 text-sm">💼</span>
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800">Job type</p>
//                           <div className="flex gap-2 mt-1">
//                             {selectedJobDetails.jobTypes?.map((type, index) => (
//                               <span
//                                 key={index}
//                                 className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
//                               >
//                                 ✓ {type}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Location */}
//                       <div className="flex items-start gap-3 mb-4">
//                         <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <MapPin className="w-4 h-4 text-gray-600" />
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800">Location</p>
//                           <p className="text-gray-600">
//                             {selectedJobDetails.job?.location?.city},{" "}
//                             {selectedJobDetails.job?.location?.state}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Job Description */}
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                         Job Description
//                       </h3>
//                       <div className="prose prose-sm max-w-none text-gray-700">
//                         <p>{selectedJobDetails.job?.description}</p>
//                       </div>
//                     </div>
//                     {/* Required Skills */}
//                     {selectedJobDetails.requiredSkills?.length > 0 && (
//                       <div className="flex items-start gap-3 mb-4">
//                         <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                           <span className="text-gray-600 text-sm">🛠</span>
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800">
//                             Required Skills
//                           </p>
//                           <div className="flex flex-wrap gap-2 mt-1">
//                             {selectedJobDetails.requiredSkills.map(
//                               (skill, index) => (
//                                 <span
//                                   key={index}
//                                   className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
//                                 >
//                                   {skill}
//                                 </span>
//                               )
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* Graduate Requirement */}
//                     <div className="flex items-start gap-3 mb-4">
//                       <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                         🎓
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-800">
//                           Graduate Required
//                         </p>
//                         <p className="text-gray-600">
//                           {selectedJobDetails.graduateRequired ? "Yes" : "No"}
//                         </p>
//                       </div>
//                     </div>

//                     <Link
//                       to={`/company/user/${selectedJobDetails.employer?._id}`}
//                       className="text-blue-600 hover:text-blue-800 underline"
//                     >
//                       View Company Details
//                     </Link>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="p-8 text-center text-gray-500">
//                   <p>Select a job to view details</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Trending Section (Non-Logged In Users Only) */}
//       {!isLoggedIn && (
//         <div className="bg-gray-50 py-12">
//           <div className="w-full max-w-6xl mx-auto px-4">
//             <div className="text-center mb-8">
//               <button
//                 onClick={toggleDropdown}
//                 className="inline-flex items-center gap-2 text-xl font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
//               >
//                 What's trending on Indeed
//                 {isOpen ? (
//                   <ChevronUp className="w-5 h-5" />
//                 ) : (
//                   <ChevronDown className="w-5 h-5" />
//                 )}
//               </button>
//             </div>

//             {isOpen && (
//               <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 animate-in slide-in-from-top-2 duration-300">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//                   {Object.entries(trendingData).map(([category, items]) => (
//                     <div key={category} className="space-y-4">
//                       <h3 className="font-semibold text-gray-900 text-lg border-b border-gray-200 pb-2">
//                         {category}
//                       </h3>
//                       <div className="space-y-3">
//                         {items.map((item, index) => (
//                           <a
//                             key={index}
//                             href="#"
//                             className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
//                           >
//                             {item}
//                           </a>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <FirstFooter />
//     </div>
//   );
// };

// export default FirstPage;


import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import {
  Search,
  MapPin,
  ChevronUp,
  ChevronDown,
  Bookmark,
  Share2,
  User,
  Briefcase,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import mainImg from "../assets/main.png";
import FirstFooter from "../components/FirstFooter";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import ConfirmApplyModal from "../components/common/ConfirmApplyModal";

// API endpoints
const API_BASE = "http://localhost:9999/api";

// Skeleton Card Component
const SkeletonCard = () => (
  <div className="bg-white border rounded-lg shadow-sm p-4 animate-pulse">
    <div className="flex justify-between items-start mb-2">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

const FirstPage = () => {
  // State Management
  const [state, setState] = useState({
    jobQuery: "",
    locationQuery: "",
    isOpen: false,
    jobList: [],
    selectedJob: null,
    selectedJobDetails: null,
    loadingJobDetails: false,
    loadingJobs: false,
    jobPage: 1,
    jobTotalPages: 1,
    jobSuggestions: [],
    locationSuggestions: [],
    userRole: null,
    profileList: [],
    loadingProfiles: false,
    profilePage: 1,
    profileTotalPages: 1,
    appliedJobIds: [],
    showApplyModal: false,
    selectedJobIdToApply: null,
    savedJobIds: [],
  });

  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // Toast Notification Helper
  const showToast = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  // Handlers
  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const confirmApplyHandler = useCallback(async () => {
    updateState({ showApplyModal: false });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE}/job/apply/${state.selectedJobIdToApply}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        showToast("🎉 Application submitted!");
        updateState({ appliedJobIds: [...state.appliedJobIds, state.selectedJobIdToApply] });
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      showToast("⚠️ " + message, "error");

      const redirectTo = error.response?.data?.redirectTo;
      if (redirectTo) navigate(redirectTo);
    }
  }, [state.selectedJobIdToApply, navigate]);

  const handleApplyJob = (jobId) => {
    updateState({ selectedJobIdToApply: jobId, showApplyModal: true });
  };

  const fetchAppliedJobs = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${API_BASE}/job/applied`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        updateState({ appliedJobIds: res.data.data.map((job) => job._id) || [] });
      }
    } catch (err) {
      console.error("❌ Failed to fetch applied jobs", err);
      showToast("⚠️ Failed to fetch applied jobs", "error");
    }
  }, []);

  const fetchSavedJobs = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${API_BASE}/job/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success && Array.isArray(res.data.savedJobs)) {
        updateState({ savedJobIds: res.data.savedJobs.map((job) => job._id) });
      }
    } catch (err) {
      console.error("⚠️ Error fetching saved jobs", err);
      showToast("⚠️ Error fetching saved jobs", "error");
    }
  }, []);

  const toggleSaveJob = async (jobId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("⚠️ Please log in to save jobs", "error");
      return;
    }

    const isSaved = state.savedJobIds.includes(jobId);

    try {
      if (isSaved) {
        await axios.delete(`${API_BASE}/job/saved/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        updateState({ savedJobIds: state.savedJobIds.filter((id) => id !== jobId) });
        showToast("Job removed from saved list");
      } else {
        await axios.post(`${API_BASE}/job/save/${jobId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        updateState({ savedJobIds: [...state.savedJobIds, jobId] });
        showToast("Job saved successfully");
      }
    } catch (err) {
      console.error("⚠️ Error saving/removing job", err);
      showToast("⚠️ Error saving/removing job", "error");
    }
  };

  const fetchAllJobs = useCallback(async (page = 1) => {
    updateState({ loadingJobs: true });
    try {
      const response = await axios.get(`${API_BASE}/job/all-jobs?page=${page}&limit=10`);
      if (response.data.success && response.data.data) {
        updateState({
          jobList: response.data.data,
          jobTotalPages: response.data.pages || 1,
        });
        if (response.data.data.length > 0 && isLoggedIn) {
          handleJobClick(response.data.data[0]);
        }
      } else {
        showToast("No jobs found", "info");
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      showToast("⚠️ Failed to fetch jobs", "error");
    } finally {
      updateState({ loadingJobs: false });
    }
  }, [isLoggedIn]);

  const fetchAllProfiles = useCallback(async (token, page = 1) => {
    updateState({ loadingProfiles: true });
    try {
      const response = await axiosInstance.get(
        `/profile/all-profiles?page=${page}&limit=10${state.jobQuery ? `&skills=${state.jobQuery}` : ''}${state.locationQuery ? `&location=${state.locationQuery}` : ''}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        updateState({
          profileList: response.data.data,
          profileTotalPages: response.data.pages || 1,
        });
        if (response.data.data.length > 0 && !state.selectedJob) {
          updateState({ selectedJob: response.data.data[0] });
        }
      } else {
        showToast(response.data.message || "Failed to fetch profiles", "error");
      }
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
      showToast("Error fetching profiles. Update your company info", "error");
      navigate('/update-company-profile');
    } finally {
      updateState({ loadingProfiles: false });
    }
  }, [state.jobQuery, state.locationQuery, state.selectedJob, navigate]);

  const handleJobClick = async (job) => {
    if (!job?._id) return;

    updateState({ selectedJob: job, loadingJobDetails: true });

    try {
      const response = await axios.get(`${API_BASE}/job/${job._id}`);
      if (response.data.success) {
        updateState({ selectedJobDetails: response.data.data });
      } else {
        showToast("Failed to fetch job details", "error");
      }
    } catch (error) {
      console.error("Failed to fetch job details:", error);
      showToast("⚠️ Failed to fetch job details", "error");
      updateState({ selectedJobDetails: null });
    } finally {
      updateState({ loadingJobDetails: false });
    }
  };

  const handleSearch = useCallback(async () => {
    if (!state.jobQuery.trim() && !state.locationQuery.trim()) {
      fetchAllJobs(state.jobPage);
      return;
    }

    updateState({ loadingJobs: true });
    try {
      const response = await axios.get(`${API_BASE}/search/search`, {
        params: {
          job: state.jobQuery,
          location: state.locationQuery,
          page: state.jobPage,
          limit: 10,
        },
      });

      if (response.data.success) {
        updateState({
          jobList: response.data.data,
          jobTotalPages: response.data.pages || 1,
        });
        if (response.data.data.length > 0) {
          handleJobClick(response.data.data[0]);
        } else {
          updateState({ selectedJob: null, selectedJobDetails: null });
          showToast("No matching jobs found", "info");
        }
      } else {
        showToast("Search failed", "error");
      }
    } catch (error) {
      console.error("Search failed:", error);
      showToast("⚠️ Search failed", "error");
    } finally {
      updateState({ loadingJobs: false });
    }
  }, [state.jobQuery, state.locationQuery, state.jobPage, fetchAllJobs]);

  const handleShareJob = async (jobId) => {
    if (!jobId) return;

    const shareUrl = `${window.location.origin}/job-details/${jobId}`;
    const shareData = {
      title: state.selectedJobDetails?.job?.title || "Job Opportunity",
      text: `Check out this job: ${state.selectedJobDetails?.job?.title} at ${state.selectedJobDetails?.company?.name}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast("Job shared successfully");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showToast("🔗 Job link copied to clipboard!");
      }
    } catch (err) {
      console.error("⚠️ Failed to share job:", err);
      showToast("⚠️ Failed to share job", "error");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      updateState({ jobPage: 1, profilePage: 1 });
      if (state.userRole === "employer") {
        fetchAllProfiles(localStorage.getItem("token"), 1);
      } else {
        handleSearch();
      }
    }
  };

  const handleJobPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= state.jobTotalPages) {
      updateState({ jobPage: newPage });
    }
  };

  const handleProfilePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= state.profileTotalPages) {
      updateState({ profilePage: newPage });
    }
  };

  // Effect Hooks
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (state.jobQuery.trim()) {
        axios
          .get(`${API_BASE}/search/suggest/job-titles?query=${state.jobQuery}`)
          .then((res) => updateState({ jobSuggestions: res.data.data || [] }))
          .catch(() => updateState({ jobSuggestions: [] }));
      } else {
        updateState({ jobSuggestions: [] });
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [state.jobQuery]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (state.locationQuery.trim()) {
        axios
          .get(`${API_BASE}/search/suggest/locations?query=${state.locationQuery}`)
          .then((res) => updateState({ locationSuggestions: res.data.data || [] }))
          .catch(() => updateState({ locationSuggestions: [] }));
      } else {
        updateState({ locationSuggestions: [] });
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [state.locationQuery]);

  useEffect(() => {
    const checkAuthStatus = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setIsLoggedIn(true);
          updateState({ userRole: user?.role });
          if (user?.token && user?.role === "employer") {
            fetchAllProfiles(user.token, state.profilePage);
          }
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          localStorage.removeItem("user");
        }
      }
    };

    checkAuthStatus();
    fetchAllJobs(state.jobPage);
    if (isLoggedIn) fetchAppliedJobs();
  }, [isLoggedIn, state.jobPage, fetchAllJobs, fetchAppliedJobs, state.profilePage]);

  useEffect(() => {
    if (isLoggedIn && state.userRole !== "employer") {
      fetchSavedJobs();
    }
  }, [isLoggedIn, state.userRole, fetchSavedJobs]);

  useEffect(() => {
    if (state.jobQuery.trim() === "" && state.locationQuery.trim() === "") {
      fetchAllJobs(state.jobPage);
    }
  }, [state.jobQuery, state.locationQuery, state.jobPage, fetchAllJobs]);

  // Trending Data
  const trendingData = {
    "Trending Searches": ["Account Mumbai, Maharashtra"],
    "Trending Jobs": ["Net Remote", "Fresher Tamil Nadu", "Content Writer Remote"],
    "Popular Cities": ["Ludhiana, Punjab", "Kolkata, West Bengal"],
    "Popular Companies": ["American Express"],
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <ToastContainer />
      <ConfirmApplyModal
        isOpen={state.showApplyModal}
        onConfirm={confirmApplyHandler}
        onCancel={() => updateState({ showApplyModal: false })}
      />

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* Search Bar */}
        {isLoggedIn && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8 relative z-10">
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 relative">
                <div className="flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200">
                  <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={state.jobQuery}
                    onChange={(e) => updateState({ jobQuery: e.target.value })}
                    placeholder={state.userRole === "employer" ? "Search by skills (e.g., JavaScript, Python)" : "Job title, keywords, or company"}
                    onKeyPress={handleKeyPress}
                    className="w-full text-gray-700 placeholder-gray-500 bg-transparent border-none outline-none text-base focus:ring-0"
                  />
                </div>
                {state.jobSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl z-20 max-h-64 overflow-y-auto rounded-b-md">
                    {state.jobSuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => updateState({ jobQuery: item, jobSuggestions: [] })}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <Search className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-1 relative">
                <div className="flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={state.locationQuery}
                    onChange={(e) => updateState({ locationQuery: e.target.value })}
                    placeholder="City or location"
                    onKeyPress={handleKeyPress}
                    className="w-full text-gray-700 placeholder-gray-500 bg-transparent border-none outline-none text-base focus:ring-0"
                  />
                </div>
                {state.locationSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl z-20 max-h-64 overflow-y-auto rounded-b-md">
                    {state.locationSuggestions.map((city, idx) => (
                      <div
                        key={idx}
                        onClick={() => updateState({ locationQuery: city, locationSuggestions: [] })}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                        <span className="text-gray-700 text-sm">{city}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  updateState({ jobPage: 1, profilePage: 1 });
                  if (state.userRole === "employer") {
                    fetchAllProfiles(localStorage.getItem("token"), 1);
                  } else {
                    handleSearch();
                  }
                }}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-r-xl"
              >
                {state.userRole === "employer" ? "Search Candidates" : "Find Jobs"}
              </button>
            </div>
          </div>
        )}

        {/* Welcome Page for Non-Logged In Users */}
        {!isLoggedIn && (
          <div className="text-center mb-12">
            <img src={mainImg} alt="Main Visual" className="max-w-full h-auto mx-auto mb-8" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Indeed!</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create an account or sign in to see your personalized job recommendations.
            </p>
            <Link to="/signin">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 inline-flex items-center">
                Get Started
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
            <div className="mt-6 space-y-4 text-gray-600">
              <div>
                <a href="#" className="text-blue-600 hover:text-blue-700 underline font-medium">
                  Post your resume
                </a>
                <span className="text-gray-500"> - It only takes a few seconds</span>
              </div>
              <div>
                <Link to="/postJob" className="text-blue-600 hover:text-blue-700 underline font-medium">
                  Post a job on Indeed
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Employer View */}
        {isLoggedIn && state.userRole === "employer" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-4 max-h-screen overflow-y-auto pr-2">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Matched Candidates</h2>
              {state.loadingProfiles ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => <SkeletonCard key={index} />)}
                </div>
              ) : state.profileList.length > 0 ? (
                state.profileList.map((profile) => (
                  <div
                    key={profile._id}
                    onClick={() => updateState({ selectedJob: profile })}
                    className={`bg-white border rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      state.selectedJob?._id === profile._id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                        {profile.personalInfo?.firstName || "N/A"} {profile.personalInfo?.lastName || ""}
                      </h3>
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{profile.personalInfo?.location || "Location not specified"}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{profile.skills?.length || 0} skills</span>
                      <span>{profile.education?.[0]?.degree || "No education listed"}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-20">No matching profiles found.</div>
              )}
              {state.profileList.length > 0 && state.profileTotalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() => handleProfilePageChange(state.profilePage - 1)}
                    disabled={state.profilePage === 1}
                    className={`px-4 py-2 rounded-md ${
                      state.profilePage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Previous
                  </button>
                  {[...Array(state.profileTotalPages).keys()].map((num) => (
                    <button
                      key={num + 1}
                      onClick={() => handleProfilePageChange(num + 1)}
                      className={`px-4 py-2 rounded-md ${
                        state.profilePage === num + 1 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {num + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handleProfilePageChange(state.profilePage + 1)}
                    disabled={state.profilePage === state.profileTotalPages}
                    className={`px-4 py-2 rounded-md ${
                      state.profilePage === state.profileTotalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
            {state.profileList.length > 0 && (
              <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {state.selectedJob ? (
                  <>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                      {state.selectedJob.personalInfo?.firstName || "N/A"} {state.selectedJob.personalInfo?.lastName || ""}
                    </h1>
                    <p className="text-gray-600 mb-2">{state.selectedJob.personalInfo?.email || "Email not specified"}</p>
                    <p className="text-gray-600 mb-2">{state.selectedJob.personalInfo?.location || "Location not specified"}</p>
                    <p className="text-gray-600 text-sm mb-4">{state.selectedJob.personalInfo?.phone || "Phone not specified"}</p>
                    {state.selectedJob.skills?.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {state.selectedJob.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {state.selectedJob.education?.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Education</h3>
                        {state.selectedJob.education.map((edu, idx) => (
                          <div key={idx} className="text-sm text-gray-700 mb-1">
                            🎓 {edu.degree}, {edu.school} ({edu.graduationYear})
                          </div>
                        ))}
                      </div>
                    )}
                    {state.selectedJob.industryPreference && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <Briefcase className="w-5 h-5 mr-2 text-blue-600" /> Industry Preference
                        </h3>
                        <p className="text-gray-600">{state.selectedJob.industryPreference}</p>
                      </div>
                    )}
                    {state.selectedJob.resume?.previewUrl && (
                      <div className="mt-4">
                        📄 Resume:{" "}
                        <a
                          href={`https://docs.google.com/viewer?url=${encodeURIComponent(state.selectedJob.resume.previewUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View Resume
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-8 text-center text-gray-500">Select a candidate to view profile</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Job Seeker View */}
        {isLoggedIn && state.userRole !== "employer" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-4 max-h-screen overflow-y-auto pr-2">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Jobs for You</h2>
              {state.loadingJobs ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => <SkeletonCard key={index} />)}
                </div>
              ) : state.jobList.length > 0 ? (
                state.jobList.map((job) => (
                  <div
                    key={job._id}
                    onClick={() => handleJobClick(job)}
                    className={`bg-white border rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      state.selectedJob?._id === job._id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">{job.job?.title}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job._id);
                        }}
                      >
                        {state.savedJobIds.includes(job._id) ? (
                          <Bookmark className="w-5 h-5 text-blue-600 fill-blue-600" />
                        ) : (
                          <Bookmark className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{job.company?.name}</p>
                    <p className="text-gray-600 text-sm mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" /> {job.job?.location?.city}
                    </p>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">{job.job?.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>₹{job.payRange?.min} - ₹{job.payRange?.max}</span>
                      <span>{job.jobTypes?.join(", ")}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-20">No job postings found.</div>
              )}
              {state.jobList.length > 0 && state.jobTotalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() => handleJobPageChange(state.jobPage - 1)}
                    disabled={state.jobPage === 1}
                    className={`px-4 py-2 rounded-md ${
                      state.jobPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Previous
                  </button>
                  {[...Array(state.jobTotalPages).keys()].map((num) => (
                    <button
                      key={num + 1}
                      onClick={() => handleJobPageChange(num + 1)}
                      className={`px-4 py-2 rounded-md ${
                        state.jobPage === num + 1 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {num + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handleJobPageChange(state.jobPage + 1)}
                    disabled={state.jobPage === state.jobTotalPages}
                    className={`px-4 py-2 rounded-md ${
                      state.jobPage === state.jobTotalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {state.loadingJobDetails ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading job details...</p>
                </div>
              ) : state.selectedJobDetails ? (
                <>
                  <div className="border-b border-gray-200 pb-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{state.selectedJobDetails.job?.title}</h1>
                    <p className="text-gray-600 mb-2">
                      {state.selectedJobDetails.company?.name} • {state.selectedJobDetails.job?.location?.city}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      Up to ₹{state.selectedJobDetails.payRange?.max} a month
                    </p>
                    <div className="flex gap-3">
                      <button
                        disabled={!state.selectedJobDetails?._id || state.appliedJobIds.includes(state.selectedJobDetails._id)}
                        onClick={() => handleApplyJob(state.selectedJobDetails._id)}
                        className={`${
                          !state.selectedJobDetails?._id || state.appliedJobIds.includes(state.selectedJobDetails._id)
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300"
                            : "bg-blue-700 hover:bg-blue-800 text-white border border-blue-700 hover:border-blue-800 shadow-sm hover:shadow-md"
                        } font-medium px-8 py-3 rounded-md transition-all duration-200 text-sm uppercase tracking-wide min-w-[140px]`}
                      >
                        {state.appliedJobIds.includes(state.selectedJobDetails._id) ? "✅ Applied" : "Apply Now"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(state.selectedJobDetails._id);
                        }}
                        className={`border font-semibold px-4 py-2 rounded-lg transition-colors duration-200 ${
                          state.savedJobIds.includes(state.selectedJobDetails._id)
                            ? "border-blue-500 text-blue-600"
                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${state.savedJobIds.includes(state.selectedJobDetails._id) ? "fill-blue-600" : ""}`}
                        />
                      </button>
                      <button
                        onClick={() => handleShareJob(state.selectedJobDetails._id)}
                        className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                        onClick={() => {
                          const employerId = state.selectedJobDetails.company?.userId;
                          if (employerId) {
                            navigate(`/chat/${employerId}`);
                          } else {
                            showToast("Chat unavailable: Employer info missing", "error");
                          }
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                          />
                        </svg>
                        Contact Employer
                      </button>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Job Details</h3>
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-600 text-sm">₹</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Pay</p>
                          <p className="text-gray-600">
                            ₹{state.selectedJobDetails.payRange?.min} - ₹{state.selectedJobDetails.payRange?.max} a month
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-600 text-sm">💼</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Job Type</p>
                          <div className="flex gap-2 mt-1">
                            {state.selectedJobDetails.jobTypes?.map((type, index) => (
                              <span key={index} className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                ✓ {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Location</p>
                          <p className="text-gray-600">
                            {state.selectedJobDetails.job?.location?.city}, {state.selectedJobDetails.job?.location?.state}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Job Description</h3>
                      <div className="prose prose-sm max-w-none text-gray-700">
                        <p>{state.selectedJobDetails.job?.description}</p>
                      </div>
                    </div>
                    {state.selectedJobDetails.requiredSkills?.length > 0 && (
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-600 text-sm">🛠</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Required Skills</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {state.selectedJobDetails.requiredSkills.map((skill, index) => (
                              <span key={index} className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        🎓
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Graduate Required</p>
                        <p className="text-gray-600">{state.selectedJobDetails.graduateRequired ? "Yes" : "No"}</p>
                      </div>
                    </div>
                    <Link to={`/company/user/${state.selectedJobDetails.employer?._id}`} className="text-blue-600 hover:text-blue-800 underline">
                      View Company Details
                    </Link>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-gray-500">Select a job to view details</div>
              )}
            </div>
          </div>
        )}

        {/* Trending Section */}
        {!isLoggedIn && (
          <div className="bg-gray-50 py-12">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <button
                  onClick={() => updateState({ isOpen: !state.isOpen })}
                  className="inline-flex items-center gap-2 text-xl font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  What's Trending on Indeed
                  {state.isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
              {state.isOpen && (
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {Object.entries(trendingData).map(([category, items]) => (
                      <div key={category} className="space-y-4">
                        <h3 className="font-semibold text-gray-900 text-lg border-b border-gray-200 pb-2">{category}</h3>
                        <div className="space-y-3">
                          {items.map((item, index) => (
                            <a
                              key={index}
                              href="#"
                              className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                            >
                              {item}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <FirstFooter />
      </div>
    </div>
  );
};

export default FirstPage;