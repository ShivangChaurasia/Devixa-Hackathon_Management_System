import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env.config.js';
import { logger } from '../utils/logger.js';

class SocketManager {
  constructor() {
    this.io = null;
  }

  init(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: config.corsOrigin,
        credentials: true,
      },
    });

    // Middleware: JWT Authentication for Socket Connections
    this.io.use((socket, next) => {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      if (!token) {
        return next(new Error('Authentication token required'));
      }
      try {
        const decoded = jwt.verify(token, config.jwt.secret);
        socket.user = decoded;
        next();
      } catch (err) {
        return next(new Error('Invalid socket token'));
      }
    });

    this.io.on('connection', (socket) => {
      logger.info(`[Socket.io] Client Connected: ${socket.id} | User ID: ${socket.user?.id}`);

      // Room join logic per hackathon
      socket.on('join_hackathon', (hackathonId) => {
        socket.join(`hackathon:${hackathonId}`);
        logger.info(`[Socket.io] Socket ${socket.id} joined room hackathon:${hackathonId}`);
      });

      socket.on('leave_hackathon', (hackathonId) => {
        socket.leave(`hackathon:${hackathonId}`);
      });

      socket.on('disconnect', () => {
        logger.info(`[Socket.io] Client Disconnected: ${socket.id}`);
      });
    });

    logger.info('[Socket.io] Realtime WebSocket Manager initialized successfully.');
    return this.io;
  }

  emitToHackathon(hackathonId, event, data) {
    if (this.io) {
      this.io.to(`hackathon:${hackathonId}`).emit(event, data);
    }
  }

  broadcast(event, data) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }
}

export const socketManager = new SocketManager();
