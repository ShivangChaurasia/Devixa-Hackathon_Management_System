import crypto from 'crypto';
import { teamRepository } from '../repositories/team.repository.js';
import { registrationRepository } from '../repositories/registration.repository.js';
import { hackathonRepository } from '../../hackathons/hackathon.repository.js';
import { hackathonStateMachine } from '../../hackathons/hackathon.stateMachine.js';
import { notificationService } from '../../notifications/notification.service.js';
import { ConflictError, NotFoundError, BadRequestError, ForbiddenError } from '../../../common/errors/AppError.js';

export class TeamService {
  generateInviteCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
  }

  async createTeam({ name, hackathonId }, leaderId) {
    const hackathon = await hackathonRepository.findById(hackathonId);
    if (!hackathon) {
      throw new NotFoundError('Hackathon not found');
    }

    const canRegisterCheck = hackathonStateMachine.canRegister(hackathon);
    if (!canRegisterCheck.allowed) {
      throw new BadRequestError(`Cannot create team: ${canRegisterCheck.reason}`);
    }

    const registration = await registrationRepository.findByUserAndHackathon(leaderId, hackathonId);
    if (!registration || registration.status !== 'APPROVED') {
      throw new BadRequestError('You must register for the hackathon before creating a team');
    }

    const existingTeam = await teamRepository.findUserTeamInHackathon(leaderId, hackathonId);
    if (existingTeam) {
      throw new ConflictError('You already belong to a team in this hackathon');
    }

    const inviteCode = this.generateInviteCode();

    const team = await teamRepository.create({
      name,
      inviteCode,
      hackathonId,
      leaderId,
      members: [leaderId],
    });

    await registrationRepository.updateTeamReference(leaderId, hackathonId, team._id);

    await notificationService.sendNotification({
      userId: leaderId,
      title: 'Team Created',
      message: `Team '${team.name}' created successfully. Share invite code: ${team.inviteCode}`,
      type: 'TEAM_INVITE',
    });

    return team;
  }

  async joinTeam(inviteCode, userId) {
    const team = await teamRepository.findByInviteCode(inviteCode);
    if (!team) {
      throw new NotFoundError('Invalid team invite code');
    }

    const hackathon = team.hackathonId;
    const canRegisterCheck = hackathonStateMachine.canRegister(hackathon);
    if (!canRegisterCheck.allowed) {
      throw new BadRequestError(`Cannot join team: ${canRegisterCheck.reason}`);
    }

    if (team.members.length >= hackathon.maxTeamSize) {
      throw new BadRequestError(`Team has reached maximum allowed capacity of ${hackathon.maxTeamSize} members`);
    }

    const registration = await registrationRepository.findByUserAndHackathon(userId, hackathon._id);
    if (!registration || registration.status !== 'APPROVED') {
      throw new BadRequestError('You must register for the hackathon before joining a team');
    }

    const existingTeam = await teamRepository.findUserTeamInHackathon(userId, hackathon._id);
    if (existingTeam) {
      throw new ConflictError('You already belong to a team in this hackathon');
    }

    const updatedTeam = await teamRepository.addMember(team._id, userId);
    await registrationRepository.updateTeamReference(userId, hackathon._id, team._id);

    // Send notifications to Leader & Member
    await notificationService.sendNotification({
      userId: team.leaderId,
      title: 'New Member Joined',
      message: `A new member joined your team '${team.name}'.`,
      type: 'TEAM_INVITE',
    });

    await notificationService.sendNotification({
      userId,
      title: 'Joined Team',
      message: `You successfully joined team '${team.name}'.`,
      type: 'TEAM_INVITE',
    });

    return updatedTeam;
  }

  async getTeamById(id) {
    const team = await teamRepository.findByIdPopulated(id);
    if (!team) {
      throw new NotFoundError('Team not found');
    }
    return team;
  }

  async listHackathonTeams(hackathonId) {
    return await teamRepository.findHackathonTeams(hackathonId);
  }

  async leaveTeam(teamId, userId) {
    const team = await teamRepository.findById(teamId);
    if (!team) {
      throw new NotFoundError('Team not found');
    }

    if (team.leaderId.toString() === userId.toString()) {
      throw new BadRequestError('Team leader cannot leave the team. You must transfer leadership or disband the team.');
    }

    const updatedTeam = await teamRepository.removeMember(teamId, userId);
    await registrationRepository.updateTeamReference(userId, team.hackathonId, null);

    await notificationService.sendNotification({
      userId: team.leaderId,
      title: 'Member Left Team',
      message: `A member left your team '${team.name}'.`,
      type: 'TEAM_INVITE',
    });

    return updatedTeam;
  }

  async removeMember(teamId, memberIdToRemove, currentUserId) {
    const team = await teamRepository.findById(teamId);
    if (!team) {
      throw new NotFoundError('Team not found');
    }

    if (team.leaderId.toString() !== currentUserId.toString()) {
      throw new ForbiddenError('Only the team leader can remove members');
    }

    if (memberIdToRemove === currentUserId.toString()) {
      throw new BadRequestError('Leader cannot remove themselves');
    }

    const updatedTeam = await teamRepository.removeMember(teamId, memberIdToRemove);
    await registrationRepository.updateTeamReference(memberIdToRemove, team.hackathonId, null);

    await notificationService.sendNotification({
      userId: memberIdToRemove,
      title: 'Removed from Team',
      message: `You were removed from team '${team.name}'.`,
      type: 'TEAM_INVITE',
    });

    return updatedTeam;
  }

  async transferLeadership(teamId, newLeaderId, currentUserId) {
    const team = await teamRepository.findById(teamId);
    if (!team) {
      throw new NotFoundError('Team not found');
    }

    if (team.leaderId.toString() !== currentUserId.toString()) {
      throw new ForbiddenError('Only the team leader can transfer leadership');
    }

    const isMember = team.members.some((m) => m.toString() === newLeaderId.toString());
    if (!isMember) {
      throw new BadRequestError('New leader must be an existing member of the team');
    }

    const updated = await teamRepository.updateLeader(teamId, newLeaderId);

    await notificationService.sendNotification({
      userId: newLeaderId,
      title: 'Promoted to Team Leader',
      message: `You are now the leader of team '${team.name}'.`,
      type: 'TEAM_INVITE',
    });

    return updated;
  }

  async deleteTeam(teamId, currentUserId) {
    const team = await teamRepository.findById(teamId);
    if (!team) {
      throw new NotFoundError('Team not found');
    }

    if (team.leaderId.toString() !== currentUserId.toString()) {
      throw new ForbiddenError('Only the team leader can disband the team');
    }

    for (const memberId of team.members) {
      await registrationRepository.updateTeamReference(memberId, team.hackathonId, null);
      await notificationService.sendNotification({
        userId: memberId,
        title: 'Team Disbanded',
        message: `Team '${team.name}' was disbanded by the leader.`,
        type: 'TEAM_INVITE',
      });
    }

    return await teamRepository.softDelete(teamId);
  }

  async getUserTeams(userId) {
    return await teamRepository.model
      .find({ members: userId, deletedAt: null })
      .populate('hackathonId')
      .populate('members', 'name email avatar')
      .exec();
  }
}

export const teamService = new TeamService();
