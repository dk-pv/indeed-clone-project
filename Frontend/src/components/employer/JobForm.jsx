export default function JobForm({
  register,
  errors,
  handleSubmit,
  formData,
  setValue,
  onSubmit,
  setActiveForm,
}) {
  // Exception handling wrapper for form submission
  const handleFormSubmit = async (data) => {
    try {
      if (!data) {
        throw new Error("Form data is required");
      }

      // Validate required fields
      if (!data.jobTitle?.trim()) {
        throw new Error("Job title is required");
      }

      if (!data.jobDescription?.trim()) {
        throw new Error("Job description is required");
      }

      if (!data.city?.trim()) {
        throw new Error("City is required");
      }

      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
      // You can add toast notification or other error handling here
      alert(`Error: ${error.message}`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
          <h2 className="text-2xl font-bold text-white mb-2">Job Details</h2>
          <p className="text-blue-100">
            Tell us about the position you're posting
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="px-8 py-6 space-y-6"
        >
          {/* Job Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("jobTitle", {
                required: "Job title is required",
                minLength: {
                  value: 2,
                  message: "Job title must be at least 2 characters",
                },
              })}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.jobTitle
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
              }`}
              placeholder="e.g. Software Engineer, Marketing Manager"
            />
            {errors.jobTitle && (
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
                  {errors.jobTitle.message}
                </p>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("jobDescription", {
                required: "Job description is required",
                minLength: {
                  value: 50,
                  message: "Job description must be at least 50 characters",
                },
              })}
              rows={5}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.jobDescription
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
              }`}
              placeholder="Describe the role, responsibilities, and requirements..."
            />
            {errors.jobDescription && (
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
                  {errors.jobDescription.message}
                </p>
              </div>
            )}
          </div>

          {/* Location Section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Job Location
            </h3>

            {/* Location Type */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Work Arrangement <span className="text-red-500">*</span>
              </label>
              <select
                {...register("locationType", {
                  required: "Location type is required",
                })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
              >
                <option value="">Select work arrangement</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              {errors.locationType && (
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
                    {errors.locationType.message}
                  </p>
                </div>
              )}
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("city", {
                  required: "City is required",
                  minLength: {
                    value: 2,
                    message: "City name must be at least 2 characters",
                  },
                })}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.city
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
                }`}
                placeholder="e.g. New York, London, Mumbai"
              />
              {errors.city && (
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
                    {errors.city.message}
                  </p>
                </div>
              )}
            </div>

            {/* Area and Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Area
                </label>
                <input
                  type="text"
                  {...register("area")}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  placeholder="e.g. Downtown, Suburb name"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Pincode
                </label>
                <input
                  type="text"
                  {...register("pincode", {
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "Pincode must be 6 digits",
                    },
                  })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.pincode
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
                  }`}
                  placeholder="123456"
                />
                {errors.pincode && (
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
                      {errors.pincode.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Street Address */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                {...register("address")}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                placeholder="e.g. 123 Main Street, Building Name"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => handleNavigation("account")}
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
