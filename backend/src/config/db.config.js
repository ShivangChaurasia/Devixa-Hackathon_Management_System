import mongoose from 'mongoose';
import { config } from './env.config.js';
import { logger } from '../common/utils/logger.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUrl, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`MongoDB Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    logger.warn(`MongoDB Primary Connection Error: ${error.message}`);
    logger.info('Attempting fallback to local MongoDB instance (mongodb://127.0.0.1:27017/devixa)...');
    try {
      const fallbackConn = await mongoose.connect('mongodb://127.0.0.1:27017/devixa', {
        autoIndex: true,
        serverSelectionTimeoutMS: 3000,
      });
      logger.info(`MongoDB Connected successfully to Local Fallback: ${fallbackConn.connection.host}`);
    } catch (fallbackError) {
      logger.error(`MongoDB Connection Failed. Unable to connect to Primary or Local MongoDB instance.`);
      logger.error(`Tips: Please check your internet connection, verify MONGO_URL in .env, or add your current IP to MongoDB Atlas Network Access whitelist.`);
      process.exit(1);
    }
  }
};
