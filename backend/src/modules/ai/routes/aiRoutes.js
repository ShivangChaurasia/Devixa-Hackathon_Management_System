import { Router } from 'express';
import { aiController } from '../controller/aiController.js';
import { protect, authorize, optionalAuth } from '../../auth/auth.middleware.js';
import { validate } from '../../../common/middlewares/validate.js';
import {
  codeReviewSchema,
  readmeSchema,
  analyzeSubmissionSchema,
  summarizeSchema,
  chatSchema,
} from '../validation/aiValidation.js';

const router = Router();

router.post('/code-review', protect, authorize('ADMIN', 'ORGANIZER', 'JUDGE'), validate(codeReviewSchema), aiController.reviewCode);
router.post('/generate-readme', protect, validate(readmeSchema), aiController.generateREADME);
router.post('/analyze-submission', protect, authorize('ADMIN', 'ORGANIZER', 'JUDGE'), validate(analyzeSubmissionSchema), aiController.analyzeSubmission);
router.post('/summarize', protect, validate(summarizeSchema), aiController.summarize);
router.post('/chat', optionalAuth, validate(chatSchema), aiController.chat);
router.get('/health', protect, authorize('ADMIN'), aiController.getHealth);

export default router;
