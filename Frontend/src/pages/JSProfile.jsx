import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  User,
  GraduationCap,
  Award,
  Upload,
  Edit2,
  Save,
  X,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  FileText,
} from "lucide-react";

const JSProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      industryPreference: ""
    }
  });

  const industryOptions = [
    "IT", "Healthcare", "Finance", "Education", "Manufacturing", "Retail",
    "Construction", "Telecommunication", "Transportation", "Agriculture",
    "Hospitality", "Media", "Real Estate", "Legal", "Marketing", "Government",
    "Non-profit", "Automotive", "Aerospace", "Biotechnology", "Pharmaceuticals",
    "Energy", "Utilities", "Mining", "FMCG (Fast-moving consumer goods)", 
    "E-commerce", "Logistics", "Food & Beverage", "Entertainment", "Sports",
    "Fashion", "Cybersecurity", "Robotics", "EdTech", "FinTech", "HealthTech",
    "AgriTech", "AI/ML", "Blockchain", "Game Development", "Design & Creative",
    "Consulting", "HR & Staffing", "Research & Development", "Marine", "Insurance",
    "Printing & Publishing", "Event Management", "Recycling & Waste Management",
    "Other",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:9999/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data.data;

        if (!data || !data.personalInfo) {
          const emptyProfile = {
            personalInfo: {},
            education: [],
            skills: [],
            resume: null,
            profileCompleteness: 0,
            industryPreference: "",
          };
          setProfile(emptyProfile);
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            location: "",
            education: [],
            skills: "",
            resume: null,
            industryPreference: "",
          });
        } else {
          setProfile(data);
          setFormData({
            ...data.personalInfo,
            education: data.education,
            skills: data.skills.join(", "),
            resume: data.resume,
            industryPreference: data.industryPreference || "",
          });
        }
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleEdit = () => {
    setEditMode(true);
    setShowSuccess(false);
    setUploadError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setUploadError(null);
    try {
      const form = new FormData();
      form.append("firstName", formData.firstName || "");
      form.append("lastName", formData.lastName || "");
      form.append("email", formData.email || "");
      form.append("phone", formData.phone || "");
      form.append("location", formData.location || "");
      form.append("skills", formData.skills || "");
      form.append("education", JSON.stringify(formData.education || []));
      form.append("industryPreference", formData.industryPreference || "");

      if (resumeFile) form.append("resume", resumeFile);

      const res = await axios.post("http://localhost:9999/api/profile", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data.data;
      setProfile(data);
      setFormData({
        ...data.personalInfo,
        education: data.education,
        skills: data.skills.join(", "),
        resume: data.resume,
        industryPreference: data.industryPreference || "",
      });
      setResumeFile(null);
      setEditMode(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setUploadError(err.response?.data?.message || "Failed to upload resume. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      ...profile.personalInfo,
      education: profile.education,
      skills: profile.skills.join(", "),
      resume: profile.resume,
      industryPreference: profile.industryPreference || "",
    });
    setResumeFile(null);
    setUploadError(null);
    setEditMode(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const filetypes = /\.(pdf|doc|docx)$/i;
      if (!filetypes.test(file.name)) {
        setUploadError("Only PDF, DOC, or DOCX files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size exceeds 5MB limit.");
        return;
      }
      setResumeFile(file);
      setFormData({
        ...formData,
        resume: {
          originalName: file.name,
          filename: file.name,
          uploadDate: new Date().toISOString(),
        },
      });
      setUploadError(null);
    }
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      degree: "",
      school: "",
      fieldOfStudy: "",
      graduationYear: "",
      gpa: "",
    };
    setFormData({
      ...formData,
      education: [...(formData.education || []), newEducation],
    });
  };

  const updateEducation = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;
    setFormData({
      ...formData,
      education: updatedEducation,
    });
  };

  const removeEducation = (index) => {
    const updatedEducation = formData.education.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      education: updatedEducation,
    });
  };

  const onSubmit = (data) => {
    setFormData({
      ...formData,
      industryPreference: data.industryPreference
    });
    handleSave();
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center z-50">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        {/* Upload Error Message */}
        {uploadError && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center z-50">
            <X className="w-5 h-5 mr-2" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">
                Manage your professional profile
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Profile Completeness</p>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profile?.profileCompleteness ?? 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    <p>{profile?.profileCompleteness ?? 0}%</p>
                  </span>
                </div>
              </div>
              {!editMode && (
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </h2>
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                    <input
                      type="text"
                      value={formData.firstName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                    <input
                      type="text"
                      value={formData.lastName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                    <input
                      type="text"
                      value={formData.phone || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                    <input
                      type="text"
                      value={formData.location || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {profile.personalInfo.firstName ||
              profile.personalInfo.lastName ? (
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">
                    {profile.personalInfo.firstName}{" "}
                    {profile.personalInfo.lastName}
                  </span>
                </div>
              ) : (
                <div className="text-gray-500 italic">No name provided</div>
              )}

              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {profile.personalInfo.email || (
                  <span className="text-gray-500 italic">
                    No email provided
                  </span>
                )}
              </div>

              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {profile.personalInfo.phone || (
                  <span className="text-gray-500 italic">
                    No phone provided
                  </span>
                )}
              </div>

              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {profile.personalInfo.location || (
                  <span className="text-gray-500 italic">
                    No location provided
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Industry Preference */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Industry Preference
            </h2>
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Industry
                  <select
                    {...register("industryPreference", {
                      required: "Please select an industry"
                    })}
                    className={`w-full p-2 border ${
                      errors.industryPreference ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    onChange={(e) =>
                      setFormData({ ...formData, industryPreference: e.target.value })
                    }
                  >
                    <option value="">Select an industry</option>
                    {industryOptions.map((industry, index) => (
                      <option key={index} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </label>
                {errors.industryPreference && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.industryPreference.message}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {profile.industryPreference ? (
                <div className="flex items-center text-gray-600">
                  <span className="font-medium text-gray-900">
                    {profile.industryPreference}
                  </span>
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  No industry preference selected
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resume Upload */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-blue-600" />
              Resume
            </h2>
          </div>

          <div className="space-y-4">
            {(editMode ? formData.resume : profile.resume) ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {editMode
                        ? formData.resume?.originalName
                        : profile.resume?.originalName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Uploaded on{" "}
                      {new Date(
                        editMode
                          ? formData.resume?.uploadDate
                          : profile.resume?.uploadDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <a
                  href={`https://docs.google.com/viewer?url=${
                    encodeURIComponent(editMode ? formData.resume?.previewUrl : profile.resume?.previewUrl)
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Resume
                </a>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No resume uploaded</p>
                <p className="text-sm text-gray-500 mb-4">
                  Upload your resume to improve your profile visibility
                </p>
              </div>
            )}

            {editMode && (
              <div>
                <label className="block">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    {(editMode ? formData.resume : profile.resume)
                      ? "Update Resume"
                      : "Upload Resume"}
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
              Education
            </h2>
            {editMode && (
              <button
                onClick={addEducation}
                className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                <GraduationCap className="w-4 h-4 mr-1" />
                Add Education
              </button>
            )}
          </div>

          <div className="space-y-4">
            {editMode ? (
              <div className="space-y-4">
                {(formData.education || []).map((edu, index) => (
                  <div
                    key={edu.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Degree
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) =>
                              updateEducation(index, "degree", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          School
                          <input
                            type="text"
                            value={edu.school}
                            onChange={(e) =>
                              updateEducation(index, "school", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Field of Study
                          <input
                            type="text"
                            value={edu.fieldOfStudy}
                            onChange={(e) =>
                              updateEducation(
                                index,
                                "fieldOfStudy",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Graduation Year
                          <input
                            type="text"
                            value={edu.graduationYear}
                            onChange={(e) =>
                              updateEducation(
                                index,
                                "graduationYear",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GPA (Optional)
                          <input
                            type="text"
                            value={edu.gpa}
                            onChange={(e) =>
                              updateEducation(index, "gpa", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </label>
                      </div>
                    </div>
                    <button
                      onClick={() => removeEducation(index)}
                      className="mt-2 text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove Education
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {profile.education.length > 0 ? (
                  profile.education.map((edu, index) => (
                    <div
                      key={edu.id || index}
                      className="border border-gray-200 rounded-lg p-4 mb-4"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {edu.degree}
                        </h3>
                        <p className="text-gray-600 mt-1">{edu.school}</p>
                        <div className="flex items-center text-gray-500 mt-1">
                          <span>{edu.fieldOfStudy}</span>
                          <span className="mx-2">•</span>
                          <span>Class of {edu.graduationYear}</span>
                          {edu.gpa && (
                            <>
                              <span className="mx-2">•</span>
                              <span>GPA: {edu.gpa}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      No education added
                    </p>
                    <p className="text-sm">
                      Add your educational background to complete your profile
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" />
              Skills
            </h2>
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills (comma-separated)
                  <textarea
                    value={formData.skills || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value })
                    }
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., JavaScript, React, Node.js, Python"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div>
              {profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    No skills added
                  </p>
                  <p className="text-sm">
                    Add your skills to help employers find you
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {editMode && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="flex items-center px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                disabled={saving}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JSProfile;