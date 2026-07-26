import { registrationRepository } from '../repositories/registration.repository.js';
import { hackathonRepository } from '../../hackathons/hackathon.repository.js';
import { hackathonStateMachine } from '../../hackathons/hackathon.stateMachine.js';
import { ConflictError, NotFoundError, BadRequestError, ForbiddenError } from '../../../common/errors/AppError.js';

export class RegistrationService {
  async registerForHackathon(userId, hackathonId) {
    const hackathon = await hackathonRepository.findById(hackathonId);
    if (!hackathon) {
      throw new NotFoundError('Hackathon not found');
    }

    // State Machine Guard
    const canRegisterCheck = hackathonStateMachine.canRegister(hackathon);
    if (!canRegisterCheck.allowed) {
      throw new BadRequestError(canRegisterCheck.reason);
    }

    const existing = await registrationRepository.findByUserAndHackathon(userId, hackathonId);
    if (existing) {
      throw new ConflictError('You have already registered for this hackathon');
    }

    return await registrationRepository.create({
      hackathonId,
      userId,
      status: 'APPROVED', // Auto-approved for participant registration
    });
  }

  async cancelRegistration(userId, hackathonId) {
    const registration = await registrationRepository.findByUserAndHackathon(userId, hackathonId);
    if (!registration) {
      throw new NotFoundError('Registration not found for this hackathon');
    }

    return await registrationRepository.updateById(registration._id, { status: 'CANCELLED' });
  }

  async getUserRegistrations(userId) {
    return await registrationRepository.findUserRegistrations(userId);
  }

  async getHackathonRegistrations(hackathonId, user) {
    const hackathon = await hackathonRepository.findById(hackathonId);
    if (!hackathon) {
      throw new NotFoundError('Hackathon not found');
    }

    if (user.role !== 'ADMIN' && hackathon.organizerId.toString() !== user._id.toString()) {
      throw new ForbiddenError('You can only view registrations for hackathons created by you');
    }

    return await registrationRepository.findHackathonRegistrations(hackathonId);
  }

  async updateRegistrationStatus(registrationId, status, user) {
    const registration = await registrationRepository.findById(registrationId);
    if (!registration) {
      throw new NotFoundError('Registration not found');
    }

    const hackathon = await hackathonRepository.findById(registration.hackathonId);
    if (user.role !== 'ADMIN' && hackathon.organizerId.toString() !== user._id.toString()) {
      throw new ForbiddenError('You can only update registrations for hackathons created by you');
    }

    return await registrationRepository.updateById(registrationId, { status });
  }
}

export const registrationService = new RegistrationService();
