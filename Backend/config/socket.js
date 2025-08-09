import { Server } from "socket.io";

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL , 
        "https://indeed-clone-project.vercel.app"
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports : ['websocket' , 'polling'],
    allowEIO3v: true
  });

  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    socket.on("join", ({ room }) => {
      socket.join(room);
      console.log(`👥 User joined room: ${room}`);
    });

    socket.on("sendMessage", (data) => {
      io.to(data.room).emit("receiveMessage", data);
      io.emit("newMessage");
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });

  return io;
};
