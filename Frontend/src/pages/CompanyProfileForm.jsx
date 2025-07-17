// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import useAlert from "../hooks/useAlert";
// import AlertMessage from "../components/common/AlertMessage";
// import { useNavigate } from "react-router-dom";

// const API_BASE = "http://localhost:9999/api/company"; // 🔁 Adjust if needed

// const strengthOptions = ["0-100", "100-500", "500+"];
// const fieldOptions = [
//   "IT",
//     "Healthcare",
//     "Finance",
//     "Education",
//     "Manufacturing",
//     "Retail",
//     "Construction",
//     "Telecommunication",
//     "Transportation",
//     "Agriculture",
//     "Hospitality",
//     "Media",
//     "Real Estate",
//     "Legal",
//     "Marketing",
//     "Government",
//     "Non-profit",
//     "Automotive",
//     "Aerospace",
//     "Biotechnology",
//     "Pharmaceuticals",
//     "Energy",
//     "Utilities",
//     "Mining",
//     "FMCG (Fast-moving consumer goods)", 
//     "E-commerce",
//     "Logistics",
//     "Food & Beverage",
//     "Entertainment",
//     "Sports",
//     "Fashion",
//     "Cybersecurity",
//     "Robotics",
//     "EdTech",
//     "FinTech",
//     "HealthTech",
//     "AgriTech",
//     "AI/ML",
//     "Blockchain",
//     "Game Development",
//     "Design & Creative",
//     "Consulting",
//     "HR & Staffing",
//     "Research & Development",
//     "Marine",
//     "Insurance",
//     "Printing & Publishing",
//     "Event Management",
//     "Recycling & Waste Management",
//     "Other",
// ];

// const CompanyProfileForm = () => {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();
//   const [loading, setLoading] = useState(false);
//   const { alert, showAlert, hideAlert } = useAlert();
//   const navigate = useNavigate();

//   // 🟡 Fetch existing profile
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem("token");
//         const res = await axios.get(API_BASE, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (res.data.success) {
//           reset(res.data.data); // Auto-fill form
//         }
//       } catch (err) {
//         console.log("No existing profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [reset]);

//   const onSubmit = async (data) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await axios.post(API_BASE, data, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.data.success) {
//         showAlert("Company profile saved successfully!", "success");
//         localStorage.setItem("hasCompanyProfile", "true");
//         navigate("/EmployerHome", { replace: true });
//       }
//     } catch (err) {
//       console.error(err);
//       showAlert("Failed to save company profile", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
//       <h2 className="text-xl font-bold mb-4">Company Profile</h2>

//       {alert && (
//         <AlertMessage
//           type={alert.type}
//           message={alert.message}
//           onClose={hideAlert}
//         />
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         {/* Company Name */}
//         <div>
//           <label className="block font-medium">Company Name</label>
//           <input
//             type="text"
//             {...register("name", { required: "Company name is required" })}
//             className="input"
//           />
//           {errors.name && <p className="text-red-500">{errors.name.message}</p>}
//         </div>

//         {/* Strength */}
//         <div>
//           <label className="block font-medium">Company Strength</label>
//           <select
//             {...register("strength", { required: "Select strength" })}
//             className="input"
//           >
//             <option value="">-- Select --</option>
//             {strengthOptions.map((opt) => (
//               <option key={opt} value={opt}>
//                 {opt}
//               </option>
//             ))}
//           </select>
//           {errors.strength && (
//             <p className="text-red-500">{errors.strength.message}</p>
//           )}
//         </div>

//         {/* Location */}
//         <div>
//           <label className="block font-medium">Location</label>
//           <input
//             type="text"
//             {...register("location", { required: "Location is required" })}
//             className="input"
//           />
//           {errors.location && (
//             <p className="text-red-500">{errors.location.message}</p>
//           )}
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block font-medium">Company Email</label>
//           <input
//             type="email"
//             {...register("email", {
//               required: "Email is required",
//               pattern: {
//                 value: /^\S+@\S+\.\S+$/,
//                 message: "Invalid email format",
//               },
//             })}
//             className="input"
//           />
//           {errors.email && (
//             <p className="text-red-500">{errors.email.message}</p>
//           )}
//         </div>

//         {/* Field */}
//         <div>
//           <label className="block font-medium">Company Field</label>
//           <select
//             {...register("field", { required: "Select a field" })}
//             className="input"
//           >
//             <option value="">-- Select --</option>
//             {fieldOptions.map((opt) => (
//               <option key={opt} value={opt}>
//                 {opt}
//               </option>
//             ))}
//           </select>
//           {errors.field && (
//             <p className="text-red-500">{errors.field.message}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           {loading ? "Saving..." : "Save Profile"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CompanyProfileForm;



import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import useAlert from "../hooks/useAlert";
import AlertMessage from "../components/common/AlertMessage";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:9999/api/company"; // 🔁 Adjust if needed

const strengthOptions = ["0-100", "100-500", "500+"];
const fieldOptions = [
  "IT",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Construction",
    "Telecommunication",
    "Transportation",
    "Agriculture",
    "Hospitality",
    "Media",
    "Real Estate",
    "Legal",
    "Marketing",
    "Government",
    "Non-profit",
    "Automotive",
    "Aerospace",
    "Biotechnology",
    "Pharmaceuticals",
    "Energy",
    "Utilities",
    "Mining",
    "FMCG (Fast-moving consumer goods)", 
    "E-commerce",
    "Logistics",
    "Food & Beverage",
    "Entertainment",
    "Sports",
    "Fashion",
    "Cybersecurity",
    "Robotics",
    "EdTech",
    "FinTech",
    "HealthTech",
    "AgriTech",
    "AI/ML",
    "Blockchain",
    "Game Development",
    "Design & Creative",
    "Consulting",
    "HR & Staffing",
    "Research & Development",
    "Marine",
    "Insurance",
    "Printing & Publishing",
    "Event Management",
    "Recycling & Waste Management",
    "Other",
];

const CompanyProfileForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();
  const navigate = useNavigate();

  // 🟡 Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(API_BASE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          reset(res.data.data); // Auto-fill form
        }
      } catch (err) {
        console.log("No existing profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(API_BASE, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        showAlert("Company profile saved successfully!", "success");
        localStorage.setItem("hasCompanyProfile", "true");
        navigate("/EmployerHome", { replace: true });
      }
    } catch (err) {
      console.error(err);
      showAlert("Failed to save company profile", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Company Profile</h2>
            <p className="text-gray-600">Complete your company information to attract top talent</p>
          </div>

          {alert && (
            <AlertMessage
              type={alert.type}
              message={alert.message}
              onClose={hideAlert}
            />
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("name", { required: "Company name is required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                placeholder="Enter your company name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Strength */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Strength <span className="text-red-500">*</span>
              </label>
              <select
                {...register("strength", { required: "Select strength" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none bg-white"
              >
                <option value="">Select company size</option>
                {strengthOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} employees
                  </option>
                ))}
              </select>
              {errors.strength && (
                <p className="mt-1 text-sm text-red-600">{errors.strength.message}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("location", { required: "Location is required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                placeholder="Enter company location"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email format",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                placeholder="Enter company email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Field <span className="text-red-500">*</span>
              </label>
              <select
                {...register("field", { required: "Select a field" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none bg-white"
              >
                <option value="">Select industry</option>
                {fieldOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.field && (
                <p className="mt-1 text-sm text-red-600">{errors.field.message}</p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileForm;