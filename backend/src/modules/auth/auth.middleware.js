import jwt from 'jsonwebtoken';
import { config } from '../../config/env.config.js';
import { userRepository } from './auth.repository.js';
import { UnauthorizedError, ForbiddenError } from '../../common/errors/AppError.js';
import { asyncHandler } from '../../common/middlewares/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new UnauthorizedError('Authentication token is missing. Please log in.');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.secret);
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired authentication token.');
  }

  const user = await userRepository.findActiveById(decoded.id);
  if (!user) {
    throw new UnauthorizedError('User belonging to this token no longer exists or is blocked.');
  }

  req.user = user;
  next();
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ForbiddenError(`User role '${req.user?.role}' is not authorized to access this route`)
      );
    }
    next();
  };
};
