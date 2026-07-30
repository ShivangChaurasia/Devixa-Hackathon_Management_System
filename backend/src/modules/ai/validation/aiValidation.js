import Joi from 'joi';

export const codeReviewSchema = Joi.object({
  code: Joi.string().required().messages({
    'any.required': 'Code snippet or file content is required for review',
  }),
  language: Joi.string().default('JavaScript'),
  description: Joi.string().allow(''),
});

export const readmeSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  features: Joi.array().items(Joi.string()).default([]),
  techStack: Joi.array().items(Joi.string()).default([]),
  repoUrl: Joi.string().uri().allow(''),
});

export const analyzeSubmissionSchema = Joi.object({
  problemStatement: Joi.string().required(),
  projectSummary: Joi.string().required(),
  githubUrl: Joi.string().uri().allow(''),
  liveDemoUrl: Joi.string().uri().allow(''),
});

export const summarizeSchema = Joi.object({
  text: Joi.string().min(10).required(),
});

export const chatSchema = Joi.object({
  message: Joi.string().required(),
});
