import { hackathonRepository } from './hackathon.repository.js';
import { hackathonStateMachine } from './hackathon.stateMachine.js';
import { userRepository } from '../auth/auth.repository.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../common/errors/AppError.js';

export class HackathonService {
  async createHackathon(data, organizerId) {
    const payload = {
      ...data,
      organizerId,
      slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    };
    return await hackathonRepository.create(payload);
  }

  async getHackathonById(id) {
    const hackathon = await hackathonRepository.findByIdPopulated(id);
    if (!hackathon) {
      throw new NotFoundError('Hackathon not found');
    }
    return hackathon;
  }

  async listHackathons(queryParams) {
    return await hackathonRepository.findWithFilters({}, queryParams);
  }

  async updateHackathon(id, updateData, user) {
    const hackathon = await hackathonRepository.findById(id);
    if (!hackathon) {
      throw new NotFoundError('Hackathon not found');
    }

    // Ownership Guard
    if (user.role !== 'ADMIN' && hackathon.organizerId.toString() !== user._id.toString()) {
      throw new ForbiddenError('You can only edit hackathons created by you');
    }

    // State Machine Guard
    if (!hackathonStateMachine.canEdit(hackathon)) {
      throw new BadRequestError(`Cannot edit hackathon details while in state '${hackathon.status}'`);
    }

    return await hackathonRepository.updateById(id, updateData);
  }

  async transitionStatus(id, newStatus, user) {
    const hackathon = await hackathonRepository.findById(id);
    if (!hackathon) {
      throw new NotFoundError('Hackathon not found');
    }

    if (user.role !== 'ADMIN' && hackathon.organizerId.toString() !== user._id.toString()) {
      throw new ForbiddenError('You can only manage status for your own hackathons');
    }

    // Validate Transition through State Machine
    hackathonStateMachine.validateTransition(hackathon.status, newStatus);

    return await hackathonRepository.updateById(id, { status: newStatus });
  }

  async assignJudge(id, judgeUserId, user) {
    const hackathon = await hackathonRepository.findById(id);
    if (!hackathon) {
      throw new NotFoundError('Hackathon not found');
    }

    if (user.role !== 'ADMIN' && hackathon.organizerId.toString() !== user._id.toString()) {
      throw new ForbiddenError('You can only assign judges to your own hackathons');
    }

    const judgeUser = await userRepository.findById(judgeUserId);
    if (!judgeUser || judgeUser.role !== 'JUDGE') {
      throw new BadRequestError('User specified does not exist or does not have the JUDGE role');
    }

    return await hackathonRepository.addJudge(id, judgeUserId);
  }

  async removeJudge(id, judgeUserId, user) {
    const hackathon = await hackathonRepository.findById(id);
    if (!hackathon) {
      throw new NotFoundError('Hackathon not found');
    }

    if (user.role !== 'ADMIN' && hackathon.organizerId.toString() !== user._id.toString()) {
      throw new ForbiddenError('You can only manage judges for your own hackathons');
    }

    return await hackathonRepository.removeJudge(id, judgeUserId);
  }

  async deleteHackathon(id, user) {
    const hackathon = await hackathonRepository.findById(id);
    if (!hackathon) {
      throw new NotFoundError('Hackathon not found');
    }

    if (user.role !== 'ADMIN' && hackathon.organizerId.toString() !== user._id.toString()) {
      throw new ForbiddenError('You can only delete hackathons created by you');
    }

    return await hackathonRepository.softDelete(id);
  }
}

export const hackathonService = new HackathonService();
