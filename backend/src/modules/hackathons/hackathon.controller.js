import { hackathonService } from './hackathon.service.js';
import { ApiResponse } from '../../common/utils/apiResponse.js';
import { asyncHandler } from '../../common/middlewares/asyncHandler.js';

export class HackathonController {
  create = asyncHandler(async (req, res) => {
    const hackathon = await hackathonService.createHackathon(req.body, req.user._id);
    return ApiResponse.created(res, 'Hackathon created successfully', { hackathon });
  });

  list = asyncHandler(async (req, res) => {
    const result = await hackathonService.listHackathons(req.query);
    return ApiResponse.success(res, 'Hackathons retrieved successfully', result.items, 200, result.meta);
  });

  getById = asyncHandler(async (req, res) => {
    const hackathon = await hackathonService.getHackathonById(req.params.id);
    return ApiResponse.success(res, 'Hackathon details retrieved', { hackathon });
  });

  update = asyncHandler(async (req, res) => {
    const hackathon = await hackathonService.updateHackathon(req.params.id, req.body, req.user);
    return ApiResponse.success(res, 'Hackathon updated successfully', { hackathon });
  });

  updateStatus = asyncHandler(async (req, res) => {
    const hackathon = await hackathonService.transitionStatus(req.params.id, req.body.status, req.user);
    return ApiResponse.success(res, `Hackathon status changed to '${req.body.status}'`, { hackathon });
  });

  assignJudge = asyncHandler(async (req, res) => {
    const hackathon = await hackathonService.assignJudge(req.params.id, req.body.judgeUserId, req.user);
    return ApiResponse.success(res, 'Judge assigned successfully', { hackathon });
  });

  removeJudge = asyncHandler(async (req, res) => {
    const hackathon = await hackathonService.removeJudge(req.params.id, req.params.judgeId, req.user);
    return ApiResponse.success(res, 'Judge removed successfully', { hackathon });
  });

  delete = asyncHandler(async (req, res) => {
    await hackathonService.deleteHackathon(req.params.id, req.user);
    return ApiResponse.success(res, 'Hackathon deleted successfully');
  });

  getInvites = asyncHandler(async (req, res) => {
    const result = await hackathonService.getPendingInvites(req.user.email);
    return ApiResponse.success(res, 'Invites retrieved successfully', result);
  });

  acceptInvite = asyncHandler(async (req, res) => {
    const hackathon = await hackathonService.acceptJudgeInvite(req.params.id, req.user);
    return ApiResponse.success(res, 'Invite accepted successfully', { hackathon });
  });

  declineInvite = asyncHandler(async (req, res) => {
    const hackathon = await hackathonService.declineJudgeInvite(req.params.id, req.user);
    return ApiResponse.success(res, 'Invite declined successfully', { hackathon });
  });
}

export const hackathonController = new HackathonController();
