const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
  });
};

const sendNotification = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

module.exports = { initSocket, sendNotification };
