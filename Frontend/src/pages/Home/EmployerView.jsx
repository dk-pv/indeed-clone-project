// import { Bookmark, Share2, Briefcase } from "lucide-react";

// const EmployerView = ({
//   profileList,
//   selectedProfile,
//   setSelectedProfile,
//   loadingProfiles,
//   jobQuery,
//   setJobQuery,
//   locationQuery,
//   setLocationQuery,
//   handleKeyPress,
//   handleSearch
// }) => {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//       {/* Profile List */}
//       <div className="lg:col-span-2 space-y-4 max-h-screen overflow-y-auto">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">
//           Candidate Profiles
//         </h2>
//         {loadingProfiles ? (
//           <div className="flex justify-center items-center h-40">
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
//           </div>
//         ) : profileList.length > 0 ? (
//           profileList.map((profile) => (
//             <div
//               key={profile._id}
//               onClick={() => setSelectedProfile(profile)}
//               className={`bg-white border rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
//                 selectedProfile?._id === profile._id
//                   ? "border-blue-500 bg-blue-50"
//                   : "border-gray-200 hover:border-gray-300"
//               }`}
//             >
//               <div className="flex justify-between items-start mb-2">
//                 <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
//                   {profile.user?.name}
//                 </h3>
//                 <Bookmark className="w-5 h-5 text-gray-400 hover:text-gray-600" />
//               </div>

//               <p className="text-gray-600 text-sm mb-2">
//                 {profile.title}
//               </p>

//               {profile.location && (
//                 <p className="text-gray-600 text-sm mb-2 flex items-center">
//                   <MapPin className="w-4 h-4 mr-1" />
//                   {profile.location.city}, {profile.location.state}
//                 </p>
//               )}

//               {profile.skills && profile.skills.length > 0 && (
//                 <div className="mb-3">
//                   <div className="flex flex-wrap gap-2">
//                     {profile.skills.slice(0, 4).map((skill, index) => (
//                       <span
//                         key={index}
//                         className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                     {profile.skills.length > 4 && (
//                       <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
//                         +{profile.skills.length - 4} more
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div className="flex justify-between items-center text-sm text-gray-500">
//                 <span>
//                   {profile.experience
//                     ? `${profile.experience} years exp`
//                     : "Fresher"}
//                 </span>
//                 <span>
//                   {profile.employmentStatus || "Not specified"}
//                 </span>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center text-gray-500 py-20">
//             No candidate profiles found.
//           </div>
//         )}
//       </div>

//       {/* Profile Details */}
//       <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200">
//         {selectedProfile ? (
//           <div className="p-6">
//             {/* Profile Header */}
//             <div className="border-b border-gray-200 pb-6 mb-6">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h1 className="text-2xl font-bold text-gray-800 mb-1">
//                     {selectedProfile.user?.name}
//                   </h1>
//                   <p className="text-lg text-gray-600 mb-2">
//                     {selectedProfile.title}
//                   </p>
//                   {selectedProfile.location && (
//                     <p className="text-gray-600 text-sm mb-4 flex items-center">
//                       <MapPin className="w-4 h-4 mr-1" />
//                       {selectedProfile.location.city},{" "}
//                       {selectedProfile.location.state}
//                     </p>
//                   )}
//                 </div>
//                 <div className="flex gap-2">
//                   <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200">
//                     <Bookmark className="w-4 h-4" />
//                   </button>
//                   <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200">
//                     <Share2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-3 mt-4">
//                 <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200">
//                   Contact Candidate
//                 </button>
//                 <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-6 py-2 rounded-lg transition-colors duration-200">
//                   View Full Resume
//                 </button>
//               </div>
//             </div>

//             {/* Profile Details */}
//             <div className="space-y-6">
//               {/* About */}
//               {selectedProfile.summary && (
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                     About
//                   </h3>
//                   <p className="text-gray-700">
//                     {selectedProfile.summary}
//                   </p>
//                 </div>
//               )}

//               {/* Skills */}
//               {selectedProfile.skills && selectedProfile.skills.length > 0 && (
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                     Skills
//                   </h3>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedProfile.skills.map((skill, index) => (
//                       <span
//                         key={index}
//                         className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Experience */}
//               {selectedProfile.experience && (
//                 <div className="flex items-start gap-3">
//                   <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
//                     <Briefcase className="w-4 h-4 text-gray-600" />
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-800">
//                       Experience
//                     </p>
//                     <p className="text-gray-600">
//                       {selectedProfile.experience} years
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Education */}
//               {selectedProfile.education && selectedProfile.education.length > 0 && (
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                     Education
//                   </h3>
//                   <div className="space-y-4">
//                     {selectedProfile.education.map((edu, index) => (
//                       <div key={index} className="border-l-2 border-blue-200 pl-4">
//                         <p className="font-medium text-gray-800">
//                           {edu.degree}
//                         </p>
//                         <p className="text-gray-600">{edu.school}</p>
//                         <p className="text-gray-500 text-sm">
//                           {edu.year}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div className="p-8 text-center text-gray-500">
//             <p>Select a candidate to view details</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmployerView;



import { Bookmark, Share2, Briefcase, MapPin } from "lucide-react";

const EmployerView = ({
  profileList,
  selectedProfile,
  setSelectedProfile,
  loadingProfiles,
  jobQuery,
  setJobQuery,
  locationQuery,
  setLocationQuery,
  handleKeyPress,
  handleSearch
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Profile List */}
      <div className="lg:col-span-2 space-y-4 max-h-screen overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Candidate Profiles
        </h2>
        {loadingProfiles ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : profileList.length > 0 ? (
          profileList.map((profile) => (
            <div
              key={profile._id}
              onClick={() => setSelectedProfile(profile)}
              className={`bg-white border rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedProfile?._id === profile._id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                  {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
                </h3>
                <Bookmark className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </div>

              <p className="text-gray-600 text-sm mb-2">
                {profile.title || "No title provided"}
              </p>

              {profile.personalInfo?.location && (
                <p className="text-gray-600 text-sm mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profile.personalInfo.location}
                </p>
              )}

              {profile.skills && profile.skills.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length > 4 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                        +{profile.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  {profile.experience
                    ? `${profile.experience} years exp`
                    : "Fresher"}
                </span>
                <span>
                  {profile.employmentStatus || "Not specified"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-20">
            No candidate profiles found.
          </div>
        )}
      </div>

      {/* Profile Details */}
      <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200">
        {selectedProfile ? (
          <div className="p-6">
            {/* Profile Header */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    {selectedProfile.personalInfo?.firstName}{" "}
                    {selectedProfile.personalInfo?.lastName}
                  </h1>
                  <p className="text-lg text-gray-600 mb-2">
                    {selectedProfile.title || "No title provided"}
                  </p>
                  {selectedProfile.personalInfo?.location && (
                    <p className="text-gray-600 text-sm mb-4 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedProfile.personalInfo.location}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors duration-200">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                {(selectedProfile.personalInfo?.email ||
                  selectedProfile.personalInfo?.phone) && (
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200">
                    Contact Candidate
                  </button>
                )}

                {selectedProfile.resume?.filename && (
                  <a
                    href={`http://localhost:9999/uploads/resumes/${selectedProfile.resume.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    📄 View Resume
                  </a>
                )}
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              {/* About */}
              {selectedProfile.summary && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    About
                  </h3>
                  <p className="text-gray-700">{selectedProfile.summary}</p>
                </div>
              )}

              {/* Skills */}
              {selectedProfile.skills && selectedProfile.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {selectedProfile.experience && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Experience</p>
                    <p className="text-gray-600">
                      {selectedProfile.experience} years
                    </p>
                  </div>
                </div>
              )}

              {/* Education */}
              {selectedProfile.education &&
                selectedProfile.education.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Education
                    </h3>
                    <div className="space-y-4">
                      {selectedProfile.education.map((edu, index) => (
                        <div
                          key={index}
                          className="border-l-2 border-blue-200 pl-4"
                        >
                          <p className="font-medium text-gray-800">
                            {edu.degree}
                          </p>
                          <p className="text-gray-600">{edu.school}</p>
                          <p className="text-gray-500 text-sm">
                            {edu.graduationYear}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Contact Info
                </h3>
                <p className="text-gray-700">
                  <strong>Email:</strong> {selectedProfile.personalInfo?.email}
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> {selectedProfile.personalInfo?.phone}
                </p>
                <p className="text-gray-700">
                  <strong>Location:</strong>{" "}
                  {selectedProfile.personalInfo?.location}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>Select a candidate to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerView;
