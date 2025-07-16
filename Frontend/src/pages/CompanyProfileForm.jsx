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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold mb-4">Company Profile</h2>

      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={hideAlert}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Company Name */}
        <div>
          <label className="block font-medium">Company Name</label>
          <input
            type="text"
            {...register("name", { required: "Company name is required" })}
            className="input"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Strength */}
        <div>
          <label className="block font-medium">Company Strength</label>
          <select
            {...register("strength", { required: "Select strength" })}
            className="input"
          >
            <option value="">-- Select --</option>
            {strengthOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.strength && (
            <p className="text-red-500">{errors.strength.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium">Location</label>
          <input
            type="text"
            {...register("location", { required: "Location is required" })}
            className="input"
          />
          {errors.location && (
            <p className="text-red-500">{errors.location.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium">Company Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email format",
              },
            })}
            className="input"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Field */}
        <div>
          <label className="block font-medium">Company Field</label>
          <select
            {...register("field", { required: "Select a field" })}
            className="input"
          >
            <option value="">-- Select --</option>
            {fieldOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.field && (
            <p className="text-red-500">{errors.field.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default CompanyProfileForm;
