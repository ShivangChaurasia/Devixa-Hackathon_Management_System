import Joi from 'joi';

export const createSubmissionSchema = Joi.object({
  hackathonId: Joi.string().hex().length(24).required(),
  projectName: Joi.string().min(2).max(100).required(),
  problemStatement: Joi.string().required(),
  solution: Joi.string().required(),
  description: Joi.string().required(),
  githubUrl: Joi.string().uri().required().messages({
    'string.uri': 'GitHub URL must be a valid URI',
    'any.required': 'GitHub Repository URL is required',
  }),
  liveDemoUrl: Joi.string().uri().allow(''),
  techStack: Joi.array().items(Joi.string()).min(1).required(),
  screenshots: Joi.array().items(Joi.string().uri()).default([]),
  presentationPdf: Joi.string().uri().allow(''),
  demoVideoLink: Joi.string().uri().allow(''),
});

export const updateSubmissionSchema = Joi.object({
  projectName: Joi.string().min(2).max(100),
  problemStatement: Joi.string(),
  solution: Joi.string(),
  description: Joi.string(),
  githubUrl: Joi.string().uri(),
  liveDemoUrl: Joi.string().uri().allow(''),
  techStack: Joi.array().items(Joi.string()),
  screenshots: Joi.array().items(Joi.string().uri()),
  presentationPdf: Joi.string().uri().allow(''),
  demoVideoLink: Joi.string().uri().allow(''),
});

export const updateSubmissionStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED').required(),
});
