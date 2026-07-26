import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { config } from '../../config/env.config.js';
import { logger } from '../utils/logger.js';

const hasCloudinary = Boolean(
  (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) ||
  config.cloudinary.cloudinaryUrl
);

if (hasCloudinary) {
  if (config.cloudinary.cloudinaryUrl) {
    cloudinary.config({
      cloudinary_url: config.cloudinary.cloudinaryUrl,
    });
  } else {
    cloudinary.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
    });
  }
  logger.info('[StorageProvider] Cloudinary initialized successfully.');
} else {
  logger.info('[StorageProvider] Cloudinary credentials missing. Operating in local storage fallback mode.');
}

export class StorageProvider {
  static async uploadFile(fileBuffer, originalName, folder = 'devixa') {
    if (hasCloudinary) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `devixa/${folder}`,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              logger.error(`[StorageProvider] Cloudinary upload error: ${error.message}`);
              return reject(error);
            }
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              format: result.format,
            });
          }
        );
        uploadStream.end(fileBuffer);
      });
    }

    // Local Disk Fallback
    const uploadDir = path.resolve('uploads', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueFilename = `${Date.now()}_${originalName.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    fs.writeFileSync(filePath, fileBuffer);

    logger.info(`[StorageProvider] Saved file locally: ${filePath}`);
    return {
      url: `/uploads/${folder}/${uniqueFilename}`,
      publicId: uniqueFilename,
      format: path.extname(originalName).replace('.', ''),
    };
  }
}
