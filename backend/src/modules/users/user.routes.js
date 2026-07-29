import { Router } from 'express';
import { userController } from './user.controller.js';
import { validate } from '../../common/middlewares/validate.js';
import { onboardingSchema, updateThemeSchema } from './user.validation.js';
import { protect } from '../auth/auth.middleware.js';

const router = Router();

router.get('/search', userController.searchUsers);
router.get('/check-username/:username', userController.checkUsername);
router.patch('/me/onboarding', protect, validate(onboardingSchema), userController.saveOnboarding);
router.get('/theme', protect, userController.getTheme);
router.patch('/theme', protect, validate(updateThemeSchema), userController.updateTheme);
router.get('/:username', userController.getPublicProfile);

export default router;
