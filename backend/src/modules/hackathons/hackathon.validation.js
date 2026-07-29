import Joi from 'joi';

const judgingCriterionSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  maxMarks: Joi.number().min(1).max(100).default(10),
});

export const createHackathonSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().required(),
  theme: Joi.string().required(),
  mode: Joi.string().valid('ONLINE', 'OFFLINE', 'HYBRID').default('ONLINE'),
  venue: Joi.string().allow(''),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required().messages({
    'date.greater': 'End date must be after start date',
  }),
  registrationDeadline: Joi.date().iso().less(Joi.ref('startDate')).required().messages({
    'date.less': 'Registration deadline must be before start date',
  }),
  bannerImage: Joi.string().uri().allow(''),
  prizePool: Joi.string().allow(''),
  minTeamSize: Joi.number().min(1).default(1),
  maxTeamSize: Joi.number().min(Joi.ref('minTeamSize')).max(10).default(4),
  rules: Joi.array().items(Joi.string()).default([]),
  judgingCriteria: Joi.array().items(judgingCriterionSchema),
  pendingJudgeEmails: Joi.array().items(Joi.string().email()).default([]),
  status: Joi.string().valid('DRAFT', 'UPCOMING', 'REGISTRATION_OPEN', 'ONGOING', 'COMPLETED', 'CANCELLED').default('DRAFT'),
});

export const updateHackathonSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string(),
  theme: Joi.string(),
  mode: Joi.string().valid('ONLINE', 'OFFLINE', 'HYBRID'),
  venue: Joi.string().allow(''),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
  registrationDeadline: Joi.date().iso(),
  bannerImage: Joi.string().uri().allow(''),
  prizePool: Joi.string().allow(''),
  minTeamSize: Joi.number().min(1),
  maxTeamSize: Joi.number().max(10),
  rules: Joi.array().items(Joi.string()),
  judgingCriteria: Joi.array().items(judgingCriterionSchema),
  pendingJudgeEmails: Joi.array().items(Joi.string().email()),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      'DRAFT',
      'UPCOMING',
      'REGISTRATION_OPEN',
      'REGISTRATION_CLOSED',
      'ONGOING',
      'UNDER_EVALUATION',
      'COMPLETED',
      'CANCELLED'
    )
    .required(),
});

export const judgeAssignmentSchema = Joi.object({
  judgeUserId: Joi.string().hex().length(24).required().messages({
    'string.length': 'Invalid Judge User ObjectId',
  }),
});

export const hackathonQuerySchema = Joi.object({
  search: Joi.string().allow(''),
  mode: Joi.string().valid('ONLINE', 'OFFLINE', 'HYBRID'),
  theme: Joi.string().allow(''),
  status: Joi.string(),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
});
