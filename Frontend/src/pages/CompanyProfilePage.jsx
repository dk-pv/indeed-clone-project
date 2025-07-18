import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const CompanyProfilePage = () => {
  const { userId } = useParams(); // assuming userId is the company ID
  const [company, setCompany] = useState(null);
  const [error, setError] = useState("");
  const API_BASE = "http://localhost:9999/api";

  const fetchCompany = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(`${API_BASE}/company/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompany(res.data.data);
    } catch (error) {
      console.error("Company fetch failed", error);
      setError("Failed to load company details.");
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  if (error) return <div className="flex justify-center items-center min-h-screen"><div className="text-lg text-red-600">{error}</div></div>;
  if (!company) return <div className="flex justify-center items-center min-h-screen"><div className="text-lg text-gray-600">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {company.name ? company.name.charAt(0).toUpperCase() : "C"}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {company.name}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-1">Email</dt>
                  <dd className="text-base text-gray-900">{company.email}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-1">Location</dt>
                  <dd className="text-base text-gray-900">{company.location}</dd>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-1">Field</dt>
                  <dd className="text-base text-gray-900">{company.field}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-1">Company Strength</dt>
                  <dd className="text-base text-gray-900">{company.strength}</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;