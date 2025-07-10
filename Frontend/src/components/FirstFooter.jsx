const IndeedFooter = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Navigation Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-700 mb-6">
          <a href="#" className="hover:text-blue-600 hover:underline transition-colors">
            Career advice
          </a>
          <a href="#" className="hover:text-blue-600 hover:underline transition-colors">
            Browse jobs
          </a>
          <a href="#" className="hover:text-blue-600 hover:underline transition-colors">
            Browse companies
          </a>
          <a href="#" className="hover:text-blue-600 hover:underline transition-colors">
            Salaries
          </a>
          <a href="#" className="hover:text-blue-600 hover:underline transition-colors">
            Indeed Events
          </a>
          <a href="#" className="hover:text-blue-600 hover:underline transition-colors">
            Post a job
          </a>
          <a href="#" className="hover:text-blue-600 hover:underline transition-colors">
            Work at Indeed
          </a>
          <a href="#" className="hover:text-blue-600 hover:underline transition-colors">
            Help
          </a>
        </div>

        {/* Bottom Legal Links */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-gray-600 border-t border-blue-100 pt-4">
          <span>© 2025 Indeed</span>
          <a href="#" className="hover:text-blue-600 hover:underline transition-colors">
            Accessibility at Indeed
          </a>
          <a href="#" className="hover:text-blue-600 hover:underline transition-colors">
            Privacy Centre and Ad Choices
          </a>
          <a href="#" className="hover:text-blue-600 hover:underline transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-blue-600 hover:underline transition-colors">
            Cookie Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default IndeedFooter;