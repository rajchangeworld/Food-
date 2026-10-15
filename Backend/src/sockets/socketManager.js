import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { Order } from '../models/Order.js';

let ioInstance = null;

export function initializeSocket(httpServer) {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: '*', // Allow clients from frontend or capacitor mobile
      methods: ['GET', 'POST', 'PATCH'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Socket middleware for authentication (optional/relaxed for public or auth-token sockets)
  ioInstance.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (token) {
        try {
          const decoded = jwt.verify(token, config.jwt.secret);
          socket.userId = decoded.id;
          socket.userRole = decoded.role;
        } catch {
          // Token invalid, continue as unauthenticated guest
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  });

  ioInstance.on('connection', (socket) => {
    // Join a specific order room: 'join:order', { orderId }
    socket.on('join:order', async (data) => {
      try {
        const orderId = typeof data === 'string' ? data : data?.orderId;
        if (!orderId) return;

        // Verify authorization if user is authenticated
        const order = await Order.findOne({ orderId });
        if (!order) return;

        if (socket.userId && socket.userRole !== 'admin') {
          if (order.user.toString() !== socket.userId) {
            socket.emit('error', { message: 'Unauthorized to subscribe to this order' });
            return;
          }
        }

        const room = `order:${orderId}`;
        socket.join(room);
        socket.emit('joined:order', { orderId, room });
      } catch (err) {
        console.error('[Socket Error] join:order failed:', err.message);
      }
    });

    socket.on('leave:order', (data) => {
      const orderId = typeof data === 'string' ? data : data?.orderId;
      if (orderId) {
        socket.leave(`order:${orderId}`);
      }
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  return ioInstance;
}

export function getIO() {
  return ioInstance;
}

/**
 * Emit real-time status update to subscribers of this order room
 */
export function emitOrderStatusUpdate(orderId, updatePayload) {
  if (!ioInstance) return;
  const room = `order:${orderId}`;
  ioInstance.to(room).emit('orderStatusUpdated', {
    orderId,
    ...updatePayload,
    serverTimestamp: new Date().toISOString(),
  });
}
