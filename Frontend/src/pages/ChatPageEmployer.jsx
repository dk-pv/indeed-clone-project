import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const EmployerInbox = () => {
  const { user } = useContext(AuthContext);
  const socket = useSocket();
  const employerId = user?._id || user?.id;
  const token = localStorage.getItem("token");

  const [conversations, setConversations] = useState([]);

  const fetchInbox = async () => {
    try {
      const res = await axios.get(
        `http://localhost:9999/api/chat/inbox/${employerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setConversations(res.data.data);
    } catch (err) {
      console.error("❌ Inbox load error", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (!employerId || !token) return;
    fetchInbox();

    if (socket) {
      socket.on("newMessage", fetchInbox);
      return () => socket.off("newMessage", fetchInbox);
    }
  }, [employerId, token, socket]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Employer Inbox</h2>
      {conversations.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul className="space-y-4">
          {conversations.map((conv, index) => (
            <li key={index} className="border-b pb-2">
              <p className="font-medium">From: {conv.email}</p>
              <p className="text-sm text-gray-500">
                {conv.lastMessage.content}
              </p>
              <Link
                to={`/chat/${conv._id}`}
                className="text-blue-500 text-sm hover:underline"
              >
                Open Chat
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployerInbox;
