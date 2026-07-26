import { Review } from '../judging/judging.model.js';
import { hackathonRepository } from '../hackathons/hackathon.repository.js';
import { inMemoryCache } from '../../common/cache/inMemoryCache.js';
import { socketManager } from '../../common/socket/socket.manager.js';
import { NotFoundError } from '../../common/errors/AppError.js';

export class LeaderboardService {
  async getLeaderboard(hackathonId, bypassCache = false) {
    if (!bypassCache) {
      const cached = inMemoryCache.get('leaderboard', { hackathonId });
      if (cached) {
        return cached;
      }
    }

    const hackathon = await hackathonRepository.findById(hackathonId);
    if (!hackathon) {
      throw new NotFoundError('Hackathon not found');
    }

    const pipelineResults = await Review.aggregate([
      { $match: { hackathonId: hackathon._id, isFinalized: true, deletedAt: null } },
      {
        $group: {
          _id: '$submissionId',
          averageScore: { $avg: '$totalScore' },
          reviewCount: { $sum: 1 },
        },
      },
      { $sort: { averageScore: -1 } },
      {
        $lookup: {
          from: 'submissions',
          localField: '_id',
          foreignField: '_id',
          as: 'submission',
        },
      },
      { $unwind: '$submission' },
      {
        $lookup: {
          from: 'teams',
          localField: 'submission.teamId',
          foreignField: '_id',
          as: 'team',
        },
      },
      { $unwind: '$team' },
      {
        $project: {
          _id: 0,
          submissionId: '$_id',
          teamId: '$team._id',
          teamName: '$team.name',
          projectName: '$submission.projectName',
          totalScore: { $round: ['$averageScore', 2] },
          reviewCount: 1,
        },
      },
    ]);

    const leaderboard = pipelineResults.map((item, index) => {
      let position = 'Participant';
      if (index === 0) position = 'Winner (1st Place)';
      else if (index === 1) position = '1st Runner Up (2nd Place)';
      else if (index === 2) position = '2nd Runner Up (3rd Place)';

      return {
        rank: index + 1,
        position,
        ...item,
      };
    });

    inMemoryCache.set('leaderboard', { hackathonId }, leaderboard, 300); // 5 mins TTL
    socketManager.emitToHackathon(hackathonId, 'LEADERBOARD_UPDATED', leaderboard);

    return leaderboard;
  }
}

export const leaderboardService = new LeaderboardService();
