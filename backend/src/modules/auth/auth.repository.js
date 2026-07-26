import { BaseRepository } from '../../common/repository/BaseRepository.js';
import { User, RefreshToken } from './auth.model.js';

export class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email, includePassword = false) {
    let query = this.model.findOne({ email, deletedAt: null });
    if (includePassword) query = query.select('+password');
    return await query.exec();
  }

  async findActiveById(id) {
    return await this.model.findOne({ _id: id, status: 'ACTIVE', deletedAt: null }).exec();
  }
}

export class RefreshTokenRepository extends BaseRepository {
  constructor() {
    super(RefreshToken);
  }

  async saveToken(userId, tokenHash, expiresAt) {
    return await this.create({ userId, tokenHash, expiresAt });
  }

  async findValidToken(tokenHash) {
    return await this.model.findOne({
      tokenHash,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    }).exec();
  }

  async revokeToken(tokenHash) {
    return await this.model.findOneAndUpdate(
      { tokenHash },
      { isRevoked: true },
      { new: true }
    ).exec();
  }

  async revokeAllUserTokens(userId) {
    return await this.model.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true }
    ).exec();
  }
}

export const userRepository = new UserRepository();
export const refreshTokenRepository = new RefreshTokenRepository();
