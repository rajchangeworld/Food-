import http from 'http';
import app from './app.js';
import { config } from './config/env.js';
import { connectDB, disconnectDB } from './config/database.js';
import { initializeSocket } from './sockets/socketManager.js';
import { seedMenu, seedAdminUser } from './utils/seedMenu.js';

const httpServer = http.createServer(app);

// Initialize Socket.IO with the HTTP server
initializeSocket(httpServer);

async function startServer() {
  try {
    // Attempt database connection
    await connectDB();

    // Idempotent database seeding for local development
    await seedMenu();
    await seedAdminUser();

    function listenOnPort(port) {
      httpServer.listen(port, () => {
        console.log(`\n======================================================`);
        console.log(`🚀 Food Delivery API running on port ${port}`);
        console.log(`📍 Environment : ${config.env}`);
        console.log(`📡 Socket.IO   : Enabled`);
        console.log(`🩺 Health check: http://localhost:${port}/api/health`);
        console.log(`======================================================\n`);
      });
    }

    httpServer.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        const fallbackPort = config.port === 5000 ? 5001 : config.port + 1;
        console.warn(`[Port Conflict] Port ${config.port} is already in use (common with macOS AirPlay Receiver).`);
        console.warn(`[Port Conflict] Automatically falling back to port ${fallbackPort}...`);
        listenOnPort(fallbackPort);
      } else {
        console.error(`[Server Error] ${err.message}`);
      }
    });

    listenOnPort(config.port);
  } catch (error) {
    console.error(`[Server Fatal Error] Failed to start server: ${error.message}`);
    httpServer.listen(config.port, () => {
      console.warn(`[Server Warning] Started in degraded mode without MongoDB on port ${config.port}`);
    });
  }
}

// Graceful shutdown handling
function handleGracefulShutdown(signal) {
  console.log(`\n[Server] Received ${signal}. Starting graceful shutdown...`);
  httpServer.close(async () => {
    console.log('[Server] HTTP and Socket server closed.');
    try {
      await disconnectDB();
      console.log('[Database] MongoDB connection closed.');
      process.exit(0);
    } catch (err) {
      console.error(`[Shutdown Error] Error during DB disconnect: ${err.message}`);
      process.exit(1);
    }
  });

  // Force exit after 10s if connections remain stuck
  setTimeout(() => {
    console.error('[Server] Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));

startServer();

export { httpServer, app };
