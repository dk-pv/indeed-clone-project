import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Mail, Phone, MapPin, User } from "lucide-react";

const JSProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gray-600 flex items-center justify-center">
          <User className="text-white" size={28} />
        </div>
        <h1 className="text-3xl font-bold underline text-gray-800">Add name</h1>
      </div>

      <div className="mt-6 space-y-4 text-gray-700">
        <div className="flex items-center gap-2">
          <Mail size={18} />
          <span>{user?.email || "example@email.com"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={18} />
          <button className="text-blue-600 underline">Add phone number</button>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={18} />
          <button className="text-blue-600 underline">Add location</button>
        </div>
      </div>

      <div className="mt-6 bg-green-100 text-green-800 px-4 py-3 rounded-md flex items-center justify-between">
        <span className="flex items-center gap-2 font-medium">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
          </svg>
          Employers can find you
        </span>
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Resume</h2>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white border border-gray-300 rounded-md shadow text-blue-600 font-medium hover:bg-gray-50">
            Upload Resume
          </button>
          <button className="px-6 py-3 bg-white border border-gray-300 rounded-md shadow text-blue-600 font-medium hover:bg-gray-50">
            Build an Indeed Resume
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          By continuing, you agree to receive job opportunities from Indeed.
        </p>
      </div>
    </div>
  );
};

export default JSProfile;
