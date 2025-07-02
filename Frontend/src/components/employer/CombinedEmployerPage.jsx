// src/components/employer/EmployerPage.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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

export default function EmployerPage() {
  const [userEmail, setUserEmail] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeForm, setActiveForm] = useState("account");
  const navigate = useNavigate();

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
    const jobPostData = {
      company: {
        name: formData.companyName,
        contactPerson: formData.fullName,
        phone: formData.phone,
        referralSource: formData.referralSource,
      },
      job: {
        title: formData.jobTitle,
        description: formData.jobDescription,
        location: {
          type: formData.locationType,
          city: formData.city,
          area: formData.area,
          pincode: formData.pincode,
          address: formData.address,
        },
      },
      details: {
        jobTypes: formData.jobTypes,
        schedules: formData.schedules,
        hiringCount: formData.numberOfPeople,
        timeline: formData.recruitmentTimeline,
      },
      payAndBenefits: {
        minSalary: formData.payRange.min,
        maxSalary: formData.payRange.max,
        supplementalPay: formData.supplementalPay,
        benefits: formData.benefits,
      },
      preferences: {
        email: formData.email,
        additionalEmails: formData.additionalEmails.filter((e) => e),
        individualEmails: formData.individualEmails,
        resumeRequired: formData.resumeRequired,
        contactCandidates: formData.contactCandidates,
      },
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:9999/api/job/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobPostData),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();
          throw new Error(result.message || "Failed to submit job post");
        } else {
          const htmlError = await response.text();
          console.error("Server returned HTML error:", htmlError);
          throw new Error("Unexpected error (HTML response)");
        }
      }

      const result = await response.json();
      localStorage.removeItem("jobPostFormData");
      navigate("/success");
    } catch (error) {
      console.error("Error details:", error);
      console.log("Failed request data:", jobPostData);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <EmployerNavbar
        userEmail={userEmail}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />

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