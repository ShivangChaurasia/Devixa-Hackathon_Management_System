import Joi from 'joi';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().pattern(passwordPattern).required().messages({
    'string.pattern.base': 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    'any.required': 'Password is required',
  }),
  role: Joi.string().valid('PARTICIPANT', 'ORGANIZER', 'JUDGE').default('PARTICIPANT'),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required',
  }),
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  bio: Joi.string().max(500).allow(''),
  skills: Joi.array().items(Joi.string()),
  githubUrl: Joi.string().uri().allow(''),
  linkedinUrl: Joi.string().uri().allow(''),
  avatar: Joi.string().uri().allow(''),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().pattern(passwordPattern).required().messages({
    'string.pattern.base': 'New password must meet complexity requirements',
  }),
});
