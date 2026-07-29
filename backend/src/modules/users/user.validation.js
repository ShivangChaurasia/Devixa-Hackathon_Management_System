import Joi from 'joi';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const onboardingSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid('PARTICIPANT', 'ORGANIZER', 'JUDGE').required(),
  phone: Joi.string().allow(''),
  githubUrl: Joi.string().uri().allow(''),
  username: Joi.string().pattern(/^[a-z0-9_]{4,20}$/).required().messages({
    'string.pattern.base': 'Username must be 4-20 characters long and can only contain lowercase letters, numbers, and underscores',
  }),
  password: Joi.string().pattern(passwordPattern).optional().messages({
    'string.pattern.base': 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  }),
});

export const updateThemeSchema = Joi.object({
  theme: Joi.string().valid('light', 'dark', 'system').required(),
});
