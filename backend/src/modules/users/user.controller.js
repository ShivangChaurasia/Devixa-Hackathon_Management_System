import { userService } from './user.service.js';
import { ApiResponse } from '../../common/utils/apiResponse.js';
import { asyncHandler } from '../../common/middlewares/asyncHandler.js';

class UserController {
  checkUsername = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const available = await userService.checkUsernameAvailability(username);
    return ApiResponse.success(res, 'Username checked', { available });
  });

  saveOnboarding = asyncHandler(async (req, res) => {
    const user = await userService.saveOnboarding(req.user._id, req.body);
    return ApiResponse.success(res, 'Onboarding completed', { user });
  });

  getPublicProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const profile = await userService.getPublicProfile(username);
    return ApiResponse.success(res, 'Profile fetched', { profile });
  });

  searchUsers = asyncHandler(async (req, res) => {
    const { q, query, role, limit, skip } = req.query;
    const searchQuery = q || query || '';
    const result = await userService.searchUsers(searchQuery, role, parseInt(limit) || 10, parseInt(skip) || 0);
    return ApiResponse.success(res, 'Users found', result);
  });

  getTheme = asyncHandler(async (req, res) => {
    const theme = await userService.getTheme(req.user._id);
    return ApiResponse.success(res, 'Theme fetched', { theme });
  });

  updateTheme = asyncHandler(async (req, res) => {
    const theme = await userService.updateTheme(req.user._id, req.body.theme);
    return ApiResponse.success(res, 'Theme updated', { theme });
  });
}

export const userController = new UserController();
