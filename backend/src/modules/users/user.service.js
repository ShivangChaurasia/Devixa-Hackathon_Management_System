import { User } from '../auth/auth.model.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../common/errors/AppError.js';

class UserService {
  async checkUsernameAvailability(username) {
    if (!username || !/^[a-z0-9_]{4,20}$/.test(username)) {
      return false;
    }
    const user = await User.findOne({ username });
    return !user;
  }

  async saveOnboarding(userId, data) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.isOnboarded) {
      throw new BadRequestError('User is already onboarded');
    }

    // Check username uniqueness if provided
    if (data.username) {
      const existingUser = await User.findOne({ username: data.username, _id: { $ne: userId } });
      if (existingUser) {
        throw new ConflictError('Username is already taken');
      }
      user.username = data.username;
    }

    user.name = data.name || user.name;
    user.role = data.role || user.role;
    user.phone = data.phone || user.phone;
    user.githubUrl = data.githubUrl || user.githubUrl;
    
    if (data.password && user.provider === 'GOOGLE' && !user.passwordCreated) {
      user.password = data.password;
      user.passwordCreated = true;
    }

    user.isOnboarded = true;
    
    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return userResponse;
  }

  async getPublicProfile(username) {
    const user = await User.findOne({ username }).select('name username role bio avatar githubUrl linkedinUrl socialLinks createdAt skills');
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async searchUsers(query, limit = 10, skip = 0) {
    if (!query) return { users: [], total: 0 };
    
    const searchRegex = new RegExp(query, 'i');
    const filter = {
      $or: [
        { name: searchRegex },
        { username: searchRegex }
      ],
      isOnboarded: true,
      status: 'ACTIVE'
    };

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('name username role avatar bio')
        .limit(limit)
        .skip(skip)
        .lean(),
      User.countDocuments(filter)
    ]);

    return { users, total };
  }

  async getTheme(userId) {
    const user = await User.findById(userId).select('theme');
    if (!user) throw new NotFoundError('User not found');
    return user.theme || 'system';
  }

  async updateTheme(userId, theme) {
    const user = await User.findByIdAndUpdate(userId, { theme }, { new: true }).select('theme');
    if (!user) throw new NotFoundError('User not found');
    return user.theme;
  }
}

export const userService = new UserService();
