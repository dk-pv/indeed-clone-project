import { useState, useEffect } from "react";
import { useContext } from "react";
import { Menu, X, User, Bell, MessageSquare, Bookmark } from "lucide-react";
import useAlert from "../hooks/useAlert";
import AlertMessage from "../components/common/AlertMessage";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [activeLink, setActiveLink] = useState("/"); // Track active link
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { alert, showAlert, hideAlert } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserEmail(user.email);
        setUserRole(user.role);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Failed to read user from localStorage", error);
      showAlert("error", "Failed to load user session");
    }
  }, []);

  // Set active link based on current path
  useEffect(() => {
    const currentPath = window.location.pathname;
    setActiveLink(currentPath);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const handleEmployerClick = (e) => {
    if (!isLoggedIn || userRole !== "employer") {
      e.preventDefault();
      showAlert("error", "Only logged-in employers can access this page.");
    }
  };

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Company reviews", to: "/companyReview" },
    { name: "Salary guide", to: "/salaries" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 h-[60px] relative shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="w-[80px]">
            <img
              src="https://imgs.search.brave.com/nVmqoSOtthUyp4p-lhr6NazRwjLyIvnpQwXMJO11F_M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly8xMDAw/bG9nb3MubmV0L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIzLzAx/L0luZGVlZC1sb2dv/LTUwMHgyODEuanBn"
              alt="logo"
              className="h-auto"
            />
          </div>

          <div className="hidden min-[990px]:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.to}
                onClick={() => handleLinkClick(link.to)}
                className={`text-sm font-normal text-gray-600 hover:text-blue-600 relative transition-colors duration-200 py-4 ${
                  activeLink === link.to
                    ? "text-blue-600 font-medium after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-blue-600 after:transition-all after:duration-300"
                    : ""
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden min-[990px]:flex items-center space-x-6">
          {isLoggedIn ? (
            <div className="flex items-center space-x-5">
              <Link to={'/saved-jobs'}>
                 <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 hover:bg-gray-50 rounded-full">
                <Bookmark className="h-5 w-5" />
              </button>
              </Link>
             

              {userRole === "employer" && (
                <Link to={"/employer-chat"}>
                  <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 hover:bg-gray-50 rounded-full">
                    <MessageSquare className="h-5 w-5" />
                  </button>
                </Link>
              )}

              <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 hover:bg-gray-50 rounded-full">
                <Bell className="h-5 w-5" />
              </button>

              {/* ✅ USER DROPDOWN (Desktop) */}
              <div className="relative">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-1 p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 hover:bg-gray-50 rounded-full"
                >
                  <User className="h-5 w-5" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in fade-in duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {userEmail}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {userRole}
                      </p>
                    </div>
                    {userRole !== "employer" && (
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <User className="h-4 w-4 mr-3" />
                          Profile
                        </Link>
                      </div>
                    )}

                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("user");
                          setIsLoggedIn(false);
                          setIsUserDropdownOpen(false);
                          showAlert("success", "Signed out successfully");
                          navigate("/"); // 👈 redirect to homepage after logout
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors duration-200"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <span className="text-gray-300">|</span>
              <a
                href="/EmployerHome"
                onClick={handleEmployerClick}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
              >
                Employers / Post Job
              </a>
            </div>
          ) : (
            <>
              <a
                href="/role"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 px-4 py-2 rounded-md hover:bg-blue-50"
              >
                Sign in
              </a>
              <span className="text-gray-300">|</span>
              <a
                href="/EmployerHome"
                onClick={handleEmployerClick}
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
              >
                Employers / Post Job
              </a>
            </>
          )}
        </div>

        {/* ✅ Mobile Navbar Right Section */}
        <div className="flex min-[990px]:hidden items-center space-x-3">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={toggleUserDropdown}
                className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 hover:bg-gray-50 rounded-full"
              >
                <User className="h-5 w-5" />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in fade-in duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {userEmail}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {userRole}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setIsLoggedIn(false);
                        setIsUserDropdownOpen(false);
                        showAlert("success", "Signed out successfully");
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors duration-200"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <User className="h-5 w-5 text-gray-500" />
          )}

          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-50 focus:outline-none transition-colors duration-200"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="min-[990px]:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.to}
              className={`block text-sm hover:text-blue-600 transition-colors duration-200 py-2 ${
                activeLink === link.to
                  ? "text-blue-600 font-medium"
                  : "text-gray-600"
              }`}
              onClick={() => handleLinkClick(link.to)}
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 border-t border-gray-100">
            {!isLoggedIn && (
              <a
                href="/role"
                className="block text-sm text-blue-600 font-medium transition-colors duration-200 hover:text-blue-700 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign in
              </a>
            )}
            <a
              href="/EmployerHome"
              onClick={(e) => {
                handleEmployerClick(e);
                setIsMenuOpen(false);
              }}
              className="block text-sm text-blue-600 mt-2 transition-colors duration-200 hover:text-blue-700 py-2"
            >
              Employers / Post Job
            </a>
          </div>
        </div>
      )}

      {(isUserDropdownOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setIsUserDropdownOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}

      {alert && (
        <div className="fixed top-20 right-4 z-[9999] w-[300px]">
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={hideAlert}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
