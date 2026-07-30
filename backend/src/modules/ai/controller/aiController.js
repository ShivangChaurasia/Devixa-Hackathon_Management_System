import { aiService } from '../service/aiService.js';
import { ApiResponse } from '../../../common/utils/apiResponse.js';
import { asyncHandler } from '../../../common/middlewares/asyncHandler.js';

export class AIController {
  reviewCode = asyncHandler(async (req, res) => {
    const result = await aiService.reviewCode(req.body);
    return ApiResponse.success(res, 'Code review completed', result);
  });

  generateREADME = asyncHandler(async (req, res) => {
    const result = await aiService.generateREADME(req.body);
    return ApiResponse.success(res, 'README generated successfully', result);
  });

  analyzeSubmission = asyncHandler(async (req, res) => {
    const result = await aiService.analyzeSubmission(req.body);
    return ApiResponse.success(res, 'Submission analysis completed', result);
  });

  summarize = asyncHandler(async (req, res) => {
    const result = await aiService.summarizeText(req.body);
    return ApiResponse.success(res, 'Text summarized successfully', result);
  });

  getHealth = asyncHandler(async (req, res) => {
    const health = aiService.getProviderHealth();
    return ApiResponse.success(res, 'AI Providers health status', health);
  });

  chat = asyncHandler(async (req, res) => {
    const result = await aiService.chat({ ...req.body, user: req.user });
    return ApiResponse.success(res, 'Chat response generated', result);
  });
}

export const aiController = new AIController();
