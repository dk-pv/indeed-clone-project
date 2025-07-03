// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { Mail, Phone, MapPin, User } from "lucide-react";
// import { AuthContext } from "../context/AuthContext";
// import axios from "axios";

// const JSProfile = () => {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [profile, setProfile] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get("http://localhost:9999/api/profile", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setProfile(res.data.data);
//       } catch (err) {
//         console.error("Failed to load profile:", err.message);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleNavigate = () => {
//     navigate("/updateProfile");
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-3xl mx-auto p-6">
//         {/* Profile Header */}
//         <div className="pb-6">
//           <div className="flex items-center gap-4 mb-4">
//             <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
//               <User className="text-white" size={32} />
//             </div>
//             <div>
//               <button
//                 onClick={handleNavigate}
//                 className="text-2xl font-semibold text-blue-700 hover:underline cursor-pointer bg-transparent border-none p-0"
//               >
//                 {profile?.firstName
//                   ? `${profile.firstName} ${profile.lastName}`
//                   : "Add name"}
//               </button>
//               <p className="text-gray-600 text-sm mt-1">
//                 Complete your profile to stand out
//               </p>
//             </div>
//           </div>

//           {/* Contact Information */}
//           <div className="space-y-3 text-sm">
//             <div className="flex items-center gap-3">
//               <Mail size={16} className="text-gray-500" />
//               <span className="text-gray-700">
//                 {profile?.email || user?.email}
//               </span>
//             </div>
//             <div className="flex items-center gap-3">
//               <Phone size={16} className="text-gray-500" />
//               <button
//                 onClick={handleNavigate}
//                 className="text-blue-700 hover:underline text-sm bg-transparent border-none p-0"
//               >
//                 {profile?.phone ? profile.phone : "Add phone number"}
//               </button>
//             </div>
//             <div className="flex items-center gap-3">
//               <MapPin size={16} className="text-gray-500" />
//               <button
//                 onClick={handleNavigate}
//                 className="text-blue-700 hover:underline text-sm bg-transparent border-none p-0"
//               >
//                 {profile?.cityState || "Add location"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Status Banner */}
//         <div className="mt-6 bg-green-50 text-green-800 px-4 py-3 rounded-md">
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//             <span className="font-medium text-sm">Employers can find you</span>
//           </div>
//           <p className="text-xs text-green-700 mt-1">
//             Your profile is visible to employers on Indeed
//           </p>
//         </div>

//         {/* Resume Section */}
//         <div className="mt-8">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-semibold text-gray-900">Resume</h2>
//             <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//               Required
//             </span>
//           </div>

//           <div className="bg-gray-50 rounded-lg p-8 text-center">
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <button className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 font-medium text-sm">
//                   Upload Resume
//                 </button>
//                 <p className="text-xs text-gray-600">DOC, DOCX, PDF (5 MB)</p>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="flex-1 border-t border-gray-300"></div>
//                 <span className="text-xs text-gray-500 bg-white px-2">or</span>
//                 <div className="flex-1 border-t border-gray-300"></div>
//               </div>

//               <button className="px-6 py-2 bg-white border border-blue-700 text-blue-700 rounded-md hover:bg-blue-50 font-medium text-sm">
//                 Build an Indeed Resume
//               </button>
//             </div>
//           </div>

//           <p className="text-xs text-gray-500 mt-4 text-center">
//             By continuing, you agree to receive job opportunities from Indeed.
//           </p>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-white py-4 mt-auto">
//         <div className="max-w-3xl mx-auto px-6">
//           <div className="flex items-center justify-center text-xs text-gray-500">
//             <span>©2025 Indeed - </span>
//             <button className="hover:underline ml-1">Cookies</button>
//             <span className="mx-1">,</span>
//             <button className="hover:underline">Privacy</button>
//             <span className="mx-1"> and </span>
//             <button className="hover:underline">Terms</button>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default JSProfile;


import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, User } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const JSProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:9999/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data.data);
      } catch (err) {
        console.error("Failed to load profile:", err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleNavigate = () => {
    navigate("/updateProfile");
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post(
        "http://localhost:9999/api/profile/upload-resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Resume uploaded successfully!");
      console.log("File URL:", res.data.fileUrl);
      setProfile((prev) => ({
        ...prev,
        resumeUrl: res.data.fileUrl,
      }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Resume upload failed.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-6">
        {/* Profile Header */}
        <div className="pb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="text-white" size={32} />
            </div>
            <div>
              <button
                onClick={handleNavigate}
                className="text-2xl font-semibold text-blue-700 hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                {profile?.firstName
                  ? `${profile.firstName} ${profile.lastName}`
                  : "Add name"}
              </button>
              <p className="text-gray-600 text-sm mt-1">
                Complete your profile to stand out
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gray-500" />
              <span className="text-gray-700">
                {profile?.email || user?.email}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-gray-500" />
              <button
                onClick={handleNavigate}
                className="text-blue-700 hover:underline text-sm bg-transparent border-none p-0"
              >
                {profile?.phone ? profile.phone : "Add phone number"}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-gray-500" />
              <button
                onClick={handleNavigate}
                className="text-blue-700 hover:underline text-sm bg-transparent border-none p-0"
              >
                {profile?.cityState || "Add location"}
              </button>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div className="mt-6 bg-green-50 text-green-800 px-4 py-3 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-medium text-sm">Employers can find you</span>
          </div>
          <p className="text-xs text-green-700 mt-1">
            Your profile is visible to employers on Indeed
          </p>
        </div>

        {/* Resume Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Resume</h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Required
            </span>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <div className="space-y-4">
              <div className="space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

                <button
                  onClick={handleUploadClick}
                  className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 font-medium text-sm"
                >
                  Upload Resume
                </button>

                <p className="text-xs text-gray-600">DOC, DOCX, PDF (5 MB)</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="text-xs text-gray-500 bg-white px-2">or</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <button className="px-6 py-2 bg-white border border-blue-700 text-blue-700 rounded-md hover:bg-blue-50 font-medium text-sm">
                Build an Indeed Resume
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            By continuing, you agree to receive job opportunities from Indeed.
          </p>
        </div>

        {profile?.resumeUrl && (
          <div className="mt-4 text-center">
            <a
              href={`http://localhost:9999${profile.resumeUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="text-blue-700 underline">View Uploaded Resume</button>
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white py-4 mt-auto">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <span>©2025 Indeed - </span>
            <button className="hover:underline ml-1">Cookies</button>
            <span className="mx-1">,</span>
            <button className="hover:underline">Privacy</button>
            <span className="mx-1"> and </span>
            <button className="hover:underline">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JSProfile;
