import { judgingService } from './judging.service.js';
import { ApiResponse } from '../../common/utils/apiResponse.js';
import { asyncHandler } from '../../common/middlewares/asyncHandler.js';

export class JudgingController {
  evaluate = asyncHandler(async (req, res) => {
    const review = await judgingService.submitEvaluation(req.body, req.user);
    return ApiResponse.success(res, 'Evaluation submitted successfully', { review });
  });

  getAssignedProjects = asyncHandler(async (req, res) => {
    const submissions = await judgingService.getAssignedProjects(req.user);
    return ApiResponse.success(res, 'Assigned projects retrieved', { submissions });
  });

  getSubmissionReviews = asyncHandler(async (req, res) => {
    const reviews = await judgingService.getSubmissionReviews(req.params.submissionId, req.user);
    return ApiResponse.success(res, 'Submission reviews retrieved', { reviews });
  });
}

export const judgingController = new JudgingController();
