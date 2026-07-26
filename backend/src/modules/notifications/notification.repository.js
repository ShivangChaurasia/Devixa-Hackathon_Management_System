import { BaseRepository } from '../../common/repository/BaseRepository.js';
import { Notification } from './notification.model.js';

export class NotificationRepository extends BaseRepository {
  constructor() {
    super(Notification);
  }

  async findUserNotifications(userId) {
    return await this.model.find({ userId, deletedAt: null }).sort({ createdAt: -1 }).limit(50).exec();
  }

  async markAllAsRead(userId) {
    return await this.model.updateMany({ userId, isRead: false }, { isRead: true }).exec();
  }
}

export const notificationRepository = new NotificationRepository();
