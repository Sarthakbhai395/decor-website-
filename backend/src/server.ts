import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';

import { validateEnv } from './config/env';
import connectDB from './config/database';
import { globalLimiter } from './middleware/rateLimiter';
import { errorHandler, notFound } from './middleware/errorHandler';
import logger from './utils/logger';

// ─── Validate environment variables before anything else ──────────────────────
validateEnv();

// Routes
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import bookingRoutes from './routes/bookingRoutes';
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import reviewRoutes from './routes/reviewRoutes';
import couponRoutes from './routes/couponRoutes';
import blogRoutes from './routes/blogRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(mongoSanitize());
app.use(globalLimiter);

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  // Allow any local-network origin (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
  /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/,
  /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/,
  /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}(:\d+)?$/,
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Always allow localhost origins in development
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    const allowed = allowedOrigins.some((o) =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    if (allowed) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(compression());

// ─── Logging ──────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Luxe Celebrations API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/services`, serviceRoutes);
app.use(`${API_PREFIX}/bookings`, bookingRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}`, categoryRoutes);
app.use(`${API_PREFIX}/reviews`, reviewRoutes);
app.use(`${API_PREFIX}/coupons`, couponRoutes);
app.use(`${API_PREFIX}/blogs`, blogRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = parseInt(String(process.env.PORT || '5000'), 10);
const HOST = '0.0.0.0'; // bind to all interfaces so mobile on LAN can reach it

/**
 * Kill whatever process is holding PORT, then retry listening.
 * Works on Windows (taskkill) and Unix (kill).
 */
function killPortAndRetry(server: ReturnType<typeof app.listen>) {
  const { execSync } = require('child_process');
  try {
    if (process.platform === 'win32') {
      // Find PID holding the port
      const out = execSync(`netstat -ano | findstr :${PORT}`, { encoding: 'utf8' });
      const match = out.match(/LISTENING\s+(\d+)/);
      if (match) {
        const pid = match[1];
        if (parseInt(pid) !== process.pid) {
          execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
          logger.info(`🔪 Killed stale process PID ${pid} holding port ${PORT}`);
        }
      }
    } else {
      execSync(`fuser -k ${PORT}/tcp`, { stdio: 'ignore' });
      logger.info(`🔪 Killed stale process holding port ${PORT}`);
    }
  } catch { /* nothing to kill */ }

  // Wait 500ms then retry
  setTimeout(() => {
    server.listen(PORT, HOST);
  }, 500);
}

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, HOST, () => {
    const { networkInterfaces } = require('os');
    const localIPs: string[] = [];
    Object.values(networkInterfaces()).forEach((ifaces: any) => {
      ifaces?.forEach((iface: any) => {
        if (iface.family === 'IPv4' && !iface.internal) localIPs.push(iface.address);
      });
    });
    logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    logger.info(`📡 Local:   http://localhost:${PORT}/api/v1`);
    localIPs.forEach((ip) => logger.info(`📡 Network: http://${ip}:${PORT}/api/v1`));
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      logger.warn(`⚠️  Port ${PORT} in use — killing stale process and retrying...`);
      killPortAndRetry(server);
    } else {
      logger.error(`Server error: ${err.message}`);
      process.exit(1);
    }
  });
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

export default app;
