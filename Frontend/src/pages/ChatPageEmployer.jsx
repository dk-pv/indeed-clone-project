// import { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { useSocket } from "../context/SocketContext";

// const EmployerInbox = () => {
//   const { user } = useContext(AuthContext);
//   const socket = useSocket();
//   const employerId = user?._id || user?.id;
//   const token = localStorage.getItem("token");

//   const [conversations, setConversations] = useState([]);

//   const fetchInbox = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:9999/api/chat/inbox/${employerId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setConversations(res.data.data);
//     } catch (err) {
//       console.error("❌ Inbox load error", err.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     if (!employerId || !token) return;
//     fetchInbox();

//     if (socket) {
//       socket.on("newMessage", fetchInbox);
//       return () => socket.off("newMessage", fetchInbox);
//     }
//   }, [employerId, token, socket]);

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h2 className="text-xl font-bold mb-4">Employer Inbox</h2>
//       {conversations.length === 0 ? (
//         <p>No messages yet.</p>
//       ) : (
//         <ul className="space-y-4">
//           {conversations.map((conv, index) => (
//             <li key={index} className="border-b pb-2">
//               <p className="font-medium">From: {conv.email}</p>
//               <p className="text-sm text-gray-500">
//                 {conv.lastMessage.content}
//               </p>
//               <Link
//                 to={`/chat/${conv._id}`}
//                 className="text-blue-500 text-sm hover:underline"
//               >
//                 Open Chat
//               </Link>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default EmployerInbox;



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
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-600 mt-1">
            {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-500">When candidates message you, they'll appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {conversations.map((conv, index) => (
                <div key={index} className="hover:bg-gray-50 transition-colors">
                  <Link
                    to={`/chat/${conv._id}`}
                    className="block px-6 py-4 hover:no-underline"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">
                          {conv.email?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>

                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {conv.email}
                          </h3>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {conv.lastMessage?.createdAt ? 
                              new Date(conv.lastMessage.createdAt).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric'
                              }) : 
                              'Recent'
                            }
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conv.lastMessage?.content || "No message preview"}
                        </p>
                      </div>

                      {/* Unread indicator */}
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerInbox;