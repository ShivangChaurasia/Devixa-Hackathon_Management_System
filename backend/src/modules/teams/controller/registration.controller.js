import { registrationService } from '../service/registration.service.js';
import { ApiResponse } from '../../../common/utils/apiResponse.js';
import { asyncHandler } from '../../../common/middlewares/asyncHandler.js';

export class RegistrationController {
  register = asyncHandler(async (req, res) => {
    const registration = await registrationService.registerForHackathon(req.user._id, req.body.hackathonId);
    return ApiResponse.created(res, 'Registered for hackathon successfully', { registration });
  });

  cancel = asyncHandler(async (req, res) => {
    await registrationService.cancelRegistration(req.user._id, req.params.hackathonId);
    return ApiResponse.success(res, 'Registration cancelled successfully');
  });

  getUserRegistrations = asyncHandler(async (req, res) => {
    const registrations = await registrationService.getUserRegistrations(req.user._id);
    return ApiResponse.success(res, 'User registrations retrieved', { registrations });
  });

  getHackathonRegistrations = asyncHandler(async (req, res) => {
    const registrations = await registrationService.getHackathonRegistrations(req.params.hackathonId, req.user);
    return ApiResponse.success(res, 'Hackathon registrations retrieved', { registrations });
  });

  updateStatus = asyncHandler(async (req, res) => {
    const registration = await registrationService.updateRegistrationStatus(
      req.params.id,
      req.body.status,
      req.user
    );
    return ApiResponse.success(res, `Registration status updated to '${req.body.status}'`, { registration });
  });
}

export const registrationController = new RegistrationController();
