import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import AlertMessage from "../common/AlertMessage";
import useAlert from "../../hooks/useAlert";

export default function AccountForm({
  register,
  errors,
  handleSubmit,
  formData,
  setValue,
  onSubmit,
}) {
  const { alert, showAlert, hideAlert } = useAlert();

  // Enhanced exception handling for form submission
  const handleFormSubmit = async (data) => {
    try {
      // Validate data exists
      if (!data) {
        throw new Error("Form data is required");
      }

      // Enhanced validation with specific field checks
      const missingFields = [];

      if (!data.companyName?.trim()) missingFields.push("Company name");
      if (!data.fullName?.trim()) missingFields.push("Full name");
      if (!formData?.phone?.trim()) missingFields.push("Phone number");
      if (!data.referralSource) missingFields.push("Referral source");

      if (missingFields.length > 0) {
        showAlert(
          "error",
          `Please fill in the following required fields: ${missingFields.join(
            ", "
          )}`
        );
        return;
      }

      // Enhanced phone validation
      if (formData?.phone) {
        const phoneDigits = formData.phone.replace(/\D/g, "");
        if (phoneDigits.length < 10) {
          showAlert(
            "error",
            "Please enter a valid phone number with at least 10 digits."
          );
          return;
        }
      }

      // Validate company name length
      if (data.companyName && data.companyName.trim().length < 2) {
        showAlert("error", "Company name must be at least 2 characters long.");
        return;
      }

      // Validate full name format
      if (data.fullName && !data.fullName.trim().includes(" ")) {
        showAlert("error", "Please enter both first and last name.");
        return;
      }

      await onSubmit(data);
      showAlert("success", "Account created successfully! Welcome to Indeed!");
    } catch (error) {
      console.error("Account form submission error:", error);
      showAlert(
        "error",
        "Something went wrong. Please try again or contact support."
      );
    }
  };

  // Exception handling for phone input
  const handlePhoneChange = (value) => {
    try {
      if (!setValue || typeof setValue !== "function") {
        throw new Error("setValue function not available");
      }
      setValue("phone", value);
    } catch (error) {
      console.error("Phone input error:", error);
      showAlert("error", "Unable to update phone number. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Create Your Account
          </h2>
          <p className="text-blue-100">
            Join thousands of employers finding great talent
          </p>
        </div>

        <div className="px-8 py-6">
          {/* Alert Message */}
          {alert && (
            <div className="mb-6">
              <AlertMessage
                type={alert.type}
                message={alert.message}
                onClose={hideAlert}
              />
            </div>
          )}

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Company Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("companyName", {
                  required: "Company name is required",
                  minLength: {
                    value: 2,
                    message: "Company name must be at least 2 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9\s&.,'-]+$/,
                    message: "Company name contains invalid characters",
                  },
                })}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.companyName
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
                }`}
                placeholder="e.g. Tech Solutions Inc."
              />
              {errors.companyName && (
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
                    {errors.companyName.message}
                  </p>
                </div>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                First and Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 3,
                    message: "Please enter both first and last name",
                  },
                  pattern: {
                    value: /^[a-zA-Z\s'-]+$/,
                    message:
                      "Name can only contain letters, spaces, hyphens, and apostrophes",
                  },
                  validate: (value) => {
                    if (!value.trim().includes(" ")) {
                      return "Please enter both first and last name";
                    }
                    return true;
                  },
                })}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.fullName
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
                }`}
                placeholder="e.g. John Smith"
              />
              {errors.fullName && (
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
                    {errors.fullName.message}
                  </p>
                </div>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 bg-white overflow-hidden">
                  <PhoneInput
                    country={"in"}
                    value={formData?.phone}
                    onChange={handlePhoneChange}
                    inputProps={{
                      name: "phone",
                      required: true,
                    }}
                    inputStyle={{
                      width: "100%",
                      height: "48px",
                      border: "none",
                      fontSize: "1rem",
                      paddingLeft: "60px",
                      backgroundColor: "transparent",
                      outline: "none",
                      borderRadius: "0",
                    }}
                    buttonStyle={{
                      border: "none",
                      backgroundColor: "transparent",
                      height: "48px",
                      width: "60px",
                      borderRadius: "0",
                    }}
                    containerStyle={{
                      width: "100%",
                      border: "none",
                    }}
                    dropdownStyle={{
                      border: "2px solid #e5e7eb",
                      borderRadius: "0.75rem",
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      marginTop: "4px",
                    }}
                  />
                </div>
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-blue-700">
                      For account management communication. Not visible to
                      jobseekers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Source */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                How did you hear about us?{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register("referralSource", {
                    required: "Please select how you heard about us",
                  })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer ${
                    errors.referralSource
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300 focus:border-blue-500"
                  }`}
                >
                  <option value="">Select an option</option>
                  <option value="online_video">Online video</option>
                  <option value="mail">Mail</option>
                  <option value="streaming_audio">
                    Streaming audio (e.g., Spotify, Pandora)
                  </option>
                  <option value="tv">TV</option>
                  <option value="word_of_mouth">Word of mouth</option>
                  <option value="search_engine">
                    Search engine (e.g., Google, Bing, Yahoo)
                  </option>
                  <option value="newspaper">Newspaper</option>
                  <option value="radio">Radio (AM/FM/XM)</option>
                  <option value="billboard">Billboard</option>
                  <option value="podcast">Podcast</option>
                  <option value="social_media">Social media</option>
                  <option value="other">Other</option>
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
              {errors.referralSource && (
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
                    {errors.referralSource.message}
                  </p>
                </div>
              )}
            </div>

            {/* Terms and Privacy Notice */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-semibold">
                    By continuing, you agree to Indeed's
                  </span>{" "}
                  <a
                    href="/terms"
                    className="text-blue-700 hover:text-blue-800 hover:underline font-medium transition-colors"
                  >
                    Terms of Service
                  </a>
                  ,{" "}
                  <a
                    href="/privacy"
                    className="text-blue-700 hover:text-blue-800 hover:underline font-medium transition-colors"
                  >
                    Privacy Policy
                  </a>
                  , and{" "}
                  <a
                    href="/cookie"
                    className="text-blue-700 hover:text-blue-800 hover:underline font-medium transition-colors"
                  >
                    Cookie Policy
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Continue Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Continue
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
            </div>
          </form>

          {/* Help Section */}
          <div className="mt-6 text-center pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Need help?{" "}
              <a
                href="/contact"
                className="text-blue-700 hover:text-blue-800 hover:underline font-medium transition-colors"
              >
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
