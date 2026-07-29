import { adminService } from './admin.service.js';
import { ApiResponse } from '../../common/utils/apiResponse.js';
import { asyncHandler } from '../../common/middlewares/asyncHandler.js';

export class AdminController {
  getAnalytics = asyncHandler(async (req, res) => {
    const analytics = await adminService.getPlatformAnalytics();
    return ApiResponse.success(res, 'Platform analytics retrieved', analytics);
  });

  listUsers = asyncHandler(async (req, res) => {
    const users = await adminService.listUsers(req.query);
    return ApiResponse.success(res, 'User directory retrieved', { users });
  });

  setUserStatus = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;
    const user = await adminService.setUserStatus(userId, status);
    return ApiResponse.success(res, `User status updated to '${status}'`, { user });
  });

  setUserRole = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
    const user = await adminService.setUserRole(userId, role);
    return ApiResponse.success(res, `User role updated to '${role}'`, { user });
  });

  listHackathons = asyncHandler(async (req, res) => {
    const hackathons = await adminService.listHackathons(req.query);
    return ApiResponse.success(res, 'Hackathon directory retrieved', { hackathons });
  });

  setHackathonStatus = asyncHandler(async (req, res) => {
    const { hackathonId } = req.params;
    const { status } = req.body;
    const hackathon = await adminService.setHackathonStatus(hackathonId, status);
    return ApiResponse.success(res, `Hackathon status updated to '${status}'`, { hackathon });
  });

  listSubmissions = asyncHandler(async (req, res) => {
    const submissions = await adminService.listSubmissions(req.query);
    return ApiResponse.success(res, 'Submissions retrieved', { submissions });
  });

  generateCertificate = asyncHandler(async (req, res) => {
    const { hackathonId, userId } = req.params;
    const certificate = await adminService.generateCertificate(hackathonId, userId);
    return ApiResponse.success(res, 'Certificate metadata generated', { certificate });
  });
}

export const adminController = new AdminController();
