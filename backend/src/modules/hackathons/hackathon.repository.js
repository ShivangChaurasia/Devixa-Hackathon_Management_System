import { BaseRepository } from '../../common/repository/BaseRepository.js';
import { Hackathon } from './hackathon.model.js';

export class HackathonRepository extends BaseRepository {
  constructor() {
    super(Hackathon);
  }

  async findWithFilters(filters = {}, pagination = {}) {
    const { search, mode, theme, status, page = 1, limit = 10, sort = { createdAt: -1 } } = pagination;
    const query = { deletedAt: null, ...filters };

    if (mode) query.mode = mode;
    if (theme) query.theme = new RegExp(theme, 'i');
    if (status) {
      if (status.includes(',')) {
        query.status = { $in: status.split(',') };
      } else {
        query.status = status;
      }
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      this.model
        .find(query)
        .populate('organizerId', 'name email avatar')
        .populate('judges', 'name email avatar')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(query).exec(),
    ]);

    return {
      items,
      meta: {
        page: Number(page),
        limit: Number(limit),
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async findByIdPopulated(id) {
    return await this.model
      .findOne({ _id: id, deletedAt: null })
      .populate('organizerId', 'name email avatar bio')
      .populate('judges', 'name email avatar skills')
      .exec();
  }

  async addJudge(hackathonId, judgeUserId) {
    return await this.model.findByIdAndUpdate(
      hackathonId,
      { $addToSet: { judges: judgeUserId } },
      { new: true }
    ).exec();
  }

  async removeJudge(hackathonId, judgeUserId) {
    return await this.model.findByIdAndUpdate(
      hackathonId,
      { $pull: { judges: judgeUserId } },
      { new: true }
    ).exec();
  }
}

export const hackathonRepository = new HackathonRepository();
