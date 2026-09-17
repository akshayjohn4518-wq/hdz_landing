import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import { apiRouter } from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';
import { checkDbConnection } from './db/connection.js';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      // In development or if origin matches config
      if (config.nodeEnv === 'development' || config.corsOrigin.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for initial integration
    },
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Information Route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    service: 'HDZ Operations Backend Service',
    status: 'ONLINE',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: [
      '/api/health',
      '/api/auth/login',
      '/api/dashboard/stats',
      '/api/dashboard/activities',
      '/api/products',
      '/api/missions',
      '/api/contacts',
      '/api/build-logs',
      '/api/chapters',
      '/api/team',
      '/api/media',
      '/api/settings',
    ],
  });
});

// Mount Main API Router
app.use('/api', apiRouter);

// 404 Not Found Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Start HTTP Server
const server = app.listen(config.port, async () => {
  console.log(`\n======================================================`);
  console.log(`🚀 HDZ Backend Server is running on port ${config.port}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`🌐 Health endpoint: http://localhost:${config.port}/api/health`);
  console.log(`======================================================\n`);

  // Verify database connection on startup
  const dbHealth = await checkDbConnection();
  if (dbHealth.connected) {
    console.log(`[DATABASE] ✅ Connected to Supabase PostgreSQL in ${dbHealth.latencyMs}ms`);
  } else {
    console.error(`[DATABASE] ❌ Connection failed:`, dbHealth.error);
  }
});

// Graceful Shutdown
const handleShutdown = () => {
  console.log('\n[SERVER] Gracefully shutting down...');
  server.close(() => {
    console.log('[SERVER] Closed HTTP server.');
    process.exit(0);
  });
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

export default app;
