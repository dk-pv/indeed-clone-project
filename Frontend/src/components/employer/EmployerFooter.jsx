// EmployerFooter.jsx
import { Link } from "react-router-dom";

export default function EmployerFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4 mb-8">
          <p className="text-sm text-gray-600">
            Have feedback?{" "}
            <Link
              to="#"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Tell us more.
            </Link>
          </p>
        </div>

        <div className="text-center text-xs text-gray-500 space-y-2">
          <p>©2025 Indeed</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link to="#" className="hover:text-gray-700">
              Cookies, privacy and terms
            </Link>
            <Link to="#" className="hover:text-gray-700">
              Privacy Centre
            </Link>
            <Link to="#" className="hover:text-gray-700">
              Security
            </Link>
            <Link to="#" className="hover:text-gray-700">
              Billing
            </Link>
            <Link to="#" className="hover:text-gray-700">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}