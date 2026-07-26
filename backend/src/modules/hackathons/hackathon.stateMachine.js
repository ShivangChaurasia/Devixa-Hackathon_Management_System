import { BadRequestError } from '../../common/errors/AppError.js';

export const HACKATHON_STATES = {
  DRAFT: 'DRAFT',
  UPCOMING: 'UPCOMING',
  REGISTRATION_OPEN: 'REGISTRATION_OPEN',
  REGISTRATION_CLOSED: 'REGISTRATION_CLOSED',
  ONGOING: 'ONGOING',
  UNDER_EVALUATION: 'UNDER_EVALUATION',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

class HackathonStateMachine {
  constructor() {
    // Valid forward transitions
    this.allowedTransitions = {
      [HACKATHON_STATES.DRAFT]: [HACKATHON_STATES.UPCOMING, HACKATHON_STATES.REGISTRATION_OPEN, HACKATHON_STATES.CANCELLED],
      [HACKATHON_STATES.UPCOMING]: [HACKATHON_STATES.REGISTRATION_OPEN, HACKATHON_STATES.CANCELLED],
      [HACKATHON_STATES.REGISTRATION_OPEN]: [HACKATHON_STATES.REGISTRATION_CLOSED, HACKATHON_STATES.ONGOING, HACKATHON_STATES.CANCELLED],
      [HACKATHON_STATES.REGISTRATION_CLOSED]: [HACKATHON_STATES.ONGOING, HACKATHON_STATES.CANCELLED],
      [HACKATHON_STATES.ONGOING]: [HACKATHON_STATES.UNDER_EVALUATION, HACKATHON_STATES.CANCELLED],
      [HACKATHON_STATES.UNDER_EVALUATION]: [HACKATHON_STATES.COMPLETED, HACKATHON_STATES.CANCELLED],
      [HACKATHON_STATES.COMPLETED]: [],
      [HACKATHON_STATES.CANCELLED]: [],
    };
  }

  /**
   * Validates state transition
   */
  validateTransition(currentStatus, targetStatus) {
    if (currentStatus === targetStatus) return true;

    const allowed = this.allowedTransitions[currentStatus] || [];
    if (!allowed.includes(targetStatus)) {
      throw new BadRequestError(
        `Invalid status transition from '${currentStatus}' to '${targetStatus}'. Allowed transitions: [${allowed.join(', ')}]`
      );
    }
    return true;
  }

  // Capability Guards
  canEdit(hackathon) {
    return [HACKATHON_STATES.DRAFT, HACKATHON_STATES.UPCOMING, HACKATHON_STATES.REGISTRATION_OPEN].includes(hackathon.status);
  }

  canRegister(hackathon) {
    if (hackathon.status !== HACKATHON_STATES.REGISTRATION_OPEN) {
      return { allowed: false, reason: `Registration is currently '${hackathon.status}'` };
    }
    if (new Date() > new Date(hackathon.registrationDeadline)) {
      return { allowed: false, reason: 'Registration deadline has passed' };
    }
    return { allowed: true };
  }

  canSubmit(hackathon) {
    if (hackathon.status !== HACKATHON_STATES.ONGOING) {
      return { allowed: false, reason: `Project submissions are not open. Current status: '${hackathon.status}'` };
    }
    const now = new Date();
    if (now < new Date(hackathon.startDate)) {
      return { allowed: false, reason: 'Hackathon coding phase has not started yet' };
    }
    if (now > new Date(hackathon.endDate)) {
      return { allowed: false, reason: 'Hackathon submission deadline has passed' };
    }
    return { allowed: true };
  }

  canEvaluate(hackathon) {
    return hackathon.status === HACKATHON_STATES.UNDER_EVALUATION;
  }

  canDeclareResults(hackathon) {
    return hackathon.status === HACKATHON_STATES.UNDER_EVALUATION;
  }

  canGenerateCertificates(hackathon) {
    return hackathon.status === HACKATHON_STATES.COMPLETED;
  }
}

export const hackathonStateMachine = new HackathonStateMachine();
