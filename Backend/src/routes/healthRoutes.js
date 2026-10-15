import express from 'express';
import { getDatabaseHealth } from '../config/database.js';

const router = express.Router();

router.get('/', (req, res) => {
  const dbHealth = getDatabaseHealth();
  const isHealthy = dbHealth.status === 'healthy';

  const healthData = {
    status: isHealthy ? 'healthy' : 'degraded',
    service: 'food-delivery-api',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: dbHealth,
    environment: process.env.NODE_ENV || 'development',
  };

  const statusCode = isHealthy ? 200 : 503;
  res.status(statusCode).json(healthData);
});

export default router;
