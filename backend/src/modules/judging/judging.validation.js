import Joi from 'joi';

const scoreItemSchema = Joi.object({
  criterionTitle: Joi.string().required(),
  score: Joi.number().min(0).required(),
  maxMarks: Joi.number().min(1).required(),
});

export const submitEvaluationSchema = Joi.object({
  submissionId: Joi.string().hex().length(24).required(),
  scores: Joi.array().items(scoreItemSchema).min(1).required(),
  feedback: Joi.string().allow(''),
  isFinalized: Joi.boolean().default(true),
});
