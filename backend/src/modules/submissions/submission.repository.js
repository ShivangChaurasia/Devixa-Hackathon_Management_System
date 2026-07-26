import { BaseRepository } from '../../common/repository/BaseRepository.js';
import { Submission } from './submission.model.js';

export class SubmissionRepository extends BaseRepository {
  constructor() {
    super(Submission);
  }

  async findByTeamAndHackathon(teamId, hackathonId) {
    return await this.model.findOne({ teamId, hackathonId, deletedAt: null }).exec();
  }

  async findByIdPopulated(id) {
    return await this.model
      .findOne({ _id: id, deletedAt: null })
      .populate('submittedBy', 'name email avatar')
      .populate('teamId', 'name inviteCode members leaderId')
      .populate('hackathonId', 'title judgingCriteria status')
      .exec();
  }

  async findHackathonSubmissions(hackathonId) {
    return await this.model
      .find({ hackathonId, deletedAt: null })
      .populate('submittedBy', 'name email avatar')
      .populate('teamId', 'name members')
      .sort({ createdAt: -1 })
      .exec();
  }
}

export const submissionRepository = new SubmissionRepository();
