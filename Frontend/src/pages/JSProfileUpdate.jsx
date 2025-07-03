
// import React, { useState, useMemo, useContext, useEffect } from "react";
// import { ChevronLeft } from "lucide-react";
// import countryList from "react-select-country-list";
// import Select from "react-select";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { AuthContext } from "../context/AuthContext";

// const JSProfileUpdate = () => {
//   const { user } = useContext(AuthContext);
//   const options = useMemo(() => countryList().getData(), []);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     phone: "",
//     email: "",
//     streetAddress: "",
//     cityState: "",
//     pincode: "",
//     showNumberOnIndeed: true,
//     country: { label: "India", value: "IN" },
//   });

//   // ✅ Pre-fill email from user (context)
//   useEffect(() => {
//     if (user?.email) {
//       setFormData((prev) => ({
//         ...prev,
//         email: user.email,
//       }));
//     }
//   }, [user]);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleCountryChange = (value) => {
//     setFormData((prev) => ({ ...prev, country: value }));
//   };

//   const handleSave = () => {
//     console.log("Form data:", {
//       ...formData,
//       country: formData.country?.label || "",
//     });
//     // TODO: Submit to backend
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-2xl mx-auto bg-white">
//         {/* Header */}
//         <div className="flex items-center p-4 border-b border-gray-200">
//           <ChevronLeft className="w-6 h-6 text-gray-600 mr-3 cursor-pointer" />
//           <h1 className="text-xl font-semibold text-gray-900">
//             Contact information
//           </h1>
//         </div>

//         {/* Form Content */}
//         <div className="p-6">
//           <p className="text-gray-600 mb-6">
//             Please fill out the form below. *required
//           </p>

//           {/* First Name */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               First name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {/* Last Name */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Last name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {/* Phone Number */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Phone <span className="text-red-500">*</span>
//             </label>
//             <PhoneInput
//               country={"in"}
//               value={formData.phone}
//               onChange={(phone) =>
//                 setFormData((prev) => ({ ...prev, phone }))
//               }
//               inputStyle={{
//                 width: "100%",
//                 height: "40px",
//                 borderRadius: "6px",
//               }}
//             />
//           </div>

//           {/* Email */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Email <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {/* Location Section */}
//           <div className="mb-8">
//             <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>

//             {/* Country */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Country <span className="text-red-500">*</span>
//               </label>
//               <Select
//                 options={options}
//                 value={formData.country}
//                 onChange={handleCountryChange}
//                 className="text-sm"
//               />
//             </div>

//             {/* Street Address */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Street address
//               </label>
//               <p className="text-xs text-gray-500 mb-2">
//                 Not shown to employers.
//               </p>
//               <input
//                 type="text"
//                 name="streetAddress"
//                 value={formData.streetAddress}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             {/* City, State */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 City, State <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="cityState"
//                 value={formData.cityState}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             {/* Pincode */}
//             <div className="mb-8">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Pincode
//               </label>
//               <input
//                 type="text"
//                 name="pincode"
//                 value={formData.pincode}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* Save Button */}
//           <button
//             onClick={handleSave}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
//           >
//             Save
//           </button>
//         </div>

//         {/* Footer */}
//         <div className="p-4 text-center text-xs text-gray-500 border-t border-gray-200">
//           ©2025 Indeed - Cookies, Privacy and Terms
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JSProfileUpdate;



import React, { useState, useMemo, useContext, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import countryList from "react-select-country-list";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const JSProfileUpdate = () => {
  const options = useMemo(() => countryList().getData(), []);
  const { user } = useContext(AuthContext);
  const navigate  = useNavigate()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: user?.email || "",
    streetAddress: "",
    cityState: "",
    pincode: "",
    showNumberOnIndeed: true,
    country: { label: "India", value: "IN" },
  });

  const token = localStorage.getItem("token");

  // 🔄 Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:9999/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = res.data.data;
        setFormData({
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          phone: profile.phone || "",
          email: profile.email || user?.email || "",
          streetAddress: profile.streetAddress || "",
          cityState: profile.cityState || "",
          pincode: profile.pincode || "",
          showNumberOnIndeed: profile.showNumberOnIndeed ?? true,
          country: profile.country || { label: "India", value: "IN" },
        });
      } catch (err) {
        console.error("Profile fetch error:", err.response?.data || err.message);
      }
    };

    if (token) fetchProfile();
  }, [token, user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCountryChange = (value) => {
    setFormData((prev) => ({ ...prev, country: value }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.post(
        "http://localhost:9999/api/profile/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Profile saved:", res.data);
      navigate('/profile')
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <ChevronLeft className="w-6 h-6 text-gray-600 mr-3 cursor-pointer" />
          <h1 className="text-xl font-semibold text-gray-900">Contact information</h1>
        </div>

        {/* Form */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">Please fill out the form below. *required</p>

          {/* First Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">First name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Last Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Last name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
            <PhoneInput
              country={"in"}
              value={formData.phone}
              onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
              inputStyle={{ width: "100%", height: "40px", borderRadius: "6px" }}
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>

            {/* Country */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
              <Select
                options={options}
                value={formData.country}
                onChange={handleCountryChange}
              />
            </div>

            {/* Street Address */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Street address</label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* City State */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">City, State *</label>
              <input
                type="text"
                name="cityState"
                value={formData.cityState}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Pincode */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Checkbox */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="showNumberOnIndeed"
                checked={formData.showNumberOnIndeed}
                onChange={handleInputChange}
                className="mr-2 w-4 h-4"
              />
              Show my number to employers on Indeed
            </label>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
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
