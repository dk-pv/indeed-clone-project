import { useNavigate } from "react-router-dom";
import { useState } from "react";

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  const handleContinue = () => {
    if (!selectedRole) return alert("Please select a role");

    localStorage.setItem("userRole", selectedRole);

    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join Indeed
            </h1>
            <p className="text-lg text-gray-600">
              Select your role to get started
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="space-y-4 mb-8">
            {/* Job Seeker Card */}
            <div
              className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedRole === "jobSeeker"
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => setSelectedRole("jobSeeker")}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedRole === "jobSeeker"
                        ? "border-blue-600 bg-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedRole === "jobSeeker" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Job Seeker
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Find your next job opportunity
                  </p>
                </div>
              </div>
              <input
                type="radio"
                value="jobSeeker"
                checked={selectedRole === "jobSeeker"}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="sr-only"
              />
            </div>

            {/* Employer Card */}
            <div
              className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedRole === "employer"
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => setSelectedRole("employer")}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedRole === "employer"
                        ? "border-blue-600 bg-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedRole === "employer" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Employer
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Post jobs and find candidates
                  </p>
                </div>
              </div>
              <input
                type="radio"
                value="employer"
                checked={selectedRole === "employer"}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="sr-only"
              />
            </div>
          </div>

          {/* Continue Button */}
          <div className="mb-6">
            <button
              onClick={handleContinue}
              disabled={!selectedRole}
              className={`w-full py-3 px-4 rounded-lg font-medium text-base transition-all duration-200 ${
                selectedRole
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>

          {/* Footer Text */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              By continuing, you agree to Indeed's{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
