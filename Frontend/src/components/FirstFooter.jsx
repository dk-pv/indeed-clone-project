const FirstFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Navigation Links */}
        <nav className="mb-8">
          <ul className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-gray-700">
            <li>
              <a href="#" className="hover:text-blue-600 hover:underline">
                Career advice
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 hover:underline">
                Browse jobs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 hover:underline">
                Browse companies
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 hover:underline">
                Salaries
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 hover:underline">
                Indeed Events
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 hover:underline">
                Work at Indeed
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 hover:underline">
                Countries
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 hover:underline">
                Help
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 hover:underline">
                ESG at Indeed
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 hover:underline">
                Guidelines for safe job search
              </a>
            </li>
          </ul>
        </nav>
        {/* Post a Job Link */}
        <div className="mb-8">
          <a
            href="#"
            className="text-sm text-gray-700 hover:text-blue-600 hover:underline"
          >
            Post a job
          </a>
        </div>
        {/* Bottom Links */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 border-t border-gray-200 pt-6">
          <span>© 2025 Indeed</span>
          <a href="#" className="hover:text-blue-600 hover:underline">
            Accessibility at Indeed
          </a>
          <a href="#" className="hover:text-blue-600 hover:underline">
            Privacy Centre and Ad Choices
          </a>
          <a href="#" className="hover:text-blue-600 hover:underline">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FirstFooter;
