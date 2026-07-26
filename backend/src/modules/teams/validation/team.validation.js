import Joi from 'joi';

export const createTeamSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  hackathonId: Joi.string().hex().length(24).required(),
});

export const joinTeamSchema = Joi.object({
  inviteCode: Joi.string().length(6).uppercase().required().messages({
    'string.length': 'Invite code must be exactly 6 alphanumeric characters',
  }),
});

export const removeMemberSchema = Joi.object({
  memberId: Joi.string().hex().length(24).required(),
});

export const transferLeadershipSchema = Joi.object({
  newLeaderId: Joi.string().hex().length(24).required(),
});
