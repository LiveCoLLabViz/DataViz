import jwt from "jsonwebtoken";
import User from "../models/user.js";

export default async function socketAuth(socket, next) {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication failed"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;

    next();
  } catch (error) {
    next(new Error("Invalid Token"));
  }
}

//here socket is the socket instance and next is a callback function that we call to pass control to the next middleware in the stack. If authentication fails, we call next with an error message. If authentication succeeds, we attach the user object to the socket instance and call next without any arguments.
//what is socket instance? socket instance is an object that represents a single connection between the client and the server. It is created when a client connects to the server using Socket.IO. The socket instance allows the server to communicate with the client in real-time, sending and receiving messages, events, and data. Each client that connects to the server has its own unique socket instance, which can be used to identify and manage that specific connection.