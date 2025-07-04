// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import {
//   Search,
//   MapPin,
//   ChevronUp,
//   ChevronDown,
//   Bookmark,
//   Share2,
//   Eye,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import mainImg from "../assets/main.png";
// import FirstFooter from "../components/FirstFooter";
// import { AuthContext } from "../context/AuthContext";

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

//   // Auth context
//   const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

//   const [jobSuggestions, setJobSuggestions] = useState([]);
//   const [locationSuggestions, setLocationSuggestions] = useState([]);

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

//   // API endpoints
//   const API_BASE = "http://localhost:9999/api";

//   // Initialize component
//   useEffect(() => {
//     checkAuthStatus();
//     fetchAllJobs();
//   }, []);

//   // Auto fetch all jobs when search input is cleared
//   useEffect(() => {
//     if (jobQuery.trim() === "" && locationQuery.trim() === "") {
//       fetchAllJobs();
//     }
//   }, [jobQuery, locationQuery]);

//   // Check authentication status
//   const checkAuthStatus = () => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const user = JSON.parse(storedUser);
//         setIsLoggedIn(true);
//       } catch (error) {
//         console.error("Failed to parse stored user:", error);
//         localStorage.removeItem("user");
//       }
//     }
//   };

//   // Fetch all jobs
//   const fetchAllJobs = async () => {
//     try {
//       const response = await axios.get(`${API_BASE}/job/all`);
//       if (response.data.success && response.data.data) {
//         setJobList(response.data.data);
//         // Auto-select first job if available and user is logged in
//         if (response.data.data.length > 0 && isLoggedIn) {
//           handleJobClick(response.data.data[0]);
//         }
//       }
//     } catch (error) {
//       console.error("Failed to fetch jobs:", error);
//     }
//   };

//   // Handle job selection
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
//       fetchAllJobs();
//       return;
//     }

//     try {
//       const response = await axios.get(`${API_BASE}/search/search`, {
//         params: { job: jobQuery, location: locationQuery },
//       });

//       if (response.data.success) {
//         setJobList(response.data.data);
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

//   // Handle key press
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
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
//       {/* Main Content */}
//       <div className="w-full max-w-6xl mx-auto px-4 py-8 flex-grow">
//         {/* Search Bar */}
//         <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-8">
//           <div className="flex flex-col md:flex-row">
//             {/* Job Title Input */}
//             <div className="flex-1">
//               <div className="flex items-center px-4 py-4 border-b md:border-b-0 md:border-r border-gray-200">
//                 <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
//                 <input
//                   type="text"
//                   value={jobQuery}
//                   onChange={(e) => setJobQuery(e.target.value)}
//                   placeholder="Job title, keywords, or company"
//                   onKeyPress={handleKeyPress}
//                   className="w-full text-gray-700 placeholder-gray-500 bg-transparent border-none outline-none text-base"
//                 />
//                 {jobSuggestions.length > 0 && (
//                   <ul className="absolute z-10 bg-white border border-gray-200 w-full max-h-40 overflow-y-auto shadow-md rounded-md">
//                     {jobSuggestions.map((item, idx) => (
//                       <li
//                         key={idx}
//                         onClick={() => {
//                           setJobQuery(item);
//                           setJobSuggestions([]);
//                         }}
//                         className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
//                       >
//                         {item}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </div>

//             {/* Location Input */}
//             <div className="flex-1">
//               <div className="flex items-center px-4 py-4 border-b md:border-b-0 md:border-r border-gray-200">
//                 <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
//                 <input
//                   type="text"
//                   value={locationQuery}
//                   onChange={(e) => setLocationQuery(e.target.value)}
//                   placeholder="City or location"
//                   onKeyPress={handleKeyPress}
//                   className="w-full text-gray-700 placeholder-gray-500 bg-transparent border-none outline-none text-base"
//                 />
//                 {locationSuggestions.length > 0 && (
//                   <ul className="absolute z-10 bg-white border border-gray-200 w-full max-h-40 overflow-y-auto shadow-md rounded-md">
//                     {locationSuggestions.map((city, idx) => (
//                       <li
//                         key={idx}
//                         onClick={() => {
//                           setLocationQuery(city);
//                           setLocationSuggestions([]);
//                         }}
//                         className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
//                       >
//                         {city}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </div>

//             {/* Search Button */}
//             <div className="flex-shrink-0">
//               <button
//                 onClick={handleSearch}
//                 className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//               >
//                 Find jobs
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Welcome Page for Non-Logged In Users */}
//         {!isLoggedIn && (
//           <>
//             <div className="w-full mb-8">
//               <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
//                 <img
//                   src={mainImg}
//                   alt="Indeed main visual"
//                   className="max-h-full max-w-full object-contain"
//                 />
//               </div>
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

//         {/* Job List and Details for Logged In Users */}
//         {isLoggedIn && (
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
//                       <Bookmark className="w-5 h-5 text-gray-400 hover:text-gray-600" />
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
//                       <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200">
//                         Apply now
//                       </button>
//                       <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200">
//                         <Bookmark className="w-4 h-4" />
//                       </button>
//                       <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200">
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200">
//                         <Share2 className="w-4 h-4" />
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

//                     {/* Company Info */}
//                     {selectedJobDetails.company && (
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                           About {selectedJobDetails.company.name}
//                         </h3>
//                         <p className="text-gray-700">
//                           {selectedJobDetails.company.description ||
//                             "Company information not available."}
//                         </p>
//                       </div>
//                     )}
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

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Search,
  MapPin,
  ChevronUp,
  ChevronDown,
  Bookmark,
  Share2,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import mainImg from "../assets/main.png";
import FirstFooter from "../components/FirstFooter";
import { AuthContext } from "../context/AuthContext";

const FirstPage = () => {
  // Search and UI state
  const [jobQuery, setJobQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Job data state
  const [jobList, setJobList] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [loadingJobDetails, setLoadingJobDetails] = useState(false);

  // Auth context
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (jobQuery.trim()) {
        axios
          .get(`${API_BASE}/search/suggest/job-titles?query=${jobQuery}`)
          .then((res) => setJobSuggestions(res.data.data || []))
          .catch(() => setJobSuggestions([]));
      } else {
        setJobSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [jobQuery]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (locationQuery.trim()) {
        axios
          .get(`${API_BASE}/search/suggest/locations?query=${locationQuery}`)
          .then((res) => setLocationSuggestions(res.data.data || []))
          .catch(() => setLocationSuggestions([]));
      } else {
        setLocationSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [locationQuery]);

  // API endpoints
  const API_BASE = "http://localhost:9999/api";

  // Initialize component
  useEffect(() => {
    checkAuthStatus();
    fetchAllJobs();
  }, []);

  // Auto fetch all jobs when search input is cleared
  useEffect(() => {
    if (jobQuery.trim() === "" && locationQuery.trim() === "") {
      fetchAllJobs();
    }
  }, [jobQuery, locationQuery]);

  // Check authentication status
  const checkAuthStatus = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
  };

  // Fetch all jobs
  const fetchAllJobs = async () => {
    try {
      const response = await axios.get(`${API_BASE}/job/all`);
      if (response.data.success && response.data.data) {
        setJobList(response.data.data);
        // Auto-select first job if available and user is logged in
        if (response.data.data.length > 0 && isLoggedIn) {
          handleJobClick(response.data.data[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  // Handle job selection
  const handleJobClick = async (job) => {
    if (!job?._id) return;

    setSelectedJob(job);
    setLoadingJobDetails(true);

    try {
      const response = await axios.get(`${API_BASE}/job/${job._id}`);
      if (response.data.success) {
        setSelectedJobDetails(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch job details:", error);
      setSelectedJobDetails(null);
    } finally {
      setLoadingJobDetails(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!jobQuery.trim() && !locationQuery.trim()) {
      fetchAllJobs();
      return;
    }

    try {
      const response = await axios.get(`${API_BASE}/search/search`, {
        params: { job: jobQuery, location: locationQuery },
      });

      if (response.data.success) {
        setJobList(response.data.data);
        // Auto-select first result if available
        if (response.data.data.length > 0) {
          handleJobClick(response.data.data[0]);
        } else {
          setSelectedJob(null);
          setSelectedJobDetails(null);
        }
      }
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Trending data
  const trendingData = {
    "Trending Searches": ["Account Mumbai, Maharashtra"],
    "Trending Jobs": [
      "Net Remote",
      "Fresher Tamil Nadu",
      "Content Writer Remote",
    ],
    "Popular Cities": ["Ludhiana, Punjab", "Kolkata, West Bengal"],
    "Popular Companies": ["American Express"],
  };

  // Toggle trending dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto px-4 py-8 flex-grow">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-visible mb-8 relative">
          <div className="flex flex-col md:flex-row">
            {/* Job Title Input */}
            <div className="flex-1 relative">
              <div className="flex items-center px-4 py-4 border-b md:border-b-0 md:border-r border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={jobQuery}
                  onChange={(e) => setJobQuery(e.target.value)}
                  placeholder="Job title, keywords, or company"
                  onKeyPress={handleKeyPress}
                  className="w-full text-gray-700 placeholder-gray-500 bg-transparent border-none outline-none text-base"
                />
              </div>
              {/* Job Suggestions Dropdown */}
              {jobSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl z-[100] max-h-64 overflow-y-auto rounded-b-md">
                  {jobSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setJobQuery(item);
                        setJobSuggestions([]);
                      }}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <Search className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location Input */}
            <div className="flex-1 relative">
              <div className="flex items-center px-4 py-4 border-b md:border-b-0 md:border-r border-gray-200">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="City or location"
                  onKeyPress={handleKeyPress}
                  className="w-full text-gray-700 placeholder-gray-500 bg-transparent border-none outline-none text-base"
                />
              </div>
              {/* Location Suggestions Dropdown */}
              {locationSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl z-[100] max-h-64 overflow-y-auto rounded-b-md">
                  {locationSuggestions.map((city, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setLocationQuery(city);
                        setLocationSuggestions([]);
                      }}
                      className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <MapPin className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{city}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <div className="flex-shrink-0">
              <button
                onClick={handleSearch}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Find jobs
              </button>
            </div>
          </div>
        </div>

        {/* Welcome Page for Non-Logged In Users */}
        {!isLoggedIn && (
          <>
            <div className="w-full mb-8">
              <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <img
                  src={mainImg}
                  alt="Indeed main visual"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome to Indeed!
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Create an account or sign in to see your personalised job
                recommendations.
              </p>

              <Link to="/signin">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 mb-8 inline-flex items-center">
                  Get Started
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </Link>

              <div className="space-y-4 text-gray-600">
                <div>
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-700 underline font-medium"
                  >
                    Post your resume
                  </a>
                  <span className="text-gray-500">
                    {" "}
                    - It only takes a few seconds
                  </span>
                </div>
                <div>
                  <Link
                    to="/postJob"
                    className="text-blue-600 hover:text-blue-700 underline font-medium"
                  >
                    Post a job on Indeed
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Job List and Details for Logged In Users */}
        {isLoggedIn && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Job List */}
            <div className="lg:col-span-2 space-y-4 max-h-screen overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Jobs for you
              </h2>
              {jobList.length > 0 ? (
                jobList.map((job) => (
                  <div
                    key={job._id}
                    onClick={() => handleJobClick(job)}
                    className={`bg-white border rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedJob?._id === job._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                        {job.job?.title}
                      </h3>
                      <Bookmark className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </div>

                    <p className="text-gray-600 text-sm mb-2">
                      {job.company?.name}
                    </p>

                    <p className="text-gray-600 text-sm mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.job?.location?.city}
                    </p>

                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                      {job.job?.description}
                    </p>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>
                        ₹{job.payRange?.min} - ₹{job.payRange?.max}
                      </span>
                      <span>{job.jobTypes?.join(", ")}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-20">
                  No job postings found.
                </div>
              )}
            </div>

            {/* Job Details */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200">
              {loadingJobDetails ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading job details...</p>
                </div>
              ) : selectedJobDetails ? (
                <div className="p-6">
                  {/* Job Header */}
                  <div className="border-b border-gray-200 pb-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                      {selectedJobDetails.job?.title}
                    </h1>
                    <p className="text-gray-600 mb-2">
                      {selectedJobDetails.company?.name} •{" "}
                      {selectedJobDetails.job?.location?.city}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      Up to ₹{selectedJobDetails.payRange?.max} a month
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200">
                        Apply now
                      </button>
                      <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200">
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Job details
                      </h3>

                      {/* Pay */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-600 text-sm">₹</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Pay</p>
                          <p className="text-gray-600">
                            ₹{selectedJobDetails.payRange?.min} - ₹
                            {selectedJobDetails.payRange?.max} a month
                          </p>
                        </div>
                      </div>

                      {/* Job Type */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-600 text-sm">💼</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Job type</p>
                          <div className="flex gap-2 mt-1">
                            {selectedJobDetails.jobTypes?.map((type, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                              >
                                ✓ {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Location</p>
                          <p className="text-gray-600">
                            {selectedJobDetails.job?.location?.city},{" "}
                            {selectedJobDetails.job?.location?.state}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Job Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Job Description
                      </h3>
                      <div className="prose prose-sm max-w-none text-gray-700">
                        <p>{selectedJobDetails.job?.description}</p>
                      </div>
                    </div>

                    {/* Company Info */}
                    {selectedJobDetails.company && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          About {selectedJobDetails.company.name}
                        </h3>
                        <p className="text-gray-700">
                          {selectedJobDetails.company.description ||
                            "Company information not available."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>Select a job to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Trending Section (Non-Logged In Users Only) */}
      {!isLoggedIn && (
        <div className="bg-gray-50 py-12">
          <div className="w-full max-w-6xl mx-auto px-4">
            <div className="text-center mb-8">
              <button
                onClick={toggleDropdown}
                className="inline-flex items-center gap-2 text-xl font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                What's trending on Indeed
                {isOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>

            {isOpen && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {Object.entries(trendingData).map(([category, items]) => (
                    <div key={category} className="space-y-4">
                      <h3 className="font-semibold text-gray-900 text-lg border-b border-gray-200 pb-2">
                        {category}
                      </h3>
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

      {/* Footer */}
      <FirstFooter />
    </div>
  );
};

export default FirstPage;