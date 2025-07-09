import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Search,
  MapPin,
  ChevronUp,
  ChevronDown,
  User,
} from "lucide-react";

import FirstFooter from "../../components/FirstFooter";
import { AuthContext } from "../../context/AuthContext";
import GuestView from "./GuestView";
import EmployerView from "./EmployerView";
import JobSeekerView from "./JobSeekerView";

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

  // Profile data state (for employers)
  const [profileList, setProfileList] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  // Auth context
  const { isLoggedIn, setIsLoggedIn, user } = useContext(AuthContext);

  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  // API endpoints
  const API_BASE = "http://localhost:9999/api";

  // Initialize component
  useEffect(() => {
    checkAuthStatus();
    if (isLoggedIn && user?.role === "employer") {
      fetchAllProfiles();
    } else {
      fetchAllJobs();
    }
  }, [isLoggedIn, user?.role]);

  // Auto fetch all jobs when search input is cleared (for job seekers)
  useEffect(() => {
    if (jobQuery.trim() === "" && locationQuery.trim() === "" && (!isLoggedIn || user?.role !== "employer")) {
      fetchAllJobs();
    }
  }, [jobQuery, locationQuery, isLoggedIn, user?.role]);

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

  // Fetch all jobs (for job seekers)
  const fetchAllJobs = async () => {
    try {
      const response = await axios.get(`${API_BASE}/job/all`);
      if (response.data.success && response.data.data) {
        setJobList(response.data.data);
        // Auto-select first job if available and user is logged in
        if (response.data.data.length > 0 && isLoggedIn && user?.role === "jobseeker") {
          handleJobClick(response.data.data[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  // Fetch all profiles (for employers)
  const fetchAllProfiles = async () => {
    const token = localStorage.getItem("token");
    setLoadingProfiles(true);

    try {
      const response = await axios.get(`${API_BASE}/profile/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success && response.data.data) {
        setProfileList(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedProfile(response.data.data[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch profiles:", error.response?.data || error.message);
    } finally {
      setLoadingProfiles(false);
    }
  };

  // Handle job selection (for job seekers)
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

  // Handle search (for job seekers)
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
      if (isLoggedIn && user?.role === "employer") {
        // Handle profile search if implemented
      } else {
        handleSearch();
      }
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
                {isLoggedIn && user?.role === "employer" ? (
                  <User className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                ) : (
                  <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                )}
                <input
                  type="text"
                  value={jobQuery}
                  onChange={(e) => setJobQuery(e.target.value)}
                  placeholder={
                    isLoggedIn && user?.role === "employer"
                      ? "Search candidates by skills"
                      : "Job title, keywords, or company"
                  }
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
                onClick={
                  isLoggedIn && user?.role === "employer"
                    ? () => {} // Add profile search functionality if needed
                    : handleSearch
                }
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoggedIn && user?.role === "employer" ? "Find candidates" : "Find jobs"}
              </button>
            </div>
          </div>
        </div>

        {/* Render appropriate view based on auth status */}
        {!isLoggedIn ? (
          <GuestView 
            jobQuery={jobQuery}
            locationQuery={locationQuery}
            setJobQuery={setJobQuery}
            setLocationQuery={setLocationQuery}
            handleKeyPress={handleKeyPress}
            handleSearch={handleSearch}
          />
        ) : user?.role === "employer" ? (
          <EmployerView
            profileList={profileList}
            selectedProfile={selectedProfile}
            setSelectedProfile={setSelectedProfile}
            loadingProfiles={loadingProfiles}
            jobQuery={jobQuery}
            setJobQuery={setJobQuery}
            locationQuery={locationQuery}
            setLocationQuery={setLocationQuery}
            handleKeyPress={handleKeyPress}
            handleSearch={handleSearch}
          />
        ) : (
          <JobSeekerView
            jobList={jobList}
            selectedJob={selectedJob}
            selectedJobDetails={selectedJobDetails}
            loadingJobDetails={loadingJobDetails}
            handleJobClick={handleJobClick}
            jobQuery={jobQuery}
            setJobQuery={setJobQuery}
            locationQuery={locationQuery}
            setLocationQuery={setLocationQuery}
            handleKeyPress={handleKeyPress}
            handleSearch={handleSearch}
          />
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