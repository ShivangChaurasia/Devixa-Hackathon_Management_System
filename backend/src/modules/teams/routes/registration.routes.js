import { Router } from 'express';
import { registrationController } from '../controller/registration.controller.js';
import { protect, authorize } from '../../auth/auth.middleware.js';
import { validate } from '../../../common/middlewares/validate.js';
import { registerSchema, updateRegistrationStatusSchema } from '../validation/registration.validation.js';

const router = Router();

router.use(protect);

router.post('/', validate(registerSchema), registrationController.register);
router.delete('/:hackathonId', registrationController.cancel);
router.get('/my-registrations', registrationController.getUserRegistrations);
router.get('/hackathon/:hackathonId', authorize('ORGANIZER', 'ADMIN'), registrationController.getHackathonRegistrations);
router.patch('/:id/status', authorize('ORGANIZER', 'ADMIN'), validate(updateRegistrationStatusSchema), registrationController.updateStatus);

export default router;
