import { User } from '../auth/auth.model.js';
import { Hackathon } from '../hackathons/hackathon.model.js';
import { Registration } from '../teams/models/registration.model.js';
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
    const user = await User.findOne({ username }).select('name username email role bio avatar githubUrl linkedinUrl socialLinks createdAt skills');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const userObj = user.toObject();
    let stats = {};
    let activityList = [];

    if (user.role === 'PARTICIPANT') {
      const regs = await Registration.find({ userId: user._id, deletedAt: null })
        .populate('hackathonId', 'title bannerImage status startDate endDate')
        .lean();
      stats = {
        hackathonsParticipated: regs.length,
        approvedRegistrations: regs.filter(r => r.status === 'APPROVED').length,
      };
      activityList = regs.map(r => r.hackathonId).filter(Boolean);
    } else if (user.role === 'ORGANIZER') {
      const hackathons = await Hackathon.find({ organizerId: user._id, deletedAt: null })
        .select('title bannerImage status startDate endDate mode')
        .lean();
      const totalParticipants = await Registration.countDocuments({
        hackathonId: { $in: hackathons.map(h => h._id) },
        deletedAt: null
      });
      stats = {
        hackathonsOrganized: hackathons.length,
        totalParticipantsHosted: totalParticipants,
      };
      activityList = hackathons;
    } else if (user.role === 'JUDGE') {
      const hackathons = await Hackathon.find({ judges: user._id, deletedAt: null })
        .select('title bannerImage status startDate endDate mode')
        .lean();
      stats = {
        hackathonsJudged: hackathons.length,
      };
      activityList = hackathons;
    }

    return { ...userObj, stats, activityList };
  }

  async searchUsers(query, role = null, limit = 10, skip = 0) {
    if (!query && !role) return { users: [], total: 0 };
    
    const filter = {
      isOnboarded: true,
      status: 'ACTIVE'
    };

    if (query) {
      const searchRegex = new RegExp(query, 'i');
      filter.$or = [
        { name: searchRegex },
        { username: searchRegex },
        { email: searchRegex }
      ];
    }

    if (role) {
      filter.role = role.toUpperCase();
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('name username email role avatar bio skills')
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
