import { Router } from 'express';
import { notificationController } from './notification.controller.js';
import { protect } from '../auth/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/', notificationController.getUserNotifications);
router.patch('/read-all', notificationController.markAsRead);

export default router;
