import { notificationService } from './notification.service.js';
import { ApiResponse } from '../../common/utils/apiResponse.js';
import { asyncHandler } from '../../common/middlewares/asyncHandler.js';

export class NotificationController {
  getUserNotifications = asyncHandler(async (req, res) => {
    const notifications = await notificationService.getUserNotifications(req.user._id);
    return ApiResponse.success(res, 'User notifications retrieved', { notifications });
  });

  markAsRead = asyncHandler(async (req, res) => {
    await notificationService.markAsRead(req.user._id);
    return ApiResponse.success(res, 'Notifications marked as read');
  });
}

export const notificationController = new NotificationController();
