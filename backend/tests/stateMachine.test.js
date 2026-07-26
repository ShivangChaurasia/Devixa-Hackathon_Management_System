import { hackathonStateMachine, HACKATHON_STATES } from '../src/modules/hackathons/hackathon.stateMachine.js';

describe('HackathonStateMachine Domain Tests', () => {
  test('should allow valid forward transitions', () => {
    expect(
      hackathonStateMachine.validateTransition(HACKATHON_STATES.DRAFT, HACKATHON_STATES.REGISTRATION_OPEN)
    ).toBe(true);

    expect(
      hackathonStateMachine.validateTransition(HACKATHON_STATES.REGISTRATION_OPEN, HACKATHON_STATES.ONGOING)
    ).toBe(true);

    expect(
      hackathonStateMachine.validateTransition(HACKATHON_STATES.ONGOING, HACKATHON_STATES.UNDER_EVALUATION)
    ).toBe(true);

    expect(
      hackathonStateMachine.validateTransition(HACKATHON_STATES.UNDER_EVALUATION, HACKATHON_STATES.COMPLETED)
    ).toBe(true);
  });

  test('should throw error for invalid state transitions', () => {
    expect(() => {
      hackathonStateMachine.validateTransition(HACKATHON_STATES.DRAFT, HACKATHON_STATES.COMPLETED);
    }).toThrow();

    expect(() => {
      hackathonStateMachine.validateTransition(HACKATHON_STATES.COMPLETED, HACKATHON_STATES.DRAFT);
    }).toThrow();
  });

  test('should accurately check capability guards', () => {
    const draftHackathon = { status: HACKATHON_STATES.DRAFT };
    const openHackathon = {
      status: HACKATHON_STATES.REGISTRATION_OPEN,
      registrationDeadline: new Date(Date.now() + 86400000).toISOString(),
    };
    const completedHackathon = { status: HACKATHON_STATES.COMPLETED };

    expect(hackathonStateMachine.canEdit(draftHackathon)).toBe(true);
    expect(hackathonStateMachine.canEdit(completedHackathon)).toBe(false);

    expect(hackathonStateMachine.canRegister(openHackathon).allowed).toBe(true);
    expect(hackathonStateMachine.canRegister(draftHackathon).allowed).toBe(false);

    expect(hackathonStateMachine.canGenerateCertificates(completedHackathon)).toBe(true);
    expect(hackathonStateMachine.canGenerateCertificates(draftHackathon)).toBe(false);
  });
});
