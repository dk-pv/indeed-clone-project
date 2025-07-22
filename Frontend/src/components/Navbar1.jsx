import { useState, useEffect, useRef, useContext } from "react";
import { Menu, X, User, Bell, MessageSquare, Bookmark, MessageCircle, BellDot } from "lucide-react";
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

  const { isLoggedIn, setIsLoggedIn, user, setUser } = useContext(AuthContext);
  const socket = useSocket();
  const { alert, showAlert, hideAlert } = useAlert();
  const navigate = useNavigate();
  const hasJoinedRoom = useRef(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (user) {
      setUserEmail(user.email || "");
      setUserRole(user.role || "");
      setIsLoggedIn(true);

      if (user.role === "employer" && socket && user.id && !hasJoinedRoom.current) {
        socket.emit("join", { room: user.id });
        hasJoinedRoom.current = true;
        fetchNotificationCount();
      }
    } else {
      setUserEmail("");
      setUserRole("");
      setIsLoggedIn(false);
      setNotifications([]);
    }
  }, [user, socket]);

  useEffect(() => {
    if (!socket || !isLoggedIn || userRole !== "employer") return;

    socket.on("connect", () => console.log("✅ Socket connected"));
    socket.on("connect_error", (err) => console.error("❌ Socket error:", err.message));
    socket.on("receiveNotification", (notification) => {
      if (notification?.type === "application") {
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
      hasJoinedRoom.current = false;
    };
  }, [socket, isLoggedIn, userRole]);

  const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:9999/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setNotifications(res.data.data.filter((n) => !n.isRead));
      }
    } catch (err) {
      console.error("❌ Fetch error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    setActiveLink(window.location.pathname);
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
    <>
      <nav className="bg-white border-b border-gray-200 h-[60px] relative shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo + Nav links */}
          <div className="flex items-center space-x-8">
            <div className="w-[80px]">
              <img
                src="https://imgs.search.brave.com/nVmqoSOtthUyp4p-lhr6NazRwjLyIvnpQwXMJO11F_M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly8xMDAw/bG9nb3MubmV0L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIzLzAx/L0luZGVlZC1sb2dv/LTUwMHgyODEuanBn"
                alt="logo"
                className="h-auto"
              />
            </div>
            <div className="hidden min-[990px]:flex items-center space-x-6">
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  onClick={() => handleLinkClick(link.to)}
                  className={`text-sm font-normal text-gray-600 hover:text-blue-600 relative transition-colors duration-200 py-4 ${
                    activeLink === link.to
                      ? "text-blue-600 font-medium after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:bg-blue-600"
                      : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop user menu */}
          <div className="hidden min-[990px]:flex items-center space-x-6">
            {isLoggedIn ? (
              <div className="flex items-center space-x-5">
                {userRole !== "employer" ? (
                  <>
                    <Link to="/saved-jobs">
                      <div className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-full">
                        <Bookmark className="h-5 w-5" />
                      </div>
                    </Link>
                    <Link to="/messages">
                      <div className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-full">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                    </Link>
                    <Link to="/notifications">
                      <div className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-full">
                        <BellDot className="h-5 w-5" />
                      </div>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/employer-chat">
                      <div className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-full">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                    </Link>
                    <Link
                      to="/notifications"
                      className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-full"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleUserDropdown}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-full"
                  >
                    <User className="h-5 w-5" />
                  </button>
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium text-gray-900">
                          {userEmail}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {userRole}
                        </p>
                      </div>
                      <div className="py-1">
                        {userRole !== "employer" && (
                          <Link
                            to="/profile"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-sm hover:text-blue-600 hover:bg-gray-50"
                          >
                            <User className="h-4 w-4 mr-3" />
                            Profile
                          </Link>
                        )}
                        {userRole === "employer" && (
                          <Link
                            to="/notifications"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-sm hover:text-blue-600 hover:bg-gray-50"
                          >
                            <Bell className="h-4 w-4 mr-3" />
                            Notifications {unreadCount > 0 && `(${unreadCount > 9 ? "9+" : unreadCount})`}
                          </Link>
                        )}
                      </div>
                      <div className="border-t py-1">
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
                          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Employers / Post Job
                </a>
              </div>
            ) : (
              <>
                <a
                  href="/role"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 px-4 py-2 hover:bg-blue-50"
                >
                  Sign in
                </a>
                <span className="text-gray-300">|</span>
                <a
                  href="/EmployerHome"
                  onClick={handleEmployerClick}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Employers / Post Job
                </a>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex min-[990px]:hidden items-center space-x-3">
            {isLoggedIn && (
              <button
                onClick={toggleUserDropdown}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-full"
              >
                <User className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-full"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMenuOpen && (
          <div className="min-[990px]:hidden bg-white border-t px-4 py-3 space-y-2">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                to={link.to}
                onClick={() => handleLinkClick(link.to)}
                className={`block text-sm py-2 ${
                  activeLink === link.to ? "text-blue-600 font-medium" : "text-gray-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t">
              {!isLoggedIn ? (
                <Link
                  to="/role"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-sm text-blue-600 py-2"
                >
                  Sign in
                </Link>
              ) : (
                <>
                  {userRole === "employer" && (
                    <Link
                      to="/notifications"
                      className="block text-sm py-2 text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Notifications {unreadCount > 0 && `(${unreadCount > 9 ? "9+" : unreadCount})`}
                    </Link>
                  )}
                </>
              )}
              <a
                href="/EmployerHome"
                onClick={(e) => {
                  handleEmployerClick(e);
                  setIsMenuOpen(false);
                }}
                className="block text-sm text-blue-600 py-2"
              >
                Employers / Post Job
              </a>
            </div>
          </div>
        )}
      </nav>

      {alert && (
        <div className="fixed top-20 right-4 z-[9999] w-[300px]">
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={hideAlert}
          />
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
    </>
  );
};

export default Navbar;