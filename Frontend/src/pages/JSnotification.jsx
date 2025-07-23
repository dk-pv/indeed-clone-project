import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import { Bell } from "lucide-react";
import axios from "axios";

const NotificationsPage = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const socket = useSocket();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingAsRead, setMarkingAsRead] = useState({});
  const hasJoinedRoom = useRef(false);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const all = res.data.data;
        setNotifications(all.filter((n) => !n.isRead));
        localStorage.setItem("notifications", JSON.stringify(all));
      } else {
        throw new Error("Failed to fetch notifications");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/signin");
      } else {
        setError(err.message || "Error fetching notifications");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("notifications");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotifications(parsed.filter((n) => !n.isRead));
      } catch {}
    }
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate("/signin");
      return;
    }

    if (socket && user.id && !hasJoinedRoom.current) {
      socket.emit("join", { room: user.id });
      hasJoinedRoom.current = true;

      socket.on("receiveNotification", (notification) => {
        const id = notification._id || Date.now().toString();
        const newNotification = { ...notification, _id: id, isRead: false };

        setNotifications((prev) => {
          const exists = prev.some((n) => n._id === id);
          if (exists) return prev;

          const updated = [newNotification, ...prev];
          const all = JSON.parse(localStorage.getItem("notifications") || "[]");
          const allUpdated = [newNotification, ...all];
          localStorage.setItem("notifications", JSON.stringify(allUpdated));
          return updated;
        });
      });
    }

    return () => {
      socket?.off("receiveNotification");
      hasJoinedRoom.current = false;
    };
  }, [socket, user, isLoggedIn, navigate]);

  useEffect(() => {
    const syncStorage = (e) => {
      if (e.key === "notifications") {
        try {
          const parsed = JSON.parse(e.newValue || "[]");
          setNotifications(parsed.filter((n) => !n.isRead));
        } catch {}
      }
    };
    window.addEventListener("storage", syncStorage);
    return () => window.removeEventListener("storage", syncStorage);
  }, []);

  const markAsRead = async (notificationId) => {
    if (markingAsRead[notificationId]) return;
    setMarkingAsRead((prev) => ({ ...prev, [notificationId]: true }));

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notifications/mark-read`,
        { notificationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = notifications.filter((n) => n._id !== notificationId);
      setNotifications(updated);

      const all = JSON.parse(localStorage.getItem("notifications") || "[]");
      const newAll = all.map((n) =>
        n._id === notificationId ? { ...n, isRead: true } : n
      );
      localStorage.setItem("notifications", JSON.stringify(newAll));
    } catch (err) {
      setError("Failed to mark as read");
    } finally {
      setMarkingAsRead((prev) => ({ ...prev, [notificationId]: false }));
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notifications/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications([]);
      const all = JSON.parse(localStorage.getItem("notifications") || "[]");
      const newAll = all.map((n) => ({ ...n, isRead: true }));
      localStorage.setItem("notifications", JSON.stringify(newAll));
    } catch (err) {
      setError("Failed to mark all as read");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      <div className="w-full max-w-4xl mx-auto px-4 py-8 flex-grow">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Bell className="w-6 h-6 mr-2 text-blue-600" />
              Notifications
              {notifications.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-medium rounded-full px-2 py-1">
                  {notifications.length}
                </span>
              )}
            </h1>

            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-12">
              <p>{error}</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition duration-200 ${
                    markingAsRead[notification._id] ? "opacity-50 cursor-wait" : "cursor-pointer"
                  }`}
                  onClick={() => {
                    if (!markingAsRead[notification._id]) {
                      markAsRead(notification._id);
                      if (notification.jobId) {
                        navigate(`/job-details/${notification.jobId}`);
                      }
                    }
                  }}
                >
                  <p className="text-gray-800 text-sm">{notification.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p>No new notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
