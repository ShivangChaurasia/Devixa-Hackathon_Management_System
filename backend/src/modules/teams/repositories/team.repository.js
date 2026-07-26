import { BaseRepository } from '../../../common/repository/BaseRepository.js';
import { Team } from '../models/team.model.js';

export class TeamRepository extends BaseRepository {
  constructor() {
    super(Team);
  }

  async findByInviteCode(inviteCode) {
    return await this.model
      .findOne({ inviteCode: inviteCode.toUpperCase(), deletedAt: null })
      .populate('hackathonId')
      .exec();
  }

  async findUserTeamInHackathon(userId, hackathonId) {
    return await this.model
      .findOne({
        hackathonId,
        members: userId,
        deletedAt: null,
      })
      .exec();
  }

  async findByIdPopulated(id) {
    return await this.model
      .findOne({ _id: id, deletedAt: null })
      .populate('leaderId', 'name email avatar')
      .populate('members', 'name email avatar skills githubUrl')
      .populate('hackathonId', 'title status startDate endDate')
      .exec();
  }

  async findHackathonTeams(hackathonId) {
    return await this.model
      .find({ hackathonId, deletedAt: null })
      .populate('leaderId', 'name email avatar')
      .populate('members', 'name email avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async addMember(teamId, userId) {
    return await this.model.findByIdAndUpdate(
      teamId,
      { $addToSet: { members: userId } },
      { new: true }
    ).exec();
  }

  async removeMember(teamId, userId) {
    return await this.model.findByIdAndUpdate(
      teamId,
      { $pull: { members: userId } },
      { new: true }
    ).exec();
  }

  async updateLeader(teamId, newLeaderId) {
    return await this.model.findByIdAndUpdate(
      teamId,
      { leaderId: newLeaderId },
      { new: true }
    ).exec();
  }
}

export const teamRepository = new TeamRepository();
