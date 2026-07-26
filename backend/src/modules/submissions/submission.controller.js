import { submissionService } from './submission.service.js';
import { ApiResponse } from '../../common/utils/apiResponse.js';
import { asyncHandler } from '../../common/middlewares/asyncHandler.js';

export class SubmissionController {
  create = asyncHandler(async (req, res) => {
    const submission = await submissionService.createSubmission(req.body, req.user._id);
    return ApiResponse.created(res, 'Project submitted successfully', { submission });
  });

  getById = asyncHandler(async (req, res) => {
    const submission = await submissionService.getSubmissionById(req.params.id);
    return ApiResponse.success(res, 'Submission details retrieved', { submission });
  });

  listByHackathon = asyncHandler(async (req, res) => {
    const submissions = await submissionService.getHackathonSubmissions(req.params.hackathonId, req.user);
    return ApiResponse.success(res, 'Hackathon submissions retrieved', { submissions });
  });

  update = asyncHandler(async (req, res) => {
    const submission = await submissionService.updateSubmission(req.params.id, req.body, req.user._id);
    return ApiResponse.success(res, 'Project submission updated', { submission });
  });

  updateStatus = asyncHandler(async (req, res) => {
    const submission = await submissionService.updateStatus(req.params.id, req.body.status, req.user);
    return ApiResponse.success(res, `Submission status changed to '${req.body.status}'`, { submission });
  });
}

export const submissionController = new SubmissionController();
