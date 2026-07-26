import { BaseRepository } from '../../common/repository/BaseRepository.js';
import { Review } from './judging.model.js';

export class JudgingRepository extends BaseRepository {
  constructor() {
    super(Review);
  }

  async findByJudgeAndSubmission(judgeId, submissionId) {
    return await this.model.findOne({ judgeId, submissionId, deletedAt: null }).exec();
  }

  async findSubmissionReviews(submissionId) {
    return await this.model
      .find({ submissionId, deletedAt: null })
      .populate('judgeId', 'name email avatar')
      .exec();
  }

  async findHackathonReviews(hackathonId) {
    return await this.model
      .find({ hackathonId, deletedAt: null })
      .populate('judgeId', 'name email avatar')
      .populate('submissionId', 'projectName teamId')
      .exec();
  }
}

export const judgingRepository = new JudgingRepository();
