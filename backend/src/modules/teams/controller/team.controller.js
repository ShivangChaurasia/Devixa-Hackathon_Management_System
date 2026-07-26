import { teamService } from '../service/team.service.js';
import { ApiResponse } from '../../../common/utils/apiResponse.js';
import { asyncHandler } from '../../../common/middlewares/asyncHandler.js';

export class TeamController {
  create = asyncHandler(async (req, res) => {
    const team = await teamService.createTeam(req.body, req.user._id);
    return ApiResponse.created(res, 'Team created successfully', { team });
  });

  join = asyncHandler(async (req, res) => {
    const team = await teamService.joinTeam(req.body.inviteCode, req.user._id);
    return ApiResponse.success(res, 'Joined team successfully', { team });
  });

  getById = asyncHandler(async (req, res) => {
    const team = await teamService.getTeamById(req.params.id);
    return ApiResponse.success(res, 'Team details retrieved', { team });
  });

  listByHackathon = asyncHandler(async (req, res) => {
    const teams = await teamService.listHackathonTeams(req.params.hackathonId);
    return ApiResponse.success(res, 'Hackathon teams retrieved', { teams });
  });

  leave = asyncHandler(async (req, res) => {
    const team = await teamService.leaveTeam(req.params.id, req.user._id);
    return ApiResponse.success(res, 'Left team successfully', { team });
  });

  removeMember = asyncHandler(async (req, res) => {
    const team = await teamService.removeMember(req.params.id, req.body.memberId, req.user._id);
    return ApiResponse.success(res, 'Member removed from team', { team });
  });

  transferLeadership = asyncHandler(async (req, res) => {
    const team = await teamService.transferLeadership(req.params.id, req.body.newLeaderId, req.user._id);
    return ApiResponse.success(res, 'Leadership transferred successfully', { team });
  });

  delete = asyncHandler(async (req, res) => {
    await teamService.deleteTeam(req.params.id, req.user._id);
    return ApiResponse.success(res, 'Team disbanded successfully');
  });
}

export const teamController = new TeamController();
