import { Router } from 'express';
import { teamController } from '../controller/team.controller.js';
import { protect } from '../../auth/auth.middleware.js';
import { validate } from '../../../common/middlewares/validate.js';
import {
  createTeamSchema,
  joinTeamSchema,
  removeMemberSchema,
  transferLeadershipSchema,
} from '../validation/team.validation.js';

const router = Router();

router.use(protect);

router.post('/', validate(createTeamSchema), teamController.create);
router.post('/join', validate(joinTeamSchema), teamController.join);
router.get('/my-teams', teamController.getMyTeams);
router.get('/:id', teamController.getById);
router.get('/hackathon/:hackathonId', teamController.listByHackathon);
router.post('/:id/leave', teamController.leave);
router.post('/:id/remove-member', validate(removeMemberSchema), teamController.removeMember);
router.patch('/:id/transfer-leadership', validate(transferLeadershipSchema), teamController.transferLeadership);
router.delete('/:id', teamController.delete);

export default router;
