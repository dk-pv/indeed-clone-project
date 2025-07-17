// src/components/employer/EmployerPage.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { replace, useNavigate } from "react-router-dom";
import jobpostImg from "../../assets/jobpost.png";

// Components
import EmployerNavbar from "./EmployerNavbar";
import EmployerFooter from "./EmployerFooter";
import ProgressIndicator from "./ProgressIndicator";
import AccountForm from "./AccountForm";
import JobForm from "./JobForm";
import DetailsForm from "./DetailsForm";
import PayBenefitsForm from "./PayBenefitsForm";
import PreferencesForm from "./PreferencesForm";
import PreviewForm from "./PreviewForm";

import useAlert from "../../hooks/useAlert"; // adjust path if needed
import AlertMessage from "../common/AlertMessage"; // adjust path if needed

let hasCheckedProfile = false;

export default function EmployerPage() {
  const [userEmail, setUserEmail] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeForm, setActiveForm] = useState("account");

  const { alert, showAlert, hideAlert } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    const isCompanyProfileCompleted = localStorage.getItem("hasCompanyProfile");

    if (isCompanyProfileCompleted !== "true") {
      // Disable back button if profile is not completed
      const handlePopState = () => {
        navigate("/update-company-profile", { replace: true });
      };

      // Push fake state to block back
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [navigate]);

  useEffect(() => {
    const profileExists = localStorage.getItem("hasCompanyProfile");
    if (profileExists !== "true") {
      navigate("/update-company-profile", { replace: true });
    }
  }, []);

  useEffect(() => {
    const checkCompanyProfile = async () => {
      if (hasCheckedProfile) return;
      hasCheckedProfile = true;

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }

      try {
        const res = await fetch("http://localhost:9999/api/company/exists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!data.exists) {
          localStorage.setItem("hasCompanyProfile", "false");
          showAlert(
            "Please complete your company profile before posting a job.",
            "warning",
            4000
          );
          setTimeout(() => {
            navigate("/update-company-profile", { replace: true });
          }, 500);
        } else {
          localStorage.setItem("hasCompanyProfile", "true");
        }
      } catch (error) {
        console.error("Company profile check failed:", error);
        showAlert("Something went wrong while checking your profile.", "error");
      }
    };

    checkCompanyProfile();
  }, [navigate, showAlert]);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:9999/api/company", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success && data.data) {
          setValue("companyName", data.data.name); // ✅ correct path now
          setValue("email", data.data.email || ""); // fallback if email not available

          localStorage.setItem(
            "jobPostFormData",
            JSON.stringify({
              ...formData,
              companyName: data.data.name,
              email: data.data.email || "",
            })
          );
        } else {
          console.warn("Company data not found:", data);
          showAlert("Company profile not found. Please update it.", "warning");
          navigate("/update-company-profile", { replace: true });
        }
      } catch (err) {
        console.error("Failed to load company profile:", err);
        showAlert("Failed to fetch company info", "error");
      }
    };

    fetchCompanyProfile();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      // Account
      companyName: "",
      fullName: "",
      referralSource: "",
      phone: "",

      // Job
      jobTitle: "",
      locationType: "On-site",
      city: "",
      area: "",
      pincode: "",
      address: "",
      jobDescription: "",

      // Details
      jobTypes: [],
      schedules: [],
      numberOfPeople: "",
      recruitmentTimeline: "",
      requiredSkills: [],
      graduateRequired: false,

      // Pay & Benefits
      payRange: { min: "", max: "" },
      supplementalPay: [],
      benefits: [],

      // Preferences
      email: "",
      additionalEmails: [],
      individualEmails: false,
      resumeRequired: true,
      contactCandidates: true,
    },
  });

  const formData = watch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      setUserEmail(user.email);
      setValue("email", user.email);
    }

    // Load saved form data if available
    const savedFormData = JSON.parse(localStorage.getItem("jobPostFormData"));
    if (savedFormData) {
      Object.entries(savedFormData).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [setValue]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("jobPostFormData", JSON.stringify(formData));
  }, [formData]);

  // Form submission handlers
  const onAccountSubmit = async () => {
    const isValid = await trigger(["companyName", "fullName"]);
    if (isValid) {
      setActiveForm("job");
      window.scrollTo(0, 0);
    }
  };

  const onJobSubmit = async () => {
    const isValid = await trigger(["jobTitle", "city", "jobDescription"]);
    if (isValid) {
      setActiveForm("details");
      window.scrollTo(0, 0);
    }
  };

  const onDetailsSubmit = async () => {
    const isValid = await trigger([
      "jobTypes",
      "numberOfPeople",
      "recruitmentTimeline",
    ]);
    if (isValid) {
      setActiveForm("payBenefits");
      window.scrollTo(0, 0);
    }
  };

  const onPayBenefitsSubmit = () => {
    setActiveForm("preferences");
    window.scrollTo(0, 0);
  };

  const onPreferencesSubmit = async () => {
    const isValid = await trigger(["email"]);
    if (isValid) {
      setActiveForm("preview");
      window.scrollTo(0, 0);
    }
  };

  const handleFinalSubmit = async () => {
  console.log("🚀 handleFinalSubmit called");

  const user = JSON.parse(localStorage.getItem("user"));
  if (!formData.companyName || !formData.fullName || !formData.phone) {
  showAlert("Missing company info. Please fill all required fields.", "warning");
  return;
}


  const token = localStorage.getItem("token");

  const jobPostData = {
  job: {
    title: formData.jobTitle,
    description: formData.jobDescription,
    location: {
      city: formData.city,
      area: formData.area,
      pincode: formData.pincode,
      address: formData.address,
    },
  },

  company: {
    name: formData.companyName,
    contactPerson: formData.fullName,
    phone: formData.phone,
    referralSource: formData.referralSource,
  },

  details: {
    jobTypes: formData.jobTypes,
    schedules: formData.schedules,
    hiringCount: formData.numberOfPeople,
    timeline: formData.recruitmentTimeline,
    requiredSkills: formData.requiredSkills,
    graduateRequired: formData.graduateRequired,
  },

  payAndBenefits: {
    minSalary: Number(formData.payRange?.min || 0),
    maxSalary: Number(formData.payRange?.max || 0),
    currency: "INR",
    supplementalPay: formData.supplementalPay,
    benefits: formData.benefits,
  },

  preferences: {
    email: formData.email,
    additionalEmails: (formData.additionalEmails || []).filter(Boolean),
    individualEmails: formData.individualEmails,
    resumeRequired: formData.resumeRequired,
    contactCandidates: formData.contactCandidates,
  },

  status: "published", // optional, based o
};


  try {
    console.log("📦 Sending job post:", jobPostData);

    const response = await fetch("http://localhost:9999/api/job/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobPostData),
    });

    console.log("📥 Raw response:", response);

    if (!response.ok) {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        console.error("❌ API Error JSON:", result);
        throw new Error(result.message || "Failed to submit job post");
      } else {
        const htmlError = await response.text();
        console.error("❌ API Error HTML:", htmlError);
        throw new Error("Unexpected error (HTML response)");
      }
    }

    const result = await response.json();
    console.log("✅ Job post successful:", result);
    localStorage.removeItem("jobPostFormData");
    navigate("/success");
  } catch (error) {
    console.error("❌ Submission Error:", error);
    showAlert(`Error: ${error.message}`, "error");
  }
};


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <EmployerNavbar
        userEmail={userEmail}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />
      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={hideAlert}
        />
      )}

      {/* Header Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <img
          src={jobpostImg}
          alt="Job post"
          className="w-[800px] h-[200px] object-contain mx-auto"
        />
      </div>

      <ProgressIndicator activeForm={activeForm} />

      <main className="flex-grow">
        {activeForm === "account" && (
          <AccountForm
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            formData={formData}
            setValue={setValue}
            onSubmit={onAccountSubmit}
          />
        )}

        {activeForm === "job" && (
          <JobForm
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            formData={formData}
            setValue={setValue}
            onSubmit={onJobSubmit}
            setActiveForm={setActiveForm}
          />
        )}

        {activeForm === "details" && (
          <DetailsForm
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            formData={formData}
            setValue={setValue}
            getValues={getValues}
            onSubmit={onDetailsSubmit}
            setActiveForm={setActiveForm}
          />
        )}

        {activeForm === "payBenefits" && (
          <PayBenefitsForm
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            formData={formData}
            setValue={setValue}
            getValues={getValues}
            onSubmit={onPayBenefitsSubmit}
            setActiveForm={setActiveForm}
          />
        )}

        {activeForm === "preferences" && (
          <PreferencesForm
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            formData={formData}
            setValue={setValue}
            getValues={getValues}
            onSubmit={onPreferencesSubmit}
            setActiveForm={setActiveForm}
          />
        )}

        {activeForm === "preview" && (
          <PreviewForm
            formData={formData}
            setActiveForm={setActiveForm}
            handleFinalSubmit={handleFinalSubmit}
            navigate={navigate}
          />
        )}
      </main>

      <EmployerFooter />

      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </div>
  );
}
