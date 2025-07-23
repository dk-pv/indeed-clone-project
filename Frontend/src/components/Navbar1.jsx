import { useState, useEffect, useRef, useContext } from "react";
import {
  Menu,
  X,
  User,
  Bell,
  MessageSquare,
  Bookmark,
  MessageCircle,
  BellDot,
  ChevronDown,
} from "lucide-react";
import useAlert from "../hooks/useAlert";
import AlertMessage from "../components/common/AlertMessage";
import { AuthContext } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [activeLink, setActiveLink] = useState("/");
  const [notifications, setNotifications] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const { isLoggedIn, setIsLoggedIn, user, setUser } = useContext(AuthContext);
  const socket = useSocket();
  const { alert, showAlert, hideAlert } = useAlert();
  const navigate = useNavigate();
  const hasJoinedRoom = useRef(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Initialize user data from localStorage if not in context
  useEffect(() => {
    const initializeUser = () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser && !user) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsLoggedIn(true);
        }

        if (user) {
          setUserEmail(user.email || "");
          setUserRole(user.role || "");
          setIsLoggedIn(true);

          if (socket && user.id && !hasJoinedRoom.current) {
            socket.emit("join", { room: user.id });
            hasJoinedRoom.current = true;
            fetchNotificationCount();
          }
        } else if (!token) {
          setUserEmail("");
          setUserRole("");
          setIsLoggedIn(false);
          setNotifications([]);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing user:", error);
        setIsInitialized(true);
      }
    };

    initializeUser();
  }, [user, socket, setUser, setIsLoggedIn]);

  useEffect(() => {
    if (!socket || !isLoggedIn) return;

    socket.on("connect", () => console.log("✅ Socket connected"));
    socket.on("connect_error", (err) =>
      console.error("❌ Socket error:", err.message)
    );

    // ✅ Employer-side: applicant apply notification
    socket.on("receiveNotification", (notification) => {
      if (notification?.type === "application") {
        setNotifications((prev) => {
          const exists = prev.some((n) => n._id === notification._id);
          return exists ? prev : [notification, ...prev];
        });
      }
    });

    // ✅ Applicant-side: job status update notification
    socket.on("newNotification", (notification) => {
      if (notification?.type === "application-status") {
        setNotifications((prev) => {
          const exists = prev.some((n) => n._id === notification._id);
          return exists ? prev : [notification, ...prev];
        });
      }
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("receiveNotification");
      socket.off("newNotification");
      hasJoinedRoom.current = false;
    };
  }, [socket, isLoggedIn]);

  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:9999/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    setActiveLink(window.location.pathname);

    // Fetch notifications on component mount if user is logged in
    if (isLoggedIn && isInitialized) {
      fetchNotificationCount();
    }
  }, [isLoggedIn, isInitialized]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const handleEmployerClick = (e) => {
    if (!isLoggedIn || (userRole !== "employer" && user?.role !== "employer")) {
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
    <>
      <nav className="bg-white border-b border-gray-200 h-[64px] relative shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Left section - Logo and Nav Links */}
          <div className="flex items-center space-x-10">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  src="https://imgs.search.brave.com/nVmqoSOtthUyp4p-lhr6NazRwjLyIvnpQwXMJO11F_M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly8xMDAw/bG9nb3MubmV0L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIzLzAx/L0luZGVlZC1sb2dv/LTUwMHgyODEuanBn"
                  alt="Indeed"
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  onClick={() => handleLinkClick(link.to)}
                  className={`text-sm font-medium py-5 px-1 border-b-2 transition-all duration-200 hover:text-[#2557a7] ${
                    activeLink === link.to
                      ? "text-[#2557a7] border-[#2557a7]"
                      : "text-gray-700 border-transparent hover:border-gray-300"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right section - User Actions */}
          <div className="flex items-center space-x-1">
            {isLoggedIn ? (
              <>
                {/* Notification and Message Icons */}
                <div className="hidden lg:flex items-center space-x-1">
                  {userRole !== "employer" && user?.role !== "employer" ? (
                    <>
                      <Link to="/saved-jobs">
                        <button className="p-2 text-gray-600 hover:text-[#2557a7] hover:bg-gray-50 rounded-lg transition-colors">
                          <Bookmark className="h-5 w-5" />
                        </button>
                      </Link>
                      <Link to="/notifications-jobseeker" className="relative">
                        <button className="p-2 text-gray-600 hover:text-[#2557a7] hover:bg-gray-50 rounded-lg transition-colors">
                          <BellDot className="h-5 w-5" />
                          {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#d93025] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                              {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                          )}
                        </button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/employer-chat">
                        <button className="p-2 text-gray-600 hover:text-[#2557a7] hover:bg-gray-50 rounded-lg transition-colors">
                          <MessageSquare className="h-5 w-5" />
                        </button>
                      </Link>
                      <Link to="/notifications" className="relative">
                        <button className="p-2 text-gray-600 hover:text-[#2557a7] hover:bg-gray-50 rounded-lg transition-colors">
                          <Bell className="h-5 w-5" />
                          {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#d93025] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                              {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                          )}
                        </button>
                      </Link>
                    </>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative ml-3">
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center p-2 text-gray-600 hover:text-[#2557a7] hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#2557a7] to-[#1a4480] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {(userEmail || user?.email || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 hidden lg:block" />
                    </div>
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 top-12 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#2557a7] to-[#1a4480] rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {(userEmail || user?.email || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {userEmail || user?.email || "User"}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {userRole || user?.role || "user"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Menu Items */}
                      <div className="py-2">
                        <Link
                          to={
                            (userRole || user?.role) === "employer"
                              ? "/notifications"
                              : "/profile"
                          }
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2557a7] transition-colors"
                        >
                          <User className="h-4 w-4 mr-3" />
                          {(userRole || user?.role) === "employer"
                            ? "Notifications"
                            : "Profile"}
                          {unreadCount > 0 && (
                            <span className="ml-auto text-xs bg-[#d93025] text-white px-2 py-1 rounded-full">
                              {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                          )}
                        </Link>
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user");
                            setIsLoggedIn(false);
                            setUser(null);
                            setIsUserDropdownOpen(false);
                            showAlert("success", "Signed out successfully");
                            navigate("/");
                          }}
                          className="w-full px-4 py-3 text-sm text-[#d93025] hover:bg-red-50 transition-colors text-left"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Employer Link */}
                <div className="hidden lg:flex items-center ml-4 pl-4 border-l border-gray-200">
                  <a
                    href="/EmployerHome"
                    onClick={handleEmployerClick}
                    className="text-sm font-medium text-[#2557a7] hover:text-[#1a4480] px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Employers / Post Job
                  </a>
                </div>
              </>
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <Link
                  to="/role"
                  className="text-sm font-medium text-[#2557a7] hover:text-[#1a4480] px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Sign in
                </Link>
                <div className="h-6 w-px bg-gray-300"></div>
                <a
                  href="/EmployerHome"
                  onClick={handleEmployerClick}
                  className="text-sm font-medium text-[#2557a7] hover:text-[#1a4480] px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Employers / Post Job
                </a>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="lg:hidden ml-3">
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-600 hover:text-[#2557a7] hover:bg-gray-50 rounded-lg transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  onClick={() => handleLinkClick(link.to)}
                  className={`block px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeLink === link.to
                      ? "text-[#2557a7] bg-blue-50"
                      : "text-gray-700 hover:text-[#2557a7] hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="pt-3 border-t border-gray-200 space-y-1">
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/role"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-3 text-sm font-medium text-[#2557a7] hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Sign in
                    </Link>
                    <a
                      href="/EmployerHome"
                      onClick={(e) => {
                        handleEmployerClick(e);
                        setIsMenuOpen(false);
                      }}
                      className="block px-3 py-3 text-sm font-medium text-[#2557a7] hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Employers / Post Job
                    </a>
                  </>
                ) : (
                  <>
                    <Link
                      to="/notifications"
                      className="flex items-center justify-between px-3 py-3 text-sm font-medium text-gray-700 hover:text-[#2557a7] hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="bg-[#d93025] text-white text-xs px-2 py-1 rounded-full">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Link>
                    <a
                      href="/EmployerHome"
                      onClick={(e) => {
                        handleEmployerClick(e);
                        setIsMenuOpen(false);
                      }}
                      className="block px-3 py-3 text-sm font-medium text-[#2557a7] hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Employers / Post Job
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Alert Messages */}
      {alert && (
        <div className="fixed top-20 right-4 z-[9999] w-[300px]">
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={hideAlert}
          />
        </div>
      )}

      {/* Backdrop for dropdowns */}
      {(isUserDropdownOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setIsUserDropdownOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;
