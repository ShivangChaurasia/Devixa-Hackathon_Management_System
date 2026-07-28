import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validate } from '../../common/middlewares/validate.js';
import {
  signupSchema,
  loginSchema,
  googleAuthSchema,
  refreshTokenSchema,
  updateProfileSchema,
  changePasswordSchema,
} from './auth.validation.js';
import { protect } from './auth.middleware.js';
import rateLimit from 'express-rate-limit';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many authentication requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/signup', authLimiter, validate(signupSchema), authController.signup);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/google', authLimiter, validate(googleAuthSchema), authController.googleAuth);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', protect, authController.logout);

router.get('/me', protect, authController.getProfile);
router.patch('/me', protect, validate(updateProfileSchema), authController.updateProfile);
router.patch('/change-password', protect, validate(changePasswordSchema), authController.changePassword);

export default router;
