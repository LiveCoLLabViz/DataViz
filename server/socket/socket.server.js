import http from "http";
import { Server } from "socket.io";
import cors from 'cors';
import dotenv from 'dotenv';
import setupSocket from "./index.js";
 import socketAuth from "./socketAuth.js";

export default function initializeSocket(app) {

    // Create HTTP Server
    const server = http.createServer(app);


    // Create Socket.IO Server
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || process.env.CLIENT_URL || 'http://localhost:5173',
            credentials: true
        }
    });

    // Authentication
//    io.use(socketAuth);

    // Register all socket events
    setupSocket(io);

    return server;
}