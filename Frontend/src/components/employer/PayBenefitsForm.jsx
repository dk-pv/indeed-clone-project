import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";

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

const benefitOptions = [
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

export default function PayBenefitsForm({
  register,
  errors,
  handleSubmit,
  formData,
  setValue,
  getValues,
  onSubmit,
  setActiveForm,
}) {
  const [showMoreBenefits, setShowMoreBenefits] = useState(false);

  // Exception handling wrapper for form submission
  const handleFormSubmit = async (data) => {
    try {
      if (!data) {
        throw new Error("Form data is required");
      }

      // Validate pay range
      if (data.payRange?.min && data.payRange?.max) {
        const minAmount = parseFloat(data.payRange.min.replace(/[^0-9.]/g, ""));
        const maxAmount = parseFloat(data.payRange.max.replace(/[^0-9.]/g, ""));

        if (minAmount >= maxAmount) {
          throw new Error("Maximum amount must be greater than minimum amount");
        }
      }

      await onSubmit(data);
    } catch (error) {
      console.error("Pay benefits form submission error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Exception handling for supplemental pay toggle
  const handleSupplementalPayToggle = (item) => {
    try {
      if (
        !getValues ||
        !setValue ||
        typeof getValues !== "function" ||
        typeof setValue !== "function"
      ) {
        throw new Error("Form functions not available");
      }

      const currentPay = getValues("supplementalPay") || [];
      const newPay = currentPay.includes(item)
        ? currentPay.filter((i) => i !== item)
        : [...currentPay, item];

      setValue("supplementalPay", newPay);
    } catch (error) {
      console.error("Supplemental pay toggle error:", error);
      alert("Unable to update supplemental pay. Please try again.");
    }
  };

  // Exception handling for benefit toggle
  const handleBenefitToggle = (item) => {
    try {
      if (
        !getValues ||
        !setValue ||
        typeof getValues !== "function" ||
        typeof setValue !== "function"
      ) {
        throw new Error("Form functions not available");
      }

      const currentBenefits = getValues("benefits") || [];
      const newBenefits = currentBenefits.includes(item)
        ? currentBenefits.filter((i) => i !== item)
        : [...currentBenefits, item];

      setValue("benefits", newBenefits);
    } catch (error) {
      console.error("Benefit toggle error:", error);
      alert("Unable to update benefits. Please try again.");
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
      setShowMoreBenefits(!showMoreBenefits);
    } catch (error) {
      console.error("Show more toggle error:", error);
    }
  };

  // Exception handling for pay range input
  const handlePayRangeChange = (field, value) => {
    try {
      if (!setValue || typeof setValue !== "function") {
        throw new Error("Form function not available");
      }
      setValue(`payRange.${field}`, value);
    } catch (error) {
      console.error("Pay range update error:", error);
      alert("Unable to update pay range. Please try again.");
    }
  };

  const visibleBenefits = showMoreBenefits
    ? benefitOptions
    : benefitOptions.slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
          <h2 className="text-2xl font-bold text-white mb-2">Pay & Benefits</h2>
          <p className="text-blue-100">
            Define compensation and benefits package
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="px-8 py-6 space-y-8"
        >
          {/* Pay Section */}
          <div className="space-y-4">
            <label className="block text-lg font-bold text-gray-800">
              Salary Range
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Specify the monthly salary range for this position
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Minimum Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={formData?.payRange?.min || ""}
                    onChange={(e) =>
                      handlePayRangeChange("min", e.target.value)
                    }
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300"
                    placeholder="e.g., 25,000"
                  />
                </div>
                <span className="text-xs text-gray-500">per month</span>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Maximum Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={formData?.payRange?.max || ""}
                    onChange={(e) =>
                      handlePayRangeChange("max", e.target.value)
                    }
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-300"
                    placeholder="e.g., 35,000"
                  />
                </div>
                <span className="text-xs text-gray-500">per month</span>
              </div>
            </div>
          </div>

          {/* Supplemental Pay Section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <label className="block text-lg font-bold text-gray-800">
              Supplemental Pay
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Select additional compensation options (optional)
            </p>

            <div className="flex flex-wrap gap-3">
              {supplementalPayOptions?.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSupplementalPayToggle(option)}
                  className={`flex items-center px-6 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                    formData?.supplementalPay?.includes(option)
                      ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-600 shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  <span className="mr-2">
                    {formData?.supplementalPay?.includes(option) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-lg font-light">+</span>
                    )}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <label className="block text-lg font-bold text-gray-800">
              Benefits
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Choose benefits to offer with this position (optional)
            </p>

            <div className="flex flex-wrap gap-3">
              {visibleBenefits?.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleBenefitToggle(option)}
                  className={`flex items-center px-6 py-3 text-sm font-medium rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                    formData?.benefits?.includes(option)
                      ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-600 shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm"
                  }`}
                >
                  <span className="mr-2">
                    {formData?.benefits?.includes(option) ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-lg font-light">+</span>
                    )}
                  </span>
                  {option}
                </button>
              ))}
            </div>

            {benefitOptions && benefitOptions.length > 8 && (
              <button
                type="button"
                onClick={handleShowMoreToggle}
                className="mt-4 flex items-center text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors duration-200"
              >
                {showMoreBenefits
                  ? "Show less"
                  : `Show ${benefitOptions.length - 8} more`}
                <ChevronDown
                  className={`ml-2 w-4 h-4 transition-transform duration-200 ${
                    showMoreBenefits ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => handleNavigation("details")}
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
