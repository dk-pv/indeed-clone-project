import React, { useState } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";
const JSProfileUpdate = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    streetAddress: "",
    cityState: "",
    pincode: "",
    showNumberOnIndeed: true,
  });

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("India");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    console.log("Form data:", formData);
    // Handle form submission logic here
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <ChevronLeft className="w-6 h-6 text-gray-600 mr-3 cursor-pointer" />
          <h1 className="text-xl font-semibold text-gray-900">
            Contact information
          </h1>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Please fill out the form below. *required
          </p>

          {/* First Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Last Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <div className="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                <div className="flex items-center">
                  <div className="w-6 h-4 bg-orange-500 relative mr-2">
                    <div className="absolute top-0 left-0 w-6 h-1.5 bg-orange-500"></div>
                    <div className="absolute top-1.5 left-0 w-6 h-1 bg-white"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-1.5 bg-green-600"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-blue-800 rounded-full bg-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-800 rounded-full"></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-700 mr-1">+91</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Show number on Indeed checkbox */}
          <div className="mb-6">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="showNumberOnIndeed"
                checked={formData.showNumberOnIndeed}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Show my number on Indeed
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-2 ml-6">
              By submitting the form with this box ticked, you confirm that you
              are the primary user and subscriber to the telephone number
              provided, and you agree to receive calls (including using
              artificial or pre-recorded voice), texts and WhatsApp messages
              from Indeed and employers who use Indeed on the telephone number
              provided above.
            </p>
          </div>

          {/* Email */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="flex items-center justify-between">
              <span className="text-gray-900">{formData.email}</span>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                Edit <span className="ml-1">→</span>
              </button>
            </div>
          </div>

          {/* Location Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>

            {/* Country */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{selectedCountry}</span>
                <button
                  onClick={() =>
                    setIsCountryDropdownOpen(!isCountryDropdownOpen)
                  }
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Street Address */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street address
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Not shown to employers.
              </p>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* City, State */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City, State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cityState"
                value={formData.cityState}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Pincode */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
          >
            Save
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 text-center text-xs text-gray-500 border-t border-gray-200">
          ©2025 Indeed - Cookies, Privacy and Terms
        </div>
      </div>
    </div>
  );
};

export default JSProfileUpdate;
