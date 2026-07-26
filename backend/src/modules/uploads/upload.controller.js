import { StorageProvider } from '../../common/upload/cloudinary.provider.js';
import { ApiResponse } from '../../common/utils/apiResponse.js';
import { BadRequestError } from '../../common/errors/AppError.js';
import { asyncHandler } from '../../common/middlewares/asyncHandler.js';

export class UploadController {
  uploadSingle = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new BadRequestError('Please provide a file to upload');
    }

    const folder = req.body.folder || 'general';
    const result = await StorageProvider.uploadFile(req.file.buffer, req.file.originalname, folder);

    return ApiResponse.success(res, 'File uploaded successfully', result);
  });
}

export const uploadController = new UploadController();
