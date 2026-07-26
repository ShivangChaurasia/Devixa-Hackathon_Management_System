import Joi from 'joi';

export const registerSchema = Joi.object({
  hackathonId: Joi.string().hex().length(24).required().messages({
    'any.required': 'Hackathon ID is required',
    'string.length': 'Invalid Hackathon ObjectId',
  }),
});

export const updateRegistrationStatusSchema = Joi.object({
  status: Joi.string().valid('APPROVED', 'REJECTED').required(),
});
