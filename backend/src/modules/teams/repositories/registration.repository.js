import { BaseRepository } from '../../../common/repository/BaseRepository.js';
import { Registration } from '../models/registration.model.js';

export class RegistrationRepository extends BaseRepository {
  constructor() {
    super(Registration);
  }

  async findByUserAndHackathon(userId, hackathonId) {
    return await this.model.findOne({ userId, hackathonId, deletedAt: null }).exec();
  }

  async findUserRegistrations(userId) {
    return await this.model
      .find({ userId, deletedAt: null })
      .populate('hackathonId')
      .populate('teamId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findHackathonRegistrations(hackathonId) {
    return await this.model
      .find({ hackathonId, deletedAt: null })
      .populate('userId', 'name email avatar skills')
      .populate('teamId', 'name inviteCode leaderId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateTeamReference(userId, hackathonId, teamId) {
    return await this.model.findOneAndUpdate(
      { userId, hackathonId, deletedAt: null },
      { teamId },
      { new: true }
    ).exec();
  }
}

export const registrationRepository = new RegistrationRepository();
