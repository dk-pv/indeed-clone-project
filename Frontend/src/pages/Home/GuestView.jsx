import { Link } from "react-router-dom";
import mainImg from "../../assets/main.png";

const GuestView = ({ jobQuery, locationQuery, setJobQuery, setLocationQuery, handleKeyPress, handleSearch }) => {
  return (
    <>
      <div className="w-full mb-8">
        <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
          <img
            src={mainImg}
            alt="Indeed main visual"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Indeed!
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create an account or sign in to see your personalised job
          recommendations.
        </p>

        <Link to="/signin">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 mb-8 inline-flex items-center">
            Get Started
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </Link>

        <div className="space-y-4 text-gray-600">
          <div>
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 underline font-medium"
            >
              Post your resume
            </a>
            <span className="text-gray-500">
              {" "}
              - It only takes a few seconds
            </span>
          </div>
          <div>
            <Link
              to="/postJob"
              className="text-blue-600 hover:text-blue-700 underline font-medium"
            >
              Post a job on Indeed
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuestView;