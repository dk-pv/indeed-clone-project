import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
  const { employerId } = useParams(); // route: /chat/:employerId
  const socket = useSocket();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Get user ID with multiple fallbacks
  const senderId = user?._id || user?.id;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [employerInfo, setEmployerInfo] = useState(null);

  const messagesEndRef = useRef(null);
  const jobId = null; // Optional job context
  const room = [senderId, employerId].sort().join("_");

  // ✅ Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Fetch employer info
  useEffect(() => {
    if (!employerId) return;

    const fetchEmployer = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9999/api/auth/${employerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEmployerInfo(res.data?.data);
      } catch (err) {
        console.error("❌ Error fetching employer info:", err);
      }
    };

    fetchEmployer();
  }, [employerId, token]);

  // ✅ Join socket room and receive real-time messages
  useEffect(() => {
    if (!socket || !senderId || !employerId) return;

    socket.emit("join", { room });

    socket.on("receiveMessage", (data) => {
      if (
        (data.senderId === senderId && data.receiverId === employerId) ||
        (data.senderId === employerId && data.receiverId === senderId)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, room, senderId, employerId]);

  // ✅ Load chat history on mount or when employerId changes
  useEffect(() => {
    if (!senderId || !employerId) return;
    const jobParam = jobId || "null";

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9999/api/chat/${jobParam}/${senderId}/${employerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log('Fetched messages:', res.data.data);
        console.log('Current senderId:', senderId);
        console.log('Current employerId:', employerId);
        setMessages(res.data.data || []);
      } catch (err) {
        console.error("❌ Error loading messages:", err);
      }
    };

    fetchMessages();
  }, [senderId, employerId]);

  // ✅ Send new message
  const handleSend = async () => {
    if (!message.trim()) return;

    const now = new Date();
    const data = {
      senderId,
      receiverId: employerId,
      content: message.trim(),
      jobId,
      createdAt: now.toISOString(),
    };

    try {
      await axios.post("http://localhost:9999/api/chat/send", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (socket) socket.emit("sendMessage", { ...data, room });

      setMessage("");
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {employerInfo?.email?.charAt(0).toUpperCase() || "E"}
            </span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {employerInfo?.email || "Loading..."}
            </h1>
            <p className="text-sm text-gray-500">Active now</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex flex-col h-[calc(100vh-140px)]">
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-4xl mx-auto">
            {messages.map((msg, i) => {
              // Handle object IDs - extract the actual ID value
              const msgSenderId = typeof msg.senderId === 'object' ? 
                (msg.senderId._id || msg.senderId.id || msg.senderId) : 
                String(msg.senderId);
                
              const msgReceiverId = typeof msg.receiverId === 'object' ? 
                (msg.receiverId._id || msg.receiverId.id || msg.receiverId) : 
                String(msg.receiverId);
              
              const currentUserId = String(senderId);
              const currentEmployerId = String(employerId);
              
              // Check if message is from current user
              const isMyMessage = String(msgSenderId) === currentUserId;
              const isEmployerMessage = String(msgSenderId) === currentEmployerId;
              
              console.log(`Message ${i}:`, {
                content: msg.content,
                extractedSenderId: msgSenderId,
                extractedReceiverId: msgReceiverId,
                currentUserId: currentUserId,
                employerId: currentEmployerId,
                isMyMessage: isMyMessage,
                isEmployerMessage: isEmployerMessage
              });
              
              return (
                <div
                  key={i}
                  className={`mb-6 flex ${
                    isMyMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Employer Avatar (left side) */}
                  {isEmployerMessage && (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-gray-600 font-semibold text-xs">
                        {employerInfo?.email?.charAt(0).toUpperCase() || "E"}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex flex-col">
                    {/* Sender Label */}
                    <div className={`text-xs text-gray-500 mb-1 ${
                      isMyMessage ? "text-right" : "text-left"
                    }`}>
                      {isMyMessage ? "You" : (employerInfo?.email || "Employer")}
                    </div>
                    
                    {/* Message Bubble */}
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        isMyMessage
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-gray-100 text-gray-900 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p
                        className={`text-xs mt-2 ${
                          isMyMessage
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </p>
                    </div>
                  </div>

                  {/* Your Avatar (right side) */}
                  {isMyMessage && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-xs">
                        {user?.email?.charAt(0).toUpperCase() || "Y"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  message.trim()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;