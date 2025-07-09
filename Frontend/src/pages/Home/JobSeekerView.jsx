import { Bookmark, Share2, Eye, MapPin } from "lucide-react";

const JobSeekerView = ({
  jobList,
  selectedJob,
  selectedJobDetails,
  loadingJobDetails,
  handleJobClick,
  jobQuery,
  setJobQuery,
  locationQuery,
  setLocationQuery,
  handleKeyPress,
  handleSearch
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Job List */}
      <div className="lg:col-span-2 space-y-4 max-h-screen overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Jobs for you
        </h2>
        {jobList.length > 0 ? (
          jobList.map((job) => (
            <div
              key={job._id}
              onClick={() => handleJobClick(job)}
              className={`bg-white border rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedJob?._id === job._id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                  {job.job?.title}
                </h3>
                <Bookmark className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </div>

              <p className="text-gray-600 text-sm mb-2">
                {job.company?.name}
              </p>

              <p className="text-gray-600 text-sm mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {job.job?.location?.city}
              </p>

              <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                {job.job?.description}
              </p>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  ₹{job.payRange?.min} - ₹{job.payRange?.max}
                </span>
                <span>{job.jobTypes?.join(", ")}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-20">
            No job postings found.
          </div>
        )}
      </div>

      {/* Job Details */}
      <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200">
        {loadingJobDetails ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading job details...</p>
          </div>
        ) : selectedJobDetails ? (
          <div className="p-6">
            {/* Job Header */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedJobDetails.job?.title}
              </h1>
              <p className="text-gray-600 mb-2">
                {selectedJobDetails.company?.name} •{" "}
                {selectedJobDetails.job?.location?.city}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Up to ₹{selectedJobDetails.payRange?.max} a month
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200">
                  Apply now
                </button>
                <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200">
                  <Bookmark className="w-4 h-4" />
                </button>
                <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Job details
                </h3>

                {/* Pay */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-sm">₹</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Pay</p>
                    <p className="text-gray-600">
                      ₹{selectedJobDetails.payRange?.min} - ₹
                      {selectedJobDetails.payRange?.max} a month
                    </p>
                  </div>
                </div>

                {/* Job Type */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-sm">💼</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Job type</p>
                    <div className="flex gap-2 mt-1">
                      {selectedJobDetails.jobTypes?.map((type, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                        >
                          ✓ {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Location</p>
                    <p className="text-gray-600">
                      {selectedJobDetails.job?.location?.city},{" "}
                      {selectedJobDetails.job?.location?.state}
                    </p>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Job Description
                </h3>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p>{selectedJobDetails.job?.description}</p>
                </div>
              </div>
              {/* Required Skills */}
              {selectedJobDetails.requiredSkills?.length > 0 && (
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-sm">🛠</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Required Skills
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedJobDetails.requiredSkills.map(
                        (skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Graduate Requirement */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  🎓
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    Graduate Required
                  </p>
                  <p className="text-gray-600">
                    {selectedJobDetails.graduateRequired ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              {/* Company Info */}
              {selectedJobDetails.company && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    About {selectedJobDetails.company.name}
                  </h3>
                  <p className="text-gray-700">
                    {selectedJobDetails.company.description ||
                      "Company information not available."}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>Select a job to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerView;