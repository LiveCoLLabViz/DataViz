import registerChatSocket from "./chat.socket.js";
import registerChartSocket from "./chart.socket.js";

export default function setupSocket(io) {
  console.log("✅ Socket.IO initialized");

  io.on("connection", (socket) => {
    console.log(`✅ Client Connected: ${socket.id}`);

    setTimeout(() => {
      console.log("Emitting server:test");

      socket.emit("server:test", {
        message: "Socket server is working!",
      });
    }, 2000);

    // Register Chat Events
    registerChatSocket(io, socket);

    // Register Chart Events
    registerChartSocket(io, socket);

    socket.on("disconnect", (reason) => {
      console.log(`❌ Client Disconnected: ${socket.id}`);
      console.log(`Reason: ${reason}`);
    });
  });
}
