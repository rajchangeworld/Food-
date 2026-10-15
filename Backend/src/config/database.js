import mongoose from 'mongoose';
import { config } from './env.js';

let isConnected = false;

export async function connectDB(customUri) {
  const uri = customUri || config.mongoUri;
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn.connection;
  } catch (error) {
    isConnected = false;
    console.error(`[Database Error] Connection failed: ${error.message}`);
    if (config.env !== 'test') {
      // Allow caller or server to handle graceful recovery
    }
    throw error;
  }
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
  }
}

export function getDatabaseHealth() {
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const state = mongoose.connection.readyState;
  return {
    status: state === 1 ? 'healthy' : 'unhealthy',
    state: stateMap[state] || 'unknown',
    databaseName: mongoose.connection.name || null,
    host: mongoose.connection.host || null,
  };
}
