import { notificationRepository } from './notification.repository.js';
import { socketManager } from '../../common/socket/socket.manager.js';

export class NotificationService {
  async sendNotification({ userId, title, message, type = 'SYSTEM', link = '' }) {
    const notification = await notificationRepository.create({
      userId,
      title,
      message,
      type,
      link,
    });

    // Realtime Push via WebSocket
    socketManager.broadcast(`notification:${userId}`, notification);

    return notification;
  }

  async getUserNotifications(userId) {
    return await notificationRepository.findUserNotifications(userId);
  }

  async markAsRead(userId) {
    return await notificationRepository.markAllAsRead(userId);
  }
}

export const notificationService = new NotificationService();
