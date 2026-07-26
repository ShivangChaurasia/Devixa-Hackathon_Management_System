import { userRepository } from '../auth/auth.repository.js';
import { hackathonRepository } from '../hackathons/hackathon.repository.js';
import { teamRepository } from '../teams/repositories/team.repository.js';
import { submissionRepository } from '../submissions/submission.repository.js';
import { hackathonStateMachine } from '../hackathons/hackathon.stateMachine.js';
import { NotFoundError, BadRequestError } from '../../common/errors/AppError.js';

export class AdminService {
  async getPlatformAnalytics() {
    const [totalUsers, totalHackathons, totalTeams, totalSubmissions, usersByRole, hackathonsByMode] = await Promise.all([
      userRepository.count(),
      hackathonRepository.count(),
      teamRepository.count(),
      submissionRepository.count(),
      userRepository.model.aggregate([
        { $match: { deletedAt: null } },
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]),
      hackathonRepository.model.aggregate([
        { $match: { deletedAt: null } },
        { $group: { _id: '$mode', count: { $sum: 1 } } },
      ]),
    ]);

    return {
      totals: {
        users: totalUsers,
        hackathons: totalHackathons,
        teams: totalTeams,
        submissions: totalSubmissions,
      },
      distribution: {
        usersByRole,
        hackathonsByMode,
      },
    };
  }

  async listUsers(pagination = {}) {
    const { page = 1, limit = 20, search } = pagination;
    const query = { deletedAt: null };
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }
    return await userRepository.find(query, {
      select: '-password',
      limit: Number(limit),
      skip: (page - 1) * limit,
    });
  }

  async setUserStatus(userId, status) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return await userRepository.updateById(userId, { status });
  }

  async setUserRole(userId, role) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return await userRepository.updateById(userId, { role });
  }

  async generateCertificate(hackathonId, userId) {
    const hackathon = await hackathonRepository.findById(hackathonId);
    if (!hackathon) {
      throw new NotFoundError('Hackathon not found');
    }

    if (!hackathonStateMachine.canGenerateCertificates(hackathon)) {
      throw new BadRequestError(`Certificates can only be issued after hackathon is COMPLETED. Current status: '${hackathon.status}'`);
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      certificateId: `DEVIXA-${hackathonId.toString().slice(-6)}-${userId.toString().slice(-6)}`.toUpperCase(),
      issueDate: new Date().toISOString(),
      recipientName: user.name,
      hackathonTitle: hackathon.title,
      organizerId: hackathon.organizerId,
      verificationUrl: `https://devixa.platform/verify/DEVIXA-${hackathonId.toString().slice(-6)}-${userId.toString().slice(-6)}`.toUpperCase(),
    };
  }
}

export const adminService = new AdminService();
