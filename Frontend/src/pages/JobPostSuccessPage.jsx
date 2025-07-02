import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Job Post Created Successfully!
        </h1>
        <p className="text-gray-600 mb-6">
          Your job posting has been successfully submitted and is now live.
        </p>
        <div className="space-y-3">
          <Link
            to="/EmployerHome"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
          >
            Go to Home
          </Link>
          <Link
            to="/create-job-post"
            className="block w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded transition"
          >
            Post Another Job
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;