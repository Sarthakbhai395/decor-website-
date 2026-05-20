import mongoose from 'mongoose';
import logger from '../utils/logger';

// ─── MongoDB Atlas URI Validator ──────────────────────────────────────────────
// Common cause of "bad auth: authentication failed":
//   Special characters in the password (e.g. @, #, %, +) must be percent-encoded.
//   Example: password "p@ss#1" → "p%40ss%231"
//   Use encodeURIComponent() on the password portion only, not the full URI.
const validateMongoUri = (uri: string): void => {
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://');
  }
  if (uri.includes('<db_password>') || uri.includes('<password>')) {
    throw new Error(
      'MONGODB_URI still contains a placeholder password. ' +
      'Replace <db_password> with your actual Atlas password. ' +
      'If your password contains special characters (@, #, %, +, etc.), ' +
      'percent-encode them: encodeURIComponent("yourPassword")'
    );
  }
};

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    logger.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  try {
    validateMongoUri(mongoUri);

    const conn = await mongoose.connect(mongoUri, {
      // Connection pool — 10 is good for a single-instance API server
      maxPoolSize: 10,
      minPoolSize: 2,
      // How long to wait for a server to be found before throwing
      serverSelectionTimeoutMS: 10_000,
      // How long a socket can be idle before being closed
      socketTimeoutMS: 45_000,
      // Heartbeat frequency — keeps the connection alive
      heartbeatFrequencyMS: 10_000,
      // Retry writes on transient network errors
      retryWrites: true,
      // Write concern: majority ensures data is written to primary + replica
      w: 'majority',
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📦 Database: ${conn.connection.name}`);

    // ── Connection event listeners ──────────────────────────────────────────
    mongoose.connection.on('error', (err: Error) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected — Mongoose will auto-reconnect');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed (SIGINT)');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed (SIGTERM)');
      process.exit(0);
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`MongoDB connection failed: ${message}`);

    // Provide actionable hints for the most common Atlas errors
    if (message.includes('bad auth') || message.includes('authentication failed')) {
      logger.error(
        '💡 Auth hint: Check your Atlas Database Access credentials.\n' +
        '   1. Go to Atlas → Database Access → Edit user\n' +
        '   2. Confirm the username and password match your MONGODB_URI\n' +
        '   3. If password has special chars, percent-encode them:\n' +
        '      node -e "console.log(encodeURIComponent(\'yourPassword\'))"\n' +
        '   4. Ensure the user has readWrite role on the target database'
      );
    }

    if (message.includes('ECONNREFUSED') || message.includes('timed out')) {
      logger.error(
        '💡 Network hint: Check Atlas Network Access.\n' +
        '   1. Go to Atlas → Network Access → Add IP Address\n' +
        '   2. Add your current IP or 0.0.0.0/0 for development'
      );
    }

    process.exit(1);
  }
};

export default connectDB;
