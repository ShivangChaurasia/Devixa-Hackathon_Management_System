import { Router } from 'express';
import { adminController } from './admin.controller.js';
import { protect, authorize } from '../auth/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/analytics', authorize('ADMIN'), adminController.getAnalytics);
router.get('/users', authorize('ADMIN'), adminController.listUsers);
router.patch('/users/:userId/status', authorize('ADMIN'), adminController.setUserStatus);
router.patch('/users/:userId/role', authorize('ADMIN'), adminController.setUserRole);

router.get('/hackathons', authorize('ADMIN'), adminController.listHackathons);
router.patch('/hackathons/:hackathonId/status', authorize('ADMIN'), adminController.setHackathonStatus);

router.get('/submissions', authorize('ADMIN'), adminController.listSubmissions);

router.get('/certificate/:hackathonId/user/:userId', adminController.generateCertificate);

export default router;
