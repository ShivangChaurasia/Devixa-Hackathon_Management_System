import { authService } from './auth.service.js';
import { ApiResponse } from '../../common/utils/apiResponse.js';
import { asyncHandler } from '../../common/middlewares/asyncHandler.js';

export class AuthController {
  signup = asyncHandler(async (req, res) => {
    const { user, tokens } = await authService.register(req.body);
    return ApiResponse.created(res, 'User registered successfully', { user, tokens });
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, tokens } = await authService.login(email, password);
    return ApiResponse.success(res, 'Login successful', { user, tokens });
  });

  refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshTokens(refreshToken);
    return ApiResponse.success(res, 'Tokens refreshed successfully', { tokens });
  });

  logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    return ApiResponse.success(res, 'Logged out successfully');
  });

  getProfile = asyncHandler(async (req, res) => {
    const user = await authService.getProfile(req.user._id);
    return ApiResponse.success(res, 'Profile retrieved successfully', { user });
  });

  updateProfile = asyncHandler(async (req, res) => {
    const user = await authService.updateProfile(req.user._id, req.body);
    return ApiResponse.success(res, 'Profile updated successfully', { user });
  });

  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user._id, currentPassword, newPassword);
    return ApiResponse.success(res, 'Password changed successfully. Please log in again.');
  });
}

export const authController = new AuthController();
