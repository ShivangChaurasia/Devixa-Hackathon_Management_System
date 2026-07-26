import { judgingRepository } from './judging.repository.js';
import { submissionRepository } from '../submissions/submission.repository.js';
import { hackathonRepository } from '../hackathons/hackathon.repository.js';
import { hackathonStateMachine } from '../hackathons/hackathon.stateMachine.js';
import { notificationService } from '../notifications/notification.service.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../common/errors/AppError.js';

export class JudgingService {
  async submitEvaluation({ submissionId, scores, feedback, isFinalized }, judgeUser) {
    const submission = await submissionRepository.findById(submissionId);
    if (!submission) {
      throw new NotFoundError('Submission not found');
    }

    const hackathon = await hackathonRepository.findById(submission.hackathonId);
    if (!hackathon) {
      throw new NotFoundError('Associated hackathon not found');
    }

    // State Machine Guard
    if (!hackathonStateMachine.canEvaluate(hackathon)) {
      throw new BadRequestError(`Judging is not active for this hackathon. Current status: '${hackathon.status}'`);
    }

    // Verify judge assignment
    const isAssigned = hackathon.judges.some((j) => j.toString() === judgeUser._id.toString());
    if (judgeUser.role !== 'ADMIN' && !isAssigned) {
      throw new ForbiddenError('You are not assigned as a judge for this hackathon');
    }

    // Calculate total score & validate bounds against hackathon criteria
    let totalScore = 0;
    for (const item of scores) {
      const matchCriteria = hackathon.judgingCriteria.find((c) => c.title === item.criterionTitle);
      const maxMarks = matchCriteria ? matchCriteria.maxMarks : item.maxMarks;

      if (item.score > maxMarks) {
        throw new BadRequestError(`Score for '${item.criterionTitle}' (${item.score}) exceeds maximum allowed marks (${maxMarks})`);
      }
      totalScore += item.score;
    }

    const existingReview = await judgingRepository.findByJudgeAndSubmission(judgeUser._id, submissionId);

    let review;
    if (existingReview) {
      if (existingReview.isFinalized && judgeUser.role !== 'ADMIN') {
        throw new BadRequestError('You have already finalized your evaluation for this submission.');
      }

      review = await judgingRepository.updateById(existingReview._id, {
        scores,
        totalScore,
        feedback,
        isFinalized,
      });
    } else {
      review = await judgingRepository.create({
        submissionId,
        hackathonId: hackathon._id,
        judgeId: judgeUser._id,
        scores,
        totalScore,
        feedback,
        isFinalized,
      });
    }

    if (isFinalized) {
      // Notify organizer
      await notificationService.sendNotification({
        userId: hackathon.organizerId,
        title: 'New Project Evaluation',
        message: `Judge ${judgeUser.name} submitted an evaluation for '${submission.projectName}'. Total score: ${totalScore}`,
        type: 'JUDGING',
      });
    }

    return review;
  }

  async getAssignedProjects(judgeUser) {
    const hackathons = await hackathonRepository.find({ judges: judgeUser._id });
    const hackathonIds = hackathons.map((h) => h._id);

    return await submissionRepository.find({
      hackathonId: { $in: hackathonIds },
    });
  }

  async getSubmissionReviews(submissionId, user) {
    const submission = await submissionRepository.findById(submissionId);
    if (!submission) {
      throw new NotFoundError('Submission not found');
    }

    const hackathon = await hackathonRepository.findById(submission.hackathonId);
    const isOrganizer = hackathon.organizerId.toString() === user._id.toString();

    if (user.role !== 'ADMIN' && !isOrganizer) {
      throw new ForbiddenError('Only hackathon organizers and admins can view all judges reviews');
    }

    return await judgingRepository.findSubmissionReviews(submissionId);
  }
}

export const judgingService = new JudgingService();
