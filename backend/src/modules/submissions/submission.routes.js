import { Router } from 'express';
import { submissionController } from './submission.controller.js';
import { protect, authorize } from '../auth/auth.middleware.js';
import { validate } from '../../common/middlewares/validate.js';
import {
  createSubmissionSchema,
  updateSubmissionSchema,
  updateSubmissionStatusSchema,
} from './submission.validation.js';

const router = Router();

router.use(protect);

router.post('/', validate(createSubmissionSchema), submissionController.create);
router.get('/:id', submissionController.getById);
router.get('/hackathon/:hackathonId', submissionController.listByHackathon);
router.patch('/:id', validate(updateSubmissionSchema), submissionController.update);
router.patch('/:id/status', authorize('ORGANIZER', 'ADMIN'), validate(updateSubmissionStatusSchema), submissionController.updateStatus);

export default router;
