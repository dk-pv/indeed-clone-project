// import { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { useSocket } from "../context/SocketContext";

// const ChatPage = () => {
//   const { employerId } = useParams(); // route: /chat/:employerId
//   const socket = useSocket();
//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = localStorage.getItem("token");

//   const senderId = user?._id || user?.id;

//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [employerInfo, setEmployerInfo] = useState(null);

//   const messagesEndRef = useRef(null);
//   const jobId = null; // Optional job context
//   const room = [senderId, employerId].sort().join("_");

//   // Scroll to latest message
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   // Fetch employer info
//   useEffect(() => {
//     if (!employerId) return;

//     const fetchEmployer = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:9999/api/auth/${employerId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setEmployerInfo(res.data?.data);
//       } catch (err) {
//         console.error(
//           "❌ Error fetching employer info:",
//           err.response?.data || err.message
//         );
//       }
//     };

//     fetchEmployer();
//   }, [employerId, token]);

//   // Join socket room and listen for messages
//   useEffect(() => {
//     if (!socket || !senderId || !employerId) return;

//     console.log("📡 Socket ready:", socket);

//     socket.emit("join", { room });

//     socket.on("receiveMessage", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     return () => {
//       socket.off("receiveMessage");
//     };
//   }, [socket, room, senderId, employerId]);

//   // Fetch previous messages
//   useEffect(() => {
//     const idForJob = jobId || "null";

//     if (!senderId || !employerId) {
//       console.error("❌ Missing user ID or employer ID");
//       return;
//     }

//     console.log("📨 Fetching messages with:", {
//       jobId: idForJob,
//       senderId,
//       receiverId: employerId,
//     });

//     axios
//       .get(
//         `http://localhost:9999/api/chat/${idForJob}/${senderId}/${employerId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       )
//       .then((res) => setMessages(res.data.data))
//       .catch((err) =>
//         console.error(
//           "❌ Error loading messages:",
//           err.response?.data || err.message
//         )
//       );
//   }, [senderId, employerId]);

//   // Send new message
//   const handleSend = async () => {
//     if (!message.trim()) return;

//     const data = {
//       senderId,
//       receiverId: employerId,
//       content: message,
//       jobId,
//     };

//     try {
//       await axios.post("http://localhost:9999/api/chat/send", data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (socket) {
//         socket.emit("sendMessage", { ...data, room });
//       }

//       setMessage("");
//     } catch (err) {
//       console.error(
//         "❌ Error sending message:",
//         err.response?.data || err.message
//       );
//     }
//   };

//   return (
//     <div className="p-4 max-w-xl mx-auto">
//       <h2 className="text-xl font-semibold mb-4">
//         Chat with {employerInfo?.email || "Loading..."}
//       </h2>

//       <div className="border rounded p-3 h-[400px] overflow-y-auto bg-gray-50 mb-3">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`mb-2 p-2 rounded max-w-[75%] text-sm ${
//               msg.senderId === senderId
//                 ? "ml-auto bg-blue-100 text-right"
//                 : "mr-auto bg-white text-left"
//             }`}
//           >
//             <p>{msg.content}</p>
//             <p className="text-xs text-gray-500 mt-1">
//               {new Date(msg.createdAt).toLocaleTimeString()}
//             </p>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="flex gap-2">
//         <input
//           type="text"
//           className="flex-1 border px-3 py-2 rounded"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type a message..."
//         />
//         <button
//           onClick={handleSend}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;



import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
  const { employerId } = useParams(); // route: /chat/:employerId
  const socket = useSocket();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const senderId = user?._id || user?.id;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [employerInfo, setEmployerInfo] = useState(null);

  const messagesEndRef = useRef(null);
  const jobId = null; // Optional job context
  const room = [senderId, employerId].sort().join("_");

  // Scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch employer info
  useEffect(() => {
    if (!employerId) return;

    const fetchEmployer = async () => {
      try {
        const res = await axios.get(`http://localhost:9999/api/auth/${employerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployerInfo(res.data?.data);
      } catch (err) {
        console.error("❌ Error fetching employer info:", err.response?.data || err.message);
      }
    };

    fetchEmployer();
  }, [employerId, token]);

  // Join socket room and listen for messages
  useEffect(() => {
    if (!socket || !senderId || !employerId) return;

    console.log("📡 Socket ready:", socket);

    socket.emit("join", { room });

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [socket, room, senderId, employerId]);

  // Fetch previous messages
  useEffect(() => {
    const idForJob = jobId || "null";

    if (!senderId || !employerId) {
      console.error("❌ Missing user ID or employer ID");
      return;
    }

    console.log("📨 Fetching messages with:", {
      jobId: idForJob,
      senderId,
      receiverId: employerId,
    });

    axios
      .get(`http://localhost:9999/api/chat/${idForJob}/${senderId}/${employerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setMessages(res.data.data))
      .catch((err) =>
        console.error("❌ Error loading messages:", err.response?.data || err.message)
      );
  }, [senderId, employerId]);

  // Send new message
const handleSend = async () => {
  if (!message.trim()) return;

  const now = new Date();

  const data = {
    senderId,
    receiverId: employerId,
    content: message,
    jobId,
    createdAt: now.toISOString(), // so the time is sent along
  };

  try {
    await axios.post("http://localhost:9999/api/chat/send", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (socket) {
      socket.emit("sendMessage", { ...data, room });
    }

    setMessage(""); // ✅ just clear message input
  } catch (err) {
    console.error("❌ Error sending message:", err.response?.data || err.message);
  }
};


  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Chat with {employerInfo?.email || "Loading..."}
      </h2>

      <div className="border rounded p-3 h-[400px] overflow-y-auto bg-gray-50 mb-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded max-w-[75%] text-sm ${
              msg.senderId === senderId
                ? "ml-auto bg-blue-100 text-right"
                : "mr-auto bg-white text-left"
            }`}
          >
            <p>{msg.content}</p>
            <p className="text-xs text-gray-500 mt-1">
              {msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border px-3 py-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;

