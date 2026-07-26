import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { userRepository, refreshTokenRepository } from './auth.repository.js';
import { config } from '../../config/env.config.js';
import {
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} from '../../common/errors/AppError.js';

export class AuthService {
  generateTokens(user) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    const refreshToken = jwt.sign({ id: user._id }, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async register(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('A user with this email address already exists');
    }

    if (userData.role === 'ADMIN') {
      throw new ForbiddenError('ADMIN accounts cannot be created via public registration');
    }

    const user = await userRepository.create(userData);

    const tokens = this.generateTokens(user);
    const tokenHash = this.hashToken(tokens.refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await refreshTokenRepository.saveToken(user._id, tokenHash, expiresAt);

    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, tokens };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status === 'BLOCKED') {
      throw new ForbiddenError('Your account has been suspended by an administrator');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = this.generateTokens(user);
    const tokenHash = this.hashToken(tokens.refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await refreshTokenRepository.saveToken(user._id, tokenHash, expiresAt);

    const userResponse = user.toObject();
    delete userResponse.password;

    return { user: userResponse, tokens };
  }

  async refreshTokens(refreshToken) {
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const tokenHash = this.hashToken(refreshToken);
    const storedToken = await refreshTokenRepository.findValidToken(tokenHash);

    if (!storedToken) {
      throw new UnauthorizedError('Refresh token is revoked or invalid');
    }

    const user = await userRepository.findActiveById(decoded.id);
    if (!user) {
      throw new UnauthorizedError('User account is invalid or deactivated');
    }

    // Revoke old token and issue new token pair (Token Rotation)
    await refreshTokenRepository.revokeToken(tokenHash);

    const tokens = this.generateTokens(user);
    const newTokenHash = this.hashToken(tokens.refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await refreshTokenRepository.saveToken(user._id, newTokenHash, expiresAt);

    return tokens;
  }

  async logout(refreshToken) {
    if (refreshToken) {
      const tokenHash = this.hashToken(refreshToken);
      await refreshTokenRepository.revokeToken(tokenHash);
    }
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    const user = await userRepository.updateById(userId, updateData);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }
    return user;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findByEmail((await userRepository.findById(userId)).email, true);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new BadRequestError('Current password provided is incorrect');
    }

    user.password = newPassword;
    await user.save();

    await refreshTokenRepository.revokeAllUserTokens(userId);
  }
}

export const authService = new AuthService();
