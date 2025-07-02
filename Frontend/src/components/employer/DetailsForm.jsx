import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { jobTypes, scheduleOptions } from "./constants";

export default function DetailsForm({
  register,
  errors,
  handleSubmit,
  formData,
  setValue,
  getValues,
  onSubmit,
  setActiveForm,
}) {
  const [showMoreSchedule, setShowMoreSchedule] = useState(false);

  // Exception handling wrapper for form submission
  const handleFormSubmit = async (data) => {
    try {
      if (!data) {
        throw new Error("Form data is required");
      }

      // Validate required fields
      if (!data.jobTypes || data.jobTypes.length === 0) {
        throw new Error("Please select at least one job type");
      }

      if (!data.numberOfPeople) {
        throw new Error("Please select number of people to hire");
      }

      if (!data.recruitmentTimeline) {
        throw new Error("Please select recruitment timeline");
      }

      await onSubmit(data);
    } catch (error) {
      console.error("Details form submission error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Exception handling for job type toggle
  const handleJobTypeToggle = (type) => {
    try {
      if (
        !getValues ||
        !setValue ||
        typeof getValues !== "function" ||
        typeof setValue !== "function"
      ) {
        throw new Error("Form functions not available");
      }

      const currentTypes = getValues("jobTypes") || [];
      const newTypes = currentTypes.includes(type)
        ? currentTypes.filter((t) => t !== type)
        : [...currentTypes, type];

      setValue("jobTypes", newTypes);
    } catch (error) {
      console.error("Job type toggle error:", error);
      alert("Unable to update job type. Please try again.");
    }
  };

  // Exception handling for schedule toggle
  const handleScheduleToggle = (schedule) => {
    try {
      if (
        !getValues ||
        !setValue ||
        typeof getValues !== "function" ||
        typeof setValue !== "function"
      ) {
        throw new Error("Form functions not available");
      }

      const currentSchedules = getValues("schedules") || [];
      const newSchedules = currentSchedules.includes(schedule)
        ? currentSchedules.filter((s) => s !== schedule)
        : [...currentSchedules, schedule];

      setValue("schedules", newSchedules);
    } catch (error) {
      console.error("Schedule toggle error:", error);
      alert("Unable to update schedule. Please try again.");
    }
  };

  // Exception handling for navigation
  const handleNavigation = (formName) => {
    try {
      if (!setActiveForm || typeof setActiveForm !== "function") {
        throw new Error("Navigation function not available");
      }
      setActiveForm(formName);
    } catch (error) {
      console.error("Navigation error:", error);
      alert("Unable to navigate. Please try again.");
    }
  };

  // Exception handling for show more toggle
  const handleShowMoreToggle = () => {
    try {
      setShowMoreSchedule(!showMoreSchedule);
    } catch (error) {
      console.error("Show more toggle error:", error);
    }
  };

  const visibleSchedules = showMoreSchedule
    ? scheduleOptions
    : scheduleOptions.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Job Details & Requirements
          </h2>
          <p className="text-blue-100">
            Specify the type of position and hiring details
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="px-8 py-6 space-y-8"
        >
          {/* Job Type */}
          <div className="space-y-4">
            <label className="block text-lg font-bold text-gray-800">
              Job Type <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Select all that apply to this position
            </p>
            <div className="flex flex-wrap gap-3">
              {jobTypes?.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleJobTypeToggle(type)}
                  className={`px-6 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                    formData?.jobTypes?.includes(type)
                      ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-600 shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            {errors.jobTypes && (
              <div className="flex items-center space-x-2 mt-3">
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-600 text-sm font-medium">
                  {errors.jobTypes.message}
                </p>
              </div>
            )}
          </div>

          {/* Schedule */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <label className="block text-lg font-bold text-gray-800">
              Schedule
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Choose the work schedules that apply (optional)
            </p>
            <div className="flex flex-wrap gap-3">
              {visibleSchedules?.map((schedule) => (
                <button
                  key={schedule}
                  type="button"
                  onClick={() => handleScheduleToggle(schedule)}
                  className={`px-6 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                    formData?.schedules?.includes(schedule)
                      ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-600 shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  {schedule}
                </button>
              ))}
            </div>
            {scheduleOptions && scheduleOptions.length > 4 && (
              <button
                type="button"
                onClick={handleShowMoreToggle}
                className="mt-4 flex items-center text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors duration-200"
              >
                {showMoreSchedule ? "Show less" : "Show 5 more"}
                <ChevronDown
                  className={`ml-2 w-4 h-4 transition-transform duration-200 ${
                    showMoreSchedule ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>

          {/* Number of People */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <label className="block text-lg font-bold text-gray-800">
              Number of People to Hire <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-3">
              How many people do you want to hire for this position?
            </p>
            <div className="relative">
              <select
                {...register("numberOfPeople", {
                  required: "Please select how many people you want to hire",
                })}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer ${
                  errors.numberOfPeople
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
                }`}
              >
                <option value="">Select number of hires</option>
                <option value="1">1 person</option>
                <option value="2-5">2-5 people</option>
                <option value="6-10">6-10 people</option>
                <option value="11-25">11-25 people</option>
                <option value="26-50">26-50 people</option>
                <option value="50+">50+ people</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.numberOfPeople && (
              <div className="flex items-center space-x-2 mt-2">
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-600 text-sm font-medium">
                  {errors.numberOfPeople.message}
                </p>
              </div>
            )}
          </div>

          {/* Recruitment Timeline */}
          <div className="space-y-3">
            <label className="block text-lg font-bold text-gray-800">
              Recruitment Timeline <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-600 mb-3">
              When do you need to fill this position?
            </p>
            <div className="relative">
              <select
                {...register("recruitmentTimeline", {
                  required: "Please select a recruitment timeline",
                })}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer ${
                  errors.recruitmentTimeline
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
                }`}
              >
                <option value="">Select timeline</option>
                <option value="Immediate">Immediate (ASAP)</option>
                <option value="1-2 weeks">1-2 weeks</option>
                <option value="2-4 weeks">2-4 weeks</option>
                <option value="1-2 months">1-2 months</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {errors.recruitmentTimeline && (
              <div className="flex items-center space-x-2 mt-2">
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-600 text-sm font-medium">
                  {errors.recruitmentTimeline.message}
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => handleNavigation("job")}
              className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 transform hover:scale-105"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Continue →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
