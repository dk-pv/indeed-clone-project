// import { useState, useEffect, useContext } from "react";
// import {
//   User,
//   Bell,
//   MessageSquare,
//   Bookmark,
//   Settings,
//   HelpCircle,
//   Shield,
//   Menu,
//   X,
// } from "lucide-react";
// import useAlert from "../hooks/useAlert";
// import AlertMessage from "../components/common/AlertMessage";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { useSocket } from "../context/SocketContext";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
//   const [userEmail, setUserEmail] = useState("");
//   const [userRole, setUserRole] = useState("");
//   const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
//   const { alert, showAlert, hideAlert } = useAlert();
//   const [hasNewMessage, setHasNewMessage] = useState(false);

//   const navigate = useNavigate();
//   const socket = useSocket();

//   useEffect(() => {
//     if (!socket || userRole !== "employer") return;

//     socket.on("receiveMessage", (msg) => {
//       console.log("📩 New message received:", msg);
//       setHasNewMessage(true); // show red dot
//     });

//     return () => {
//       socket.off("receiveMessage");
//     };
//   }, [socket, userRole]);

//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         const user = JSON.parse(storedUser);
//         setUserEmail(user.email);
//         setUserRole(user.role);
//         setIsLoggedIn(true);
//       }
//     } catch (error) {
//       console.error("Failed to read user from localStorage", error);
//       showAlert("error", "Failed to load user session");
//     }
//   }, []);

//   useEffect(() => {
//   if (!socket || userRole !== "employer" || !userEmail) return;

//   const room = userEmail; // or employerId if you prefer
//   socket.emit("join", { room });

//   socket.on("receiveMessage", (msg) => {
//     console.log("📩 New message received:", msg);
//     setHasNewMessage(true);
//   });

//   return () => {
//     socket.off("receiveMessage");
//     socket.emit("leave", { room });
//   };
// }, [socket, userRole, userEmail]);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

//   const handleEmployerClick = (e) => {
//     if (!isLoggedIn || userRole !== "employer") {
//       e.preventDefault();
//       showAlert("error", "Only logged-in employers can access this page.");
//     }
//   };

//   const handleProtectedClick = (e, to) => {
//     if (!isLoggedIn) {
//       e.preventDefault();
//       navigate("/role");
//     }
//   };

//   // Get current page from window.location.pathname
//   const currentPath =
//     typeof window !== "undefined" ? window.location.pathname : "/";

//   const allNavLinks = [
//     { name: "Home", to: "/", active: currentPath === "/" },
//     {
//       name: "Company reviews",
//       to: "/companyReview",
//       active: currentPath === "/companyReview",
//     },
//     {
//       name: "Salary guide",
//       to: "/salaries",
//       active: currentPath === "/salaries",
//     },
//   ];

//   const navLinks =
//     isLoggedIn && userRole === "employer"
//       ? allNavLinks.filter((link) => link.name === "Home")
//       : allNavLinks;

//   const userMenuItems = [
//     { name: "Profile", icon: User, to: "/profile" },
//     { name: "My reviews", icon: MessageSquare, to: "/my-reviews" },
//     { name: "Settings", icon: Settings, to: "/settings" },
//     { name: "Help", icon: HelpCircle, to: "/help" },
//     { name: "Privacy Centre", icon: Shield, to: "/privacy" },
//   ];

//   return (
//     <>
//       <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             {/* Logo */}
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <img
//                   src="https://imgs.search.brave.com/nVmqoSOtthUyp4p-lhr6NazRwjLyIvnpQwXMJO11F_M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly8xMDAw/bG9nb3MubmV0L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIzLzAx/L0luZGVlZC1sb2dv/LTUwMHgyODEuanBn"
//                   alt="Indeed"
//                   className="h-8 w-auto"
//                 />
//               </div>

//               {/* Desktop Navigation */}
//               <div className="hidden min-[1000px]:block ml-10">
//                 <div className="flex items-baseline space-x-8">
//                   {navLinks.map((link, index) => (
//                     <a
//                       key={index}
//                       href={link.to}
//                       onClick={(e) =>
//                         !isLoggedIn &&
//                         link.name !== "Home" &&
//                         handleProtectedClick(e, link.to)
//                       }
//                       className={`text-sm font-medium px-3 py-2 rounded-md transition-all duration-200 relative ${
//                         link.active
//                           ? "text-blue-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-200"
//                           : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
//                       }`}
//                     >
//                       {link.name}
//                     </a>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Desktop Right Side */}
//             <div className="hidden min-[1000px]:flex items-center space-x-4">
//               {isLoggedIn ? (
//                 <div className="flex items-center space-x-4">
//                   {userRole !== "employer" ? (
//                     <>
//                       <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
//                         <Bookmark className="h-5 w-5" />
//                       </button>
//                       <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
//                         <MessageSquare className="h-5 w-5" />
//                       </button>
//                       <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
//                         <Bell className="h-5 w-5" />
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       {/* ✅ Icons for Employer */}
//                       <div className="relative">
//                         <button
//                           onClick={() => {
//                             setHasNewMessage(false);
//                             navigate("/employer-chat"); // or your actual chat route
//                           }}
//                           className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
//                         >
//                           <MessageSquare className="h-5 w-5" />
//                           {hasNewMessage && (
//                             <span className="absolute top-1 right-1 block h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
//                           )}
//                         </button>
//                       </div>

//                       <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
//                         <Bell className="h-5 w-5" />
//                       </button>

//                       <div className="flex items-center space-x-3">
//                         <span className="text-sm text-gray-700 max-w-32 truncate">
//                           {userEmail}
//                         </span>
//                         <button
//                           onClick={() => {
//                             localStorage.removeItem("token");
//                             localStorage.removeItem("user");
//                             setIsLoggedIn(false);
//                             showAlert("success", "Signed out successfully");
//                           }}
//                           className="text-sm text-blue-600 font-medium hover:underline transition-colors"
//                         >
//                           Sign out
//                         </button>
//                       </div>
//                     </>
//                   )}

//                   <div className="h-6 w-px bg-gray-300"></div>
//                   <a
//                     href="/EmployerHome"
//                     onClick={handleEmployerClick}
//                     className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors"
//                   >
//                     Employers / Post Job
//                   </a>
//                 </div>
//               ) : (
//                 <div className="flex items-center space-x-4">
//                   <a
//                     href="/role"
//                     className="text-sm font-semibold text-blue-700 hover:text-blue-800 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"
//                   >
//                     Sign in
//                   </a>
//                   <div className="h-6 w-px bg-gray-300"></div>
//                   <a
//                     href="/EmployerHome"
//                     onClick={handleEmployerClick}
//                     className="text-sm text-gray-700 hover:text-blue-600 font-medium transition-colors"
//                   >
//                     Employers / Post Job
//                   </a>
//                 </div>
//               )}
//             </div>

//             {/* Mobile menu button */}
//             <div className="max-[999px]:block hidden">
//               <button
//                 onClick={toggleMenu}
//                 className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
//               >
//                 {isMenuOpen ? (
//                   <X className="h-6 w-6" />
//                 ) : (
//                   <Menu className="h-6 w-6" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {isMenuOpen && (
//           <div className="max-[999px]:block hidden bg-white border-t border-gray-200 shadow-lg">
//             <div className="px-4 py-3 space-y-3">
//               {/* Navigation Links */}
//               {navLinks.map((link, index) => (
//                 <a
//                   key={index}
//                   href={link.to}
//                   onClick={(e) => {
//                     !isLoggedIn &&
//                       link.name !== "Home" &&
//                       handleProtectedClick(e, link.to);
//                     setIsMenuOpen(false);
//                   }}
//                   className={`block text-sm font-medium px-3 py-2 rounded-md transition-colors ${
//                     link.active
//                       ? "text-blue-700 bg-blue-50"
//                       : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
//                   }`}
//                 >
//                   {link.name}
//                 </a>
//               ))}

//               <div className="border-t border-gray-200 pt-3">
//                 {isLoggedIn ? (
//                   <div className="space-y-3">
//                     <div className="px-3 py-2 bg-gray-50 rounded-md">
//                       <p className="text-sm font-medium text-gray-900 truncate">
//                         {userEmail}
//                       </p>
//                       <p className="text-xs text-gray-500 capitalize">
//                         {userRole}
//                       </p>
//                     </div>

//                     {userRole !== "employer" && (
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-around py-2 border-b border-gray-200">
//                           <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
//                             <Bookmark className="h-5 w-5" />
//                           </button>
//                           <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
//                             <MessageSquare className="h-5 w-5" />
//                           </button>
//                           <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
//                             <Bell className="h-5 w-5" />
//                           </button>
//                         </div>

//                         {userMenuItems.map((item, index) => (
//                           <a
//                             key={index}
//                             href={item.to}
//                             className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md transition-colors"
//                             onClick={() => setIsMenuOpen(false)}
//                           >
//                             <item.icon className="h-4 w-4 mr-3" />
//                             {item.name}
//                           </a>
//                         ))}
//                       </div>
//                     )}

//                     <button
//                       onClick={() => {
//                         localStorage.removeItem("token");
//                         localStorage.removeItem("user");
//                         setIsLoggedIn(false);
//                         setIsMenuOpen(false);
//                         showAlert("success", "Signed out successfully");
//                       }}
//                       className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-gray-50 font-medium rounded-md transition-colors"
//                     >
//                       Sign out
//                     </button>
//                   </div>
//                 ) : (
//                   <a
//                     href="/role"
//                     className="block text-sm text-blue-700 font-semibold px-3 py-2 rounded-md hover:bg-blue-50 transition-colors"
//                     onClick={() => setIsMenuOpen(false)}
//                   >
//                     Sign in
//                   </a>
//                 )}

//                 <a
//                   href="/EmployerHome"
//                   onClick={(e) => {
//                     handleEmployerClick(e);
//                     setIsMenuOpen(false);
//                   }}
//                   className="block text-sm text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md hover:bg-gray-50 transition-colors border-t border-gray-200 pt-3 mt-3"
//                 >
//                   Employers / Post Job
//                 </a>
//               </div>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Overlay for closing dropdowns */}
//       {(isUserDropdownOpen || isMenuOpen) && (
//         <div
//           className="fixed inset-0 z-30 bg-black bg-opacity-25 max-[999px]:bg-black max-[999px]:bg-opacity-25 min-[1000px]:bg-transparent"
//           onClick={() => {
//             setIsUserDropdownOpen(false);
//             setIsMenuOpen(false);
//           }}
//         />
//       )}

//       {/* Alert Message */}
//       {alert && (
//         <div className="fixed top-20 right-4 z-50 w-80 max-w-sm">
//           <AlertMessage
//             type={alert.type}
//             message={alert.message}
//             onClose={hideAlert}
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;

import { useState, useEffect } from "react";
import { useContext } from "react";
import {
  Menu,
  X,
  User,
  Bell,
  MessageSquare,
  Bookmark,
  Settings,
  HelpCircle,
  Shield,
} from "lucide-react";
import useAlert from "../hooks/useAlert";
import AlertMessage from "../components/common/AlertMessage";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { alert, showAlert, hideAlert } = useAlert();

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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const handleEmployerClick = (e) => {
    if (!isLoggedIn || userRole !== "employer") {
      e.preventDefault();
      showAlert("error", "Only logged-in employers can access this page.");
    }
  };

  const navLinks = [
    { name: "Home", to: "/", active: true },
    { name: "Company reviews", to: "/companyReview" },
    { name: "Salary guide", to: "/salaries" },
  ];

  const userMenuItems = [
    { name: "Profile", icon: User, to: "/profile" },
    { name: "My reviews", icon: MessageSquare, to: "/my-reviews" },
    { name: "Settings", icon: Settings, to: "/settings" },
    { name: "Help", icon: HelpCircle, to: "/help" },
    { name: "Privacy Centre", icon: Shield, to: "/privacy" },
  ];

  return (
    <nav className="bg-white border-b border-gray-300 h-[75px] relative">
      <div className="max-w-1xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="w-[112px]">
            <img
              src="https://imgs.search.brave.com/nVmqoSOtthUyp4p-lhr6NazRwjLyIvnpQwXMJO11F_M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly8xMDAw/bG9nb3MubmV0L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIzLzAx/L0luZGVlZC1sb2dv/LTUwMHgyODEuanBn"
              alt="logo"
              className="h-auto"
            />
          </div>

          <div className="hidden min-[990px]:flex items-center space-x-9">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.to}
                className={`text-sm font-medium text-gray-800 hover:text-blue-600 relative ${
                  link.active
                    ? "text-blue-700 after:absolute after:bottom-[-27px] after:left-0 after:h-[2px] after:w-full after:bg-blue-600"
                    : ""
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden min-[990px]:flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <button className="p-1 text-gray-600 hover:text-blue-600">
                <Bookmark className="h-5 w-5" />
              </button>

              {/* Show chat icon only for employers */}
              {userRole === "employer" && (
                <Link to={'/employer-chat'}>
                <button className="p-1 text-gray-600 hover:text-blue-600">
                  <MessageSquare className="h-5 w-5" />
                </button>
                </Link>
                
              )}

              <button className="p-1 text-gray-600 hover:text-blue-600">
                <Bell className="h-5 w-5" />
              </button>
              <div className="relative">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-1 p-1 text-gray-600 hover:text-blue-600"
                >
                  <User className="h-6 w-6" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {userEmail}
                      </p>
                    </div>
                    <div className="py-2">
                      {userMenuItems.map((item, index) => (
                        <a
                          key={index}
                          href={item.to}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.name}
                        </a>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 py-2">
                      <button
                        onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("user");
                          setIsLoggedIn(false);
                          setIsUserDropdownOpen(false);
                          showAlert("success", "Signed out successfully");
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 font-medium"
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
                className="text-sm text-gray-700 hover:text-blue-600"
              >
                Employers / Post Job
              </a>
            </div>
          ) : (
            <>
              <a
                href="/role"
                className="text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                Sign in
              </a>
              <span className="text-gray-300">|</span>
              <a
                href="/EmployerHome"
                onClick={handleEmployerClick}
                className="text-sm text-gray-700 hover:text-blue-600"
              >
                Employers / Post Job
              </a>
            </>
          )}
        </div>

        <div className="flex min-[990px]:hidden items-center space-x-3">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={toggleUserDropdown}
                className="p-1 text-gray-600 hover:text-blue-600"
              >
                <User className="h-6 w-6" />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {userEmail}
                    </p>
                  </div>
                  <div className="py-2">
                    {userMenuItems.map((item, index) => (
                      <a
                        key={index}
                        href={item.to}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setIsLoggedIn(false); // This will update globally
                        setIsUserDropdownOpen(false);
                        showAlert("success", "Signed out successfully");
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 font-medium"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <User className="h-6 w-6 text-gray-600" />
          )}

          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="min-[990px]:hidden bg-white border-t border-gray-200 px-4 py-3 space-y-2">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.to}
              className="block text-sm text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 border-t border-gray-200">
            {!isLoggedIn && (
              <a
                href="/role"
                className="block text-sm text-blue-700 font-medium"
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
              className="block text-sm text-gray-700 mt-2"
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
