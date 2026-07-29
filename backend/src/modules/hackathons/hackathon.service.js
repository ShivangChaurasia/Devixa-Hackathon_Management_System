import { hackathonRepository } from './hackathon.repository.js';
import { hackathonStateMachine } from './hackathon.stateMachine.js';
import { userRepository } from '../auth/auth.repository.js';
import { registrationRepository } from '../teams/repositories/registration.repository.js';
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
    const count = await registrationRepository.model.countDocuments({ 
      hackathonId: id, 
      status: { $ne: 'CANCELLED' } 
    });
    const hackObj = hackathon.toObject ? hackathon.toObject() : hackathon;
    hackObj.participantsCount = count;
    return hackObj;
  }

  async listHackathons(queryParams) {
    const result = await hackathonRepository.findWithFilters({}, queryParams);
    const items = await Promise.all(result.items.map(async (h) => {
      const count = await registrationRepository.model.countDocuments({ 
        hackathonId: h._id, 
        status: { $ne: 'CANCELLED' } 
      });
      const hObj = h.toObject ? h.toObject() : h;
      hObj.participantsCount = count;
      return hObj;
    }));
    return { ...result, items };
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

  async getPendingInvites(email) {
    const invites = await hackathonRepository.model.find({ 
      pendingJudgeEmails: email, 
      deletedAt: null 
    }).populate('organizerId', 'name organization').exec();
    return invites;
  }

  async acceptJudgeInvite(id, user) {
    const hackathon = await hackathonRepository.findById(id);
    if (!hackathon) throw new NotFoundError('Hackathon not found');
    if (!hackathon.pendingJudgeEmails.includes(user.email)) {
      throw new ForbiddenError('You do not have a pending invite for this hackathon');
    }

    const updated = await hackathonRepository.model.findByIdAndUpdate(
      id,
      { 
        $pull: { pendingJudgeEmails: user.email },
        $addToSet: { judges: user._id }
      },
      { new: true }
    );
    return updated;
  }

  async declineJudgeInvite(id, user) {
    const hackathon = await hackathonRepository.findById(id);
    if (!hackathon) throw new NotFoundError('Hackathon not found');
    if (!hackathon.pendingJudgeEmails.includes(user.email)) {
      throw new ForbiddenError('You do not have a pending invite for this hackathon');
    }

    const updated = await hackathonRepository.model.findByIdAndUpdate(
      id,
      { $pull: { pendingJudgeEmails: user.email } },
      { new: true }
    );
    return updated;
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
