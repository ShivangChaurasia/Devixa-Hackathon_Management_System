import { Router } from 'express';
import { hackathonController } from './hackathon.controller.js';
import { protect, authorize } from '../auth/auth.middleware.js';
import { validate } from '../../common/middlewares/validate.js';
import {
  createHackathonSchema,
  updateHackathonSchema,
  updateStatusSchema,
  judgeAssignmentSchema,
  hackathonQuerySchema,
} from './hackathon.validation.js';

const router = Router();

// Public routes
router.get('/', validate(hackathonQuerySchema, 'query'), hackathonController.list);
router.get('/:id', hackathonController.getById);

// Protected routes (Organizer & Admin)
router.use(protect);

router.post('/', authorize('ORGANIZER', 'ADMIN'), validate(createHackathonSchema), hackathonController.create);
router.patch('/:id', authorize('ORGANIZER', 'ADMIN'), validate(updateHackathonSchema), hackathonController.update);
router.patch('/:id/status', authorize('ORGANIZER', 'ADMIN'), validate(updateStatusSchema), hackathonController.updateStatus);
router.post('/:id/judges', authorize('ORGANIZER', 'ADMIN'), validate(judgeAssignmentSchema), hackathonController.assignJudge);
router.delete('/:id/judges/:judgeId', authorize('ORGANIZER', 'ADMIN'), hackathonController.removeJudge);
router.delete('/:id', authorize('ORGANIZER', 'ADMIN'), hackathonController.delete);

export default router;
