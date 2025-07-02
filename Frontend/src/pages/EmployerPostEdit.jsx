import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    company: {
      name: "",
      contactPerson: "",
      phone: "",
      referralSource: "",
    },
    job: {
      title: "",
      description: "",
      location: {
        city: "",
        area: "",
        pincode: "",
        address: "",
      },
    },
    jobTypes: [],
    schedules: [],
    numberOfPeople: "",
    recruitmentTimeline: "",
    payRange: {
      min: "",
      max: "",
      currency: "INR",
    },
    supplementalPay: [],
    benefits: [],
    preferences: {
      email: "",
      additionalEmails: [],
      individualEmails: false,
      resumeRequired: false,
      contactCandidates: false,
    },
    status: "published",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }

        const response = await axios.get(
          `http://localhost:9999/api/job/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const job = response.data.data;
        setJobData(job);
        setLoading(false);
      } catch (error) {
        console.error("Job fetch error:", error);
        alert("Job data load ചെയ്യാൻ കഴിഞ്ഞില്ല");
        navigate("/my-posts");
      }
    };

    fetchJobData();
  }, [jobId, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const keys = name.split(".");
      setJobData((prev) => {
        let updated = { ...prev };
        let pointer = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          pointer[keys[i]] = { ...pointer[keys[i]] };
          pointer = pointer[keys[i]];
        }
        pointer[keys[keys.length - 1]] = type === "checkbox" ? checked : value;
        return updated;
      });
    } else {
      setJobData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleArrayChange = (field, value) => {
    setJobData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:9999/api/job/update/${jobId}`,
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Job updated successfully!");
      navigate("/my-posts");
    } catch (error) {
      console.error("Job update error:", error);
      alert("Job update ചെയ്യുന്നതിൽ error ഉണ്ടായി");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">
            Loading job details...
          </p>
        </div>
      </div>
    );
  }

  const referralSources = [
    "online_video",
    "mail",
    "streaming_audio",
    "tv",
    "word_of_mouth",
    "search_engine",
    "newspaper",
    "radio",
    "billboard",
    "podcast",
    "social_media",
    "other",
  ];

  const jobTypes = [
    "Full-time",
    "Permanent",
    "Fresher",
    "Part-time",
    "Internship",
    "Contractual / Temporary",
    "Freelance",
    "Volunteer",
  ];

  const schedules = [
    "Day shift",
    "Morning shift",
    "Rotational shift",
    "Night shift",
    "Monday to Friday",
    "Evening shift",
    "Weekend availability",
    "Fixed shift",
  ];

  const numberOfPeopleOptions = ["1", "2-5", "6-10", "11-25", "26-50", "50+"];

  const recruitmentTimelines = [
    "Immediate",
    "1-2 weeks",
    "2-4 weeks",
    "1-2 months",
    "Flexible",
  ];

  const supplementalPayOptions = [
    "Performance bonus",
    "Yearly bonus",
    "Commission pay",
    "Overtime pay",
    "Quarterly bonus",
    "Shift allowance",
    "Joining bonus",
    "Other",
  ];

  const benefitsOptions = [
    "Health insurance",
    "Provident Fund",
    "Cell phone reimbursement",
    "Paid sick time",
    "Work from home",
    "Paid time off",
    "Food provided",
    "Life insurance",
    "Dental insurance",
    "Flexible schedule",
    "Employee discount",
    "Retirement plan",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-8 py-6">
            <h1 className="text-2xl font-semibold text-white">
              Edit Job Posting
            </h1>
            <p className="text-blue-100 mt-1">
              Update your job details and requirements
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Company Information */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Company Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="company.name"
                    placeholder="Enter company name"
                    value={jobData.company.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    name="company.contactPerson"
                    placeholder="Enter contact person name"
                    value={jobData.company.contactPerson}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="company.phone"
                    placeholder="Enter phone number"
                    value={jobData.company.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How did you hear about us?
                  </label>
                  <select
                    name="company.referralSource"
                    value={jobData.company.referralSource}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select referral source</option>
                    {referralSources.map((src) => (
                      <option key={src} value={src}>
                        {src
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Job Details
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="job.title"
                    placeholder="e.g. Software Developer, Sales Manager"
                    value={jobData.job.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    name="job.description"
                    placeholder="Describe the job responsibilities, requirements, and qualifications..."
                    value={jobData.job.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    rows={6}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Job Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="job.location.city"
                    placeholder="Enter city"
                    value={jobData.job.location.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area/Locality
                  </label>
                  <input
                    type="text"
                    name="job.location.area"
                    placeholder="Enter area or locality"
                    value={jobData.job.location.area}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="job.location.pincode"
                    placeholder="Enter pincode"
                    value={jobData.job.location.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address
                  </label>
                  <input
                    type="text"
                    name="job.location.address"
                    placeholder="Enter complete address"
                    value={jobData.job.location.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Job Types */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Job Type
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {jobTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={jobData.jobTypes.includes(type)}
                      onChange={() => handleArrayChange("jobTypes", type)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Schedules */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Work Schedule
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {schedules.map((schedule) => (
                  <label
                    key={schedule}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={jobData.schedules.includes(schedule)}
                      onChange={() => handleArrayChange("schedules", schedule)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {schedule}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hiring Details */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Hiring Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of People to Hire
                  </label>
                  <select
                    name="numberOfPeople"
                    value={jobData.numberOfPeople}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select number of people</option>
                    {numberOfPeopleOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recruitment Timeline
                  </label>
                  <select
                    name="recruitmentTimeline"
                    value={jobData.recruitmentTimeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select timeline</option>
                    {recruitmentTimelines.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Compensation */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Compensation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Pay (₹)
                  </label>
                  <input
                    type="number"
                    name="payRange.min"
                    placeholder="e.g. 25000"
                    value={jobData.payRange.min}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Pay (₹)
                  </label>
                  <input
                    type="number"
                    name="payRange.max"
                    placeholder="e.g. 40000"
                    value={jobData.payRange.max}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Supplemental Pay
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {supplementalPayOptions.map((pay) => (
                    <label
                      key={pay}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={jobData.supplementalPay.includes(pay)}
                        onChange={() =>
                          handleArrayChange("supplementalPay", pay)
                        }
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{pay}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Benefits
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {benefitsOptions.map((benefit) => (
                  <label
                    key={benefit}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={jobData.benefits.includes(benefit)}
                      onChange={() => handleArrayChange("benefits", benefit)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {benefit}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Application Preferences */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Application Preferences
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Email for Applications
                  </label>
                  <input
                    type="email"
                    name="preferences.email"
                    placeholder="Enter email address"
                    value={jobData.preferences.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="preferences.individualEmails"
                      checked={jobData.preferences.individualEmails}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-700">
                        Send individual emails
                      </span>
                      <p className="text-xs text-gray-500">
                        Receive separate emails for each application
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="preferences.resumeRequired"
                      checked={jobData.preferences.resumeRequired}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-700">
                        Resume required
                      </span>
                      <p className="text-xs text-gray-500">
                        Applicants must submit a resume
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="preferences.contactCandidates"
                      checked={jobData.preferences.contactCandidates}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-700">
                        Allow direct candidate contact
                      </span>
                      <p className="text-xs text-gray-500">
                        Candidates can contact you directly
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Job Status */}
            <div className="pb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Job Status
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publication Status
                </label>
                <select
                  name="status"
                  value={jobData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors md:w-64"
                >
                  <option value="published">Published</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/my-posts")}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Job"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditJob;
