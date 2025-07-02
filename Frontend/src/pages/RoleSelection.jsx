


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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h2 className="text-xl font-semibold mb-6">Select your role</h2>

      <div className="space-y-4 mb-6">
        <label className="block">
          <input
            type="radio"
            value="jobSeeker"
            checked={selectedRole === "jobSeeker"}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="mr-2"
          />
          Job Seeker
        </label>
        <label className="block">
          <input
            type="radio"
            value="employer"
            checked={selectedRole === "employer"}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="mr-2"
          />
          Employer
        </label>
      </div>

      <button
        onClick={handleContinue}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Continue
      </button>
    </div>
  );
};

export default RoleSelection;
