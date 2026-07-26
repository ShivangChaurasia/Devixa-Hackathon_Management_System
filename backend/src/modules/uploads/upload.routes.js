import { Router } from 'express';
import { uploadController } from './upload.controller.js';
import { protect } from '../auth/auth.middleware.js';
import { upload } from '../../common/middlewares/upload.middleware.js';

const router = Router();

router.use(protect);

router.post('/single', upload.single('file'), uploadController.uploadSingle);

export default router;
