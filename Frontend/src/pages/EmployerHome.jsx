import {Link} from 'react-router-dom';
import employerhome from '../assets/employerhome.png'

const EmployerHome = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Main Content */}
      <div className="w-full h-screen flex flex-col md:flex-row items-center justify-center px-4 py-6">
        <div className="text-center space-y-4 md:space-y-6 w-full md:w-1/2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            Let's hire your next<br />
            great candidate. Fast.
          </h1>
          <div className="pt-2 md:pt-4">
            <Link to='/create-job-post'>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-lg transition duration-200">
                Post a free job*
              </button>
            </Link>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm">
            *Terms, conditions, quality standards and usage limits apply.
          </p>
        </div>
        <div className="w-full md:w-1/2 mt-4 md:mt-0">
          <img src={employerhome} alt="" />
        </div>
      </div>

      {/* Three Steps Section */}
      <div className="w-full h-screen flex items-center justify-center px-4 py-6 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
          {/* Step 1 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="mb-4 sm:mb-6">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-lg mb-2 sm:mb-4">
                1
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
                Create your free account
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                All you need is your email address to create an account and start building your job post.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="mb-4 sm:mb-6">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-lg mb-2 sm:mb-4">
                2
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
                Build your job post
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Then just add a title, description and location to your job post, and you're ready to go.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="mb-4 sm:mb-6">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-lg mb-2 sm:mb-4">
                3
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
                Post your job
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                After you post your job, use our state-of-the-art tools to help you find dream talent.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Save Time Section */}
      <div className="w-full h-screen flex items-center justify-center px-4 py-6 bg-white">
        <div className="text-center max-w-6xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4 sm:mb-8">
            Save time and effort in your recruitment{" "}
            <span className="text-gray-700">journey.</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            Finding the best fit for the job shouldn't be a full-time job. Indeed's simple and 
            powerful tools let you source, screen and hire faster.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full h-screen flex items-center justify-center px-4 py-6 bg-white">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Get more visibility */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Get more visibility
                </h3>
                <p className="text-gray-600 text-sm sm:text-lg leading-relaxed">
                  <span className="text-blue-600 font-semibold">Sponsor your job</span> to ensure it gets seen by the right people.
                </p>
              </div>
            </div>

            {/* Find quality applicants */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Find quality applicants
                </h3>
                <p className="text-gray-600 text-sm sm:text-lg leading-relaxed">
                  List your required skills for the job so relevant candidates apply.
                </p>
              </div>
            </div>

            {/* Verify their abilities */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Verify their abilities
                </h3>
                <p className="text-gray-600 text-sm sm:text-lg leading-relaxed">
                  Add screener questions to test applicants' skills.
                </p>
              </div>
            </div>

            {/* Organise your candidates */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Organise your candidates
                </h3>
                <p className="text-gray-600 text-sm sm:text-lg leading-relaxed">
                  View and sort CVs, send messages and schedule interviews – all on Indeed.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-12 flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg p-4 sm:p-6">
            <div className="mb-4 sm:mb-0">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-lg transition duration-200 shadow-lg hover:shadow-xl">
                Get started
              </button>
            </div>
            <div className="text-gray-600 text-center sm:text-right">
              <p className="text-sm sm:text-lg">
                You control your posts 24/7 – edit, add, pause or close them whenever you want.{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800 underline font-semibold">
                  Learn more about posting.
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsorship Section */}
      <div className="w-full h-screen flex items-center justify-center px-4 py-6 bg-white">
        <div className="text-center max-w-4xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Want to fill your job faster?<br />
            Sponsor it.
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-12 max-w-2xl mx-auto">
            Sponsored jobs are over 4.5X more likely to result in a hire. 
            Only pay for applications from qualified candidates who 
            meet your requirements.¹
          </p>
          <div style={{ height: '200px', width: '100%', backgroundColor: 'black' }}></div>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            ¹ The Sponsored Jobs Search for Employers and Job Seekers Study (Aug 2021). See registration link web
            sponsor for full terms.
          </p>
        </div>
      </div>

      {/* Companies Section */}
      <div className="w-full h-screen flex items-center justify-center px-4 py-6 bg-white">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              You're in good company.
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Over 3,20,000 companies use Indeed to hire. See why these 
              fantastic companies use us as their platform for hiring dream 
              talent.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* McDonald's */}
            <div className="text-center bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="h-12 sm:h-16 flex items-center justify-center mb-2 sm:mb-4">
                <div className="text-2xl sm:text-4xl font-bold text-yellow-500">M</div>
              </div>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Indeed helps the world's largest restaurant company to connect with 
                young talent to recruit high-quality candidates 
                for a host of HR positions.
              </p>
            </div>

            {/* University */}
            <div className="text-center bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="h-12 sm:h-16 flex items-center justify-center mb-2 sm:mb-4">
                <div className="w-8 sm:w-12 h-8 sm:h-12 bg-blue-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">UNIV</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                The second oldest university in 
                India is India's leading institution. 
                Targeted job posting boosts 
                authentic academic positions 
                and corporate support roles.
              </p>
            </div>

            {/* Nokia */}
            <div className="text-center bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="h-12 sm:h-16 flex items-center justify-center mb-2 sm:mb-4">
                <div className="text-xl sm:text-2xl font-bold text-blue-700">NOKIA</div>
              </div>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                The world leader in mobile 
                communications. Indeed's 
                Sponsored Jobs helps boost the cost 
                per applicant and cost per hire.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="w-full h-screen flex items-center justify-center px-4 py-6 bg-blue-900 text-white">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="text-center lg:text-left">
              <div className="text-4xl sm:text-5xl lg:text-6xl text-blue-300 mb-4">"</div>
              <blockquote className="text-lg sm:text-xl lg:text-2xl leading-relaxed mb-4 sm:mb-6">
                We have found Indeed very helpful in finding the right 
                candidate for our organization... it saves time 
                and energy of both the candidates as well as the 
                recruiter.
              </blockquote>
              <footer className="text-blue-200 text-base sm:text-lg">
                <strong>Kapdec</strong>
              </footer>
            </div>
            <div className="lg:pl-6">
              <div className="bg-blue-800 rounded-lg p-4 sm:p-6 h-40 sm:h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-blue-700 rounded-full mx-auto mb-2 sm:mb-4 flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">👩‍💼</span>
                  </div>
                  <p className="text-xs sm:text-sm">Professional working on laptop</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="w-full h-screen flex items-center justify-center px-4 py-6 bg-white">
        <div className="text-center max-w-4xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Get started in minutes!
          </h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-lg transition duration-200 shadow-lg hover:shadow-xl mb-2 sm:mb-4">
            Start posting
          </button>
          <p className="text-gray-500 text-xs sm:text-sm">
            A better way to recruit.
          </p>
        </div>
      </div>
    </div>  
  );
}

export default EmployerHome


