import app from './src/app.js';
import { config } from './src/config/env.config.js';
import { connectDB } from './src/config/db.config.js';
import { socketManager } from './src/common/socket/socket.manager.js';
import { logger } from './src/common/utils/logger.js';

const startServer = async () => {
  // Connect to Database
  await connectDB();

  const server = app.listen(config.port, () => {
    logger.info(`🚀 Devixa Backend Server running in [${config.env}] mode on port ${config.port}`);
  });

  // Initialize WebSockets
  socketManager.init(server);

  // Handle Unhandled Rejections & Uncaught Exceptions
  process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down gracefully...', { error: err.message, stack: err.stack });
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down immediately...', { error: err.message, stack: err.stack });
    process.exit(1);
  });
};

startServer();
