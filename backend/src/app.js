import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { mongoSanitizeMiddleware } from './common/middlewares/mongoSanitize.js';
import { config } from './config/env.config.js';
import { errorHandler } from './common/middlewares/errorHandler.js';
import { NotFoundError } from './common/errors/AppError.js';
import { ApiResponse } from './common/utils/apiResponse.js';

import path from 'path';

import { setupSwagger } from './config/swagger.config.js';

// Route Imports
import authRoutes from './modules/auth/auth.routes.js';
import aiRoutes from './modules/ai/routes/aiRoutes.js';
import hackathonRoutes from './modules/hackathons/hackathon.routes.js';
import registrationRoutes from './modules/teams/routes/registration.routes.js';
import teamRoutes from './modules/teams/routes/team.routes.js';
import submissionRoutes from './modules/submissions/submission.routes.js';
import judgingRoutes from './modules/judging/judging.routes.js';
import leaderboardRoutes from './modules/leaderboard/leaderboard.routes.js';
import uploadRoutes from './modules/uploads/upload.routes.js';
import notificationRoutes from './modules/notifications/notification.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// Request Parsing & Sanitization
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitizeMiddleware);

// Serve static uploads
app.use('/uploads', express.static(path.resolve('uploads')));

// Swagger UI OpenAPI Documentation
setupSwagger(app);

// Health Check Endpoint
app.get('/health', (req, res) => {
  return ApiResponse.success(res, 'Devixa Backend System operational', {
    status: 'UP',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

// API Routes (v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/hackathons', hackathonRoutes);
app.use('/api/v1/registrations', registrationRoutes);
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1/submissions', submissionRoutes);
app.use('/api/v1/judging', judgingRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);
app.use('/api/v1/uploads', uploadRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  next(new NotFoundError(`Cannot find endpoint ${req.originalUrl} on this server`));
});

// Global Error Handler
app.use(errorHandler);

export default app;
