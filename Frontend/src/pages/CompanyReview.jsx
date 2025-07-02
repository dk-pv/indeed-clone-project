// import React, { useState } from 'react';
// import { Search, Star } from 'lucide-react';
// import FirstFooter from '../components/FirstFooter';

// const CompanyReview = () => {
//   const [searchTerm, setSearchTerm] = useState('');

//   const companies = [
//     {
//       name: 'Oracle',
//       logo: "logo",
//       rating: 4.0,
//       reviews: '7,403 reviews',
//       bgColor: 'bg-red-500'
//     },
//     {
//       name: "McDonald's",
//       logo: "logo",
//       rating: 3.7,
//       reviews: '2,53,694 reviews',
//       bgColor: 'bg-yellow-400'
//     },
//     {
//       name: 'Wipro',
//       logo: "logo",
//       rating: 4.1,
//       reviews: '16,883 reviews',
//       bgColor: 'bg-blue-600'
//     }
//   ];

//   const renderStars = (rating) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 !== 0;
    
//     for (let i = 0; i < fullStars; i++) {
//       stars.push(
//         <Star key={i} className="w-4 h-4 fill-current text-pink-500" />
//       );
//     }
    
//     if (hasHalfStar) {
//       stars.push(
//         <div key="half" className="relative">
//           <Star className="w-4 h-4 text-pink-500" />
//           <div className="absolute inset-0 overflow-hidden w-1/2">
//             <Star className="w-4 h-4 fill-current text-pink-500" />
//           </div>
//         </div>
//       );
//     }
    
//     const emptyStars = 5 - Math.ceil(rating);
//     for (let i = 0; i < emptyStars; i++) {
//       stars.push(
//         <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
//       );
//     }
    
//     return stars;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Header Section */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Find great places to work
//           </h1>
//           <p className="text-xl text-gray-600 mb-8">
//             Get access to millions of company reviews
//           </p>
          
//           {/* Search Section */}
//           <div className="max-w-2xl mx-auto">
//             <label className="block text-left text-gray-700 font-medium mb-2">
//               Company name or job title
//             </label>
//             <div className="flex gap-4">
//               <div className="relative flex-1">
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   placeholder="Search companies or job titles..."
//                 />
//                 <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               </div>
//               <button className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
//                 Find Companies
//               </button>
//             </div>
//             <div className="text-left mt-3">
//               <a href="#" className="text-blue-600 hover:text-blue-800 underline">
//                 Do you want to search for salaries?
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Popular Companies Section */}
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-8">
//             Popular companies
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {companies.map((company, index) => (
//               <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
//                 {/* Company Header */}
//                 <div className="flex items-center mb-4">
//                   <div className={`w-12 h-12 ${company.bgColor} rounded-lg flex items-center justify-center text-white text-xl font-bold mr-4`}>
//                     {company.logo}
//                   </div>
//                   <h3 className="text-xl font-semibold text-gray-900">
//                     {company.name}
//                   </h3>
//                 </div>
                
//                 {/* Rating and Reviews */}
//                 <div className="flex items-center mb-4">
//                   <div className="flex items-center mr-3">
//                     {renderStars(company.rating)}
//                   </div>
//                   <span className="text-sm text-gray-600">
//                     {company.reviews}
//                   </span>
//                 </div>
                
//                 {/* Action Links */}
//                 <div className="flex space-x-6 text-sm">
//                   <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
//                     Salaries
//                   </a>
//                   <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
//                     Questions
//                   </a>
//                   <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
//                     Open jobs
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//         <FirstFooter/>
//     </div>
//   );
// };

// export default CompanyReview;


import React, { useState } from 'react';
import { Search, Star } from 'lucide-react';
import FirstFooter from '../components/FirstFooter';

const CompanyReview = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Empty company slots with specific colors - to be populated from database
  const companySlots = [
    { logoColor: 'bg-blue-600' },
    { logoColor: 'bg-blue-500' },
    { logoColor: 'bg-purple-600' },
    { logoColor: 'bg-blue-700' },
    { logoColor: 'bg-red-600' },
    { logoColor: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find great places to work
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Get access to millions of company reviews
          </p>
          
          {/* Search Section */}
          <div className="max-w-3xl mx-auto">
            <div className="text-left mb-3">
              <label className="text-sm font-medium text-gray-700">
                Company name or job title
              </label>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
                  placeholder=""
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors text-lg">
                Find Companies
              </button>
            </div>
            <div className="text-left mt-4">
              <a href="#" className="text-blue-600 hover:text-blue-800 underline text-sm">
                Do you want to search for salaries?
              </a>
            </div>
          </div>
        </div>

        {/* Popular Companies Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Popular companies
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companySlots.map((slot, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                {/* Company Header - Empty slots */}
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${slot.logoColor} rounded-lg flex items-center justify-center text-white text-sm font-bold mr-4 flex-shrink-0`}>
                    {/* Logo placeholder */}
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-32 animate-pulse">
                    {/* Company name placeholder */}
                  </div>
                </div>
                
                {/* Rating and Reviews - Empty slots */}
                <div className="flex items-center mb-6">
                  <div className="flex items-center mr-3">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse">
                    {/* Reviews count placeholder */}
                  </div>
                </div>
                
                {/* Action Links */}
                <div className="flex justify-between text-sm text-gray-600">
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Salaries
                  </a>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Questions
                  </a>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Open jobs
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FirstFooter/>
    </div>
  );
};

export default CompanyReview;