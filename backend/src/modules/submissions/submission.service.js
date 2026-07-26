import { submissionRepository } from './submission.repository.js';
import { teamRepository } from '../teams/repositories/team.repository.js';
import { hackathonRepository } from '../hackathons/hackathon.repository.js';
import { hackathonStateMachine } from '../hackathons/hackathon.stateMachine.js';
import { NotFoundError, BadRequestError, ForbiddenError, ConflictError } from '../../common/errors/AppError.js';

export class SubmissionService {
  async createSubmission(data, userId) {
    const { hackathonId } = data;

    const hackathon = await hackathonRepository.findById(hackathonId);
    if (!hackathon) {
      throw new NotFoundError('Hackathon not found');
    }

    // State Machine Guard
    const canSubmitCheck = hackathonStateMachine.canSubmit(hackathon);
    if (!canSubmitCheck.allowed) {
      throw new BadRequestError(canSubmitCheck.reason);
    }

    // Locate user's team in hackathon
    const team = await teamRepository.findUserTeamInHackathon(userId, hackathonId);
    if (!team) {
      throw new BadRequestError('You must be a member of a team to submit a project');
    }

    // Check if team already submitted
    const existing = await submissionRepository.findByTeamAndHackathon(team._id, hackathonId);
    if (existing) {
      throw new ConflictError('Your team has already submitted a project for this hackathon. Use update submission instead.');
    }

    return await submissionRepository.create({
      ...data,
      teamId: team._id,
      submittedBy: userId,
    });
  }

  async getSubmissionById(id) {
    const submission = await submissionRepository.findByIdPopulated(id);
    if (!submission) {
      throw new NotFoundError('Submission not found');
    }
    return submission;
  }

  async getHackathonSubmissions(hackathonId, user) {
    const hackathon = await hackathonRepository.findById(hackathonId);
    if (!hackathon) {
      throw new NotFoundError('Hackathon not found');
    }

    // Judges, Organizers, Admins can view hackathon submissions
    const isJudgeAssigned = hackathon.judges.some((j) => j.toString() === user._id.toString());
    const isOrganizer = hackathon.organizerId.toString() === user._id.toString();

    if (user.role !== 'ADMIN' && !isOrganizer && !isJudgeAssigned) {
      throw new ForbiddenError('You are not authorized to view submissions for this hackathon');
    }

    return await submissionRepository.findHackathonSubmissions(hackathonId);
  }

  async updateSubmission(id, updateData, userId) {
    const submission = await submissionRepository.findById(id);
    if (!submission) {
      throw new NotFoundError('Submission not found');
    }

    const hackathon = await hackathonRepository.findById(submission.hackathonId);
    const canSubmitCheck = hackathonStateMachine.canSubmit(hackathon);
    if (!canSubmitCheck.allowed) {
      throw new BadRequestError(`Cannot edit submission after deadline: ${canSubmitCheck.reason}`);
    }

    // Check team membership
    const team = await teamRepository.findById(submission.teamId);
    const isMember = team.members.some((m) => m.toString() === userId.toString());
    if (!isMember) {
      throw new ForbiddenError('Only team members can edit project submissions');
    }

    return await submissionRepository.updateById(id, updateData);
  }

  async updateStatus(id, status, user) {
    const submission = await submissionRepository.findById(id);
    if (!submission) {
      throw new NotFoundError('Submission not found');
    }

    const hackathon = await hackathonRepository.findById(submission.hackathonId);
    if (user.role !== 'ADMIN' && hackathon.organizerId.toString() !== user._id.toString()) {
      throw new ForbiddenError('Only the hackathon organizer or admin can update submission status');
    }

    return await submissionRepository.updateById(id, { status });
  }
}

export const submissionService = new SubmissionService();
