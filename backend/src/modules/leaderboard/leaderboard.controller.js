import { leaderboardService } from './leaderboard.service.js';
import { ApiResponse } from '../../common/utils/apiResponse.js';
import { asyncHandler } from '../../common/middlewares/asyncHandler.js';

export class LeaderboardController {
  getLeaderboard = asyncHandler(async (req, res) => {
    const { hackathonId } = req.params;
    const leaderboard = await leaderboardService.getLeaderboard(hackathonId);
    return ApiResponse.success(res, 'Hackathon leaderboard retrieved', { leaderboard });
  });
}

export const leaderboardController = new LeaderboardController();
