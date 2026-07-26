import { Router } from 'express';
import { judgingController } from './judging.controller.js';
import { protect, authorize } from '../auth/auth.middleware.js';
import { validate } from '../../common/middlewares/validate.js';
import { submitEvaluationSchema } from './judging.validation.js';

const router = Router();

router.use(protect);

router.post('/evaluate', authorize('JUDGE', 'ADMIN'), validate(submitEvaluationSchema), judgingController.evaluate);
router.get('/assigned-projects', authorize('JUDGE', 'ADMIN'), judgingController.getAssignedProjects);
router.get('/submission/:submissionId', authorize('ORGANIZER', 'ADMIN'), judgingController.getSubmissionReviews);

export default router;
