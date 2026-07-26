import { Router } from 'express';
import { aiController } from '../controller/aiController.js';
import { protect, authorize } from '../../auth/auth.middleware.js';
import { validate } from '../../../common/middlewares/validate.js';
import {
  codeReviewSchema,
  readmeSchema,
  analyzeSubmissionSchema,
  summarizeSchema,
} from '../validation/aiValidation.js';

const router = Router();

router.use(protect);

router.post('/code-review', authorize('ADMIN', 'ORGANIZER', 'JUDGE'), validate(codeReviewSchema), aiController.reviewCode);
router.post('/generate-readme', validate(readmeSchema), aiController.generateREADME);
router.post('/analyze-submission', authorize('ADMIN', 'ORGANIZER', 'JUDGE'), validate(analyzeSubmissionSchema), aiController.analyzeSubmission);
router.post('/summarize', validate(summarizeSchema), aiController.summarize);
router.get('/health', authorize('ADMIN'), aiController.getHealth);

export default router;
