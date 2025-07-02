export default function PreferencesForm({
  register,
  errors,
  handleSubmit,
  formData,
  setValue,
  getValues,
  onSubmit,
  setActiveForm,
}) {
  // Exception handling wrapper for form submission
  const handleFormSubmit = async (data) => {
    try {
      if (!data) {
        throw new Error("Form data is required");
      }

      // Validate email format
      if (!data.email) {
        throw new Error("Primary email is required");
      }

      // Validate additional emails if provided
      if (data.additionalEmails && data.additionalEmails.length > 0) {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const invalidEmails = data.additionalEmails.filter(
          (email) => email.trim() && !emailRegex.test(email.trim())
        );

        if (invalidEmails.length > 0) {
          throw new Error(
            "Please enter valid email addresses for all additional emails"
          );
        }
      }

      await onSubmit(data);
    } catch (error) {
      console.error("Preferences form submission error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Exception handling for adding email
  const handleAddEmail = () => {
    try {
      if (
        !getValues ||
        !setValue ||
        typeof getValues !== "function" ||
        typeof setValue !== "function"
      ) {
        throw new Error("Form functions not available");
      }

      const currentEmails = getValues("additionalEmails") || [];
      setValue("additionalEmails", [...currentEmails, ""]);
    } catch (error) {
      console.error("Add email error:", error);
      alert("Unable to add email field. Please try again.");
    }
  };

  // Exception handling for additional email change
  const handleAdditionalEmailChange = (index, value) => {
    try {
      if (
        !getValues ||
        !setValue ||
        typeof getValues !== "function" ||
        typeof setValue !== "function"
      ) {
        throw new Error("Form functions not available");
      }

      if (typeof index !== "number" || index < 0) {
        throw new Error("Invalid email index");
      }

      const currentEmails = getValues("additionalEmails") || [];
      const newEmails = [...currentEmails];
      newEmails[index] = value;
      setValue("additionalEmails", newEmails);
    } catch (error) {
      console.error("Additional email change error:", error);
      alert("Unable to update email. Please try again.");
    }
  };

  // Exception handling for removing email
  const handleRemoveEmail = (index) => {
    try {
      if (
        !getValues ||
        !setValue ||
        typeof getValues !== "function" ||
        typeof setValue !== "function"
      ) {
        throw new Error("Form functions not available");
      }

      if (typeof index !== "number" || index < 0) {
        throw new Error("Invalid email index");
      }

      const currentEmails = getValues("additionalEmails") || [];
      const newEmails = currentEmails.filter((_, i) => i !== index);
      setValue("additionalEmails", newEmails);
    } catch (error) {
      console.error("Remove email error:", error);
      alert("Unable to remove email. Please try again.");
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
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Communication & Preferences
          </h2>
          <p className="text-blue-100">
            Set up communication preferences and application settings
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="px-8 py-6 space-y-8"
        >
          {/* Communication Preferences */}
          <div className="space-y-4">
            <label className="block text-lg font-bold text-gray-800">
              Communication Preferences
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Configure how you want to receive application updates
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
                  }`}
                  placeholder="Enter your primary email address"
                />
                {errors.email && (
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
                      {errors.email.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Emails */}
              {formData?.additionalEmails?.map((email, index) => (
                <div key={index} className="relative">
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        handleAdditionalEmailChange(index, e.target.value)
                      }
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300"
                      placeholder="Additional email address"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(index)}
                      className="px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddEmail}
                className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors duration-200"
              >
                <span className="text-xl mr-2 font-light">+</span>
                Add additional email
              </button>

              {/* Individual Email Checkbox */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="individual-emails"
                  {...register("individualEmails")}
                  className="mt-1 h-5 w-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                />
                <label
                  htmlFor="individual-emails"
                  className="text-sm text-gray-700 font-medium leading-relaxed"
                >
                  Send an individual email notification each time someone
                  applies for this position
                </label>
              </div>
            </div>
          </div>

          {/* Application Preferences */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <label className="block text-lg font-bold text-gray-800">
              Application Preferences
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Configure application requirements and candidate interaction
              settings
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="resume-required"
                  {...register("resumeRequired")}
                  className="mt-1 h-5 w-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                />
                <label
                  htmlFor="resume-required"
                  className="text-sm text-gray-700 font-medium leading-relaxed"
                >
                  Resume is required for all applications
                </label>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="contact-candidates"
                  {...register("contactCandidates")}
                  className="mt-1 h-5 w-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                />
                <label
                  htmlFor="contact-candidates"
                  className="text-sm text-gray-700 font-medium leading-relaxed"
                >
                  Allow potential candidates to contact you directly about this
                  job via email
                </label>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => handleNavigation("payBenefits")}
              className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 transform hover:scale-105"
            >
              ← Back
            </button>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => handleNavigation("preview")}
                className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 font-semibold rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
              >
                Preview Job
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Continue →
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
