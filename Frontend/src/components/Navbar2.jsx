import { useState, useEffect } from "react";
import { Menu, X, Plus, FileText, Building2 } from "lucide-react"; // ✅ Added Building2 icon
import { useNavigate  } from "react-router-dom";

const IndeedNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserEmail(parsed?.email || "");
      } catch (err) {
        console.error("Invalid user in localStorage");
      }
    }
  }, []);

  return (
    <nav className="bg-gray-800 text-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation("/")}
          >
            <div className="text-2xl font-bold text-blue-400">indeed</div>
            <div className="text-xs text-gray-300 ml-1 mt-2 hidden sm:block">
              for employers
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => handleNavigation("/create-job-post")}
              className="flex items-center px-4 py-2 hover:text-blue-400 hover:bg-gray-700 rounded-md font-medium"
            >
              <Plus size={18} className="mr-2" />
              Post a Job
            </button>

            <button
              onClick={() => handleNavigation("/update-company-profile")}
              className="flex items-center px-4 py-2 hover:text-blue-400 hover:bg-gray-700 rounded-md font-medium"
            >
              <Building2 size={18} className="mr-2" />
              Company Profile
            </button>

            <button
              onClick={() => handleNavigation("/my-posts")}
              className="flex items-center px-4 py-2 hover:text-blue-400 hover:bg-gray-700 rounded-md font-medium"
            >
              <FileText size={18} className="mr-2" />
              My Posts
            </button>
            <span className="text-sm font-medium text-white ml-4">
              {userEmail || "User"}
            </span>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-700 transition"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Items */}
        {isMenuOpen && (
          <div className="lg:hidden px-2 pt-2 pb-3 space-y-1 border-t border-gray-700">
            <button
              onClick={() => {
                handleNavigation("/create-job-post");
                setIsMenuOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 hover:bg-gray-700 hover:text-blue-400 rounded-md font-medium"
            >
              <Plus size={18} className="mr-2" />
              Post a Job
            </button>

            <button
              onClick={() => {
                handleNavigation("/update-company-profile");
                setIsMenuOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 hover:bg-gray-700 hover:text-blue-400 rounded-md font-medium"
            >
              <Building2 size={18} className="mr-2" />
              Company Profile
            </button>

            <button
              onClick={() => {
                handleNavigation("/my-posts");
                setIsMenuOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 hover:bg-gray-700 hover:text-blue-400 rounded-md font-medium"
            >
              <FileText size={18} className="mr-2" />
              My Posts
            </button>

            <div className="px-3 py-2 text-sm text-gray-300">
              {userEmail || "User"}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default IndeedNavbar;
