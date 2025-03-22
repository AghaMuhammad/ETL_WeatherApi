import express from 'express';
import dotenv from 'dotenv';
import dataRoutes from './api/routes/dataRoutes';
import { errorHandler } from './api/middleware/errorHandler';
import { startETLScheduler } from './infrastructure/schedulers/etlScheduler';
import { logger } from './utils/logger';
import { config } from './utils/config';

dotenv.config();

const app = express();

// Middleware to parse JSON requests.
app.use(express.json());

// API routes for weather data.
app.use('/data', dataRoutes);

// Global error handling middleware.
app.use(errorHandler);

// Only start the ETL scheduler and server if not in test environment.
if (process.env.NODE_ENV !== 'test') {
  startETLScheduler();
  app.listen(config.port, () => {
    logger.info(`Server is running on port ${config.port}`);
  });
}

export default app;
